import 'server-only';
import { connectToDatabase } from '@/server/db/mongoose';
import { generateRandomToken, hashToken } from '@/server/auth/crypto';
import { createConflictError, createNotFoundError } from '@/server/http/errors';
import { WeddingRepository } from '@/modules/wedding/wedding.repository';
import {
  calculateDaysRemaining,
  createWeddingSchema,
  generateBaseWeddingSlug,
  updateWeddingSchema,
  validateWeddingPayload,
} from '@/modules/wedding/wedding.validation';
import type {
  CreateWeddingDTO,
  WeddingDashboardDTO,
  WeddingDetailDTO,
} from '@/modules/wedding/wedding.types';
import type { IWeddingDocument } from '@/modules/wedding/wedding.model';

function mapWeddingToDetailDTO(wedding: IWeddingDocument): WeddingDetailDTO {
  return {
    id: wedding._id.toString(),
    brideName: wedding.brideName,
    groomName: wedding.groomName,
    title: wedding.title ?? null,
    description: wedding.description ?? null,
    weddingDate: wedding.weddingDate,
    timeZone: wedding.timeZone,
    location: {
      formattedAddress: wedding.location?.formattedAddress ?? null,
      city: wedding.location?.city ?? null,
      state: wedding.location?.state ?? null,
      country: wedding.location?.country ?? null,
      latitude: wedding.location?.latitude ?? null,
      longitude: wedding.location?.longitude ?? null,
      googlePlaceId: wedding.location?.googlePlaceId ?? null,
    },
    website: {
      slug: wedding.website.slug,
      theme: wedding.website.theme,
      isPublished: wedding.website.isPublished,
      welcomeMessage: wedding.website.welcomeMessage ?? null,
    },
    gallery: {
      isEnabled: wedding.gallery.isEnabled,
      guestUploadsEnabled: wedding.gallery.guestUploadsEnabled,
    },
    livestream: {
      youtubeUrl: wedding.livestream?.youtubeUrl ?? null,
      isEnabled: wedding.livestream?.isEnabled ?? false,
    },
  };
}

export const WeddingService = {
  async createWedding(
    userId: string,
    payload: unknown
  ): Promise<CreateWeddingDTO> {
    const input = validateWeddingPayload(createWeddingSchema, payload);
    await connectToDatabase();

    const existingMembership =
      await WeddingRepository.findMembershipByUserId(userId);
    if (existingMembership) {
      throw createConflictError(
        'ALREADY_HAS_WEDDING',
        'You already belong to a wedding workspace.'
      );
    }

    const baseSlug =
      input.slug && input.slug.length > 0
        ? input.slug
        : generateBaseWeddingSlug(
            input.brideName,
            input.groomName,
            input.weddingDate
          );

    const uniqueSlug = await WeddingRepository.resolveUniqueSlug(baseSlug);
    const galleryToken = generateRandomToken(32);
    const galleryTokenHash = hashToken(galleryToken);

    const { wedding } = await WeddingRepository.createWeddingWithAdminMembership({
      userId,
      brideName: input.brideName,
      groomName: input.groomName,
      title: input.title ?? `${input.brideName} & ${input.groomName}`,
      description: input.description ?? null,
      weddingDate: input.weddingDate,
      timeZone: input.timeZone ?? 'Asia/Kolkata',
      location: input.location,
      slug: uniqueSlug,
      galleryToken,
      galleryTokenHash,
    });

    return {
      id: wedding._id.toString(),
      brideName: wedding.brideName,
      groomName: wedding.groomName,
      weddingDate: wedding.weddingDate,
      website: {
        slug: wedding.website.slug,
      },
    };
  },

  async getWedding(weddingId: string): Promise<WeddingDetailDTO> {
    await connectToDatabase();

    const wedding = await WeddingRepository.findWeddingById(weddingId);
    if (!wedding) {
      throw createNotFoundError('Wedding workspace not found');
    }

    return mapWeddingToDetailDTO(wedding);
  },

  async updateWedding(
    weddingId: string,
    payload: unknown
  ): Promise<WeddingDetailDTO> {
    const input = validateWeddingPayload(updateWeddingSchema, payload);
    await connectToDatabase();

    const updated = await WeddingRepository.updateWeddingById(weddingId, {
      brideName: input.brideName,
      groomName: input.groomName,
      title: input.title,
      description: input.description,
      weddingDate: input.weddingDate,
      timeZone: input.timeZone,
      location: input.location,
    });

    if (!updated) {
      throw createNotFoundError('Wedding workspace not found');
    }

    return mapWeddingToDetailDTO(updated);
  },

  async getDashboard(weddingId: string): Promise<WeddingDashboardDTO> {
    await connectToDatabase();

    const [wedding, metrics] = await Promise.all([
      WeddingRepository.findWeddingById(weddingId),
      WeddingRepository.getDashboardMetrics(weddingId),
    ]);

    if (!wedding) {
      throw createNotFoundError('Wedding workspace not found');
    }

    const daysRemaining = calculateDaysRemaining(wedding.weddingDate);

    return {
      wedding: {
        id: wedding._id.toString(),
        brideName: wedding.brideName,
        groomName: wedding.groomName,
        title: wedding.title ?? null,
        weddingDate: wedding.weddingDate,
        timeZone: wedding.timeZone,
        city: wedding.location?.city ?? null,
        slug: wedding.website.slug,
      },
      countdown: {
        weddingDate: wedding.weddingDate,
        daysRemaining,
      },
      summary: {
        events: metrics.eventsCount,
        tasks: {
          total: metrics.tasksTotal,
          completed: metrics.tasksCompleted,
        },
        guests: metrics.guestsCount,
        rsvps: {
          pending: metrics.rsvpPending,
          attending: metrics.rsvpAttending,
          notAttending: metrics.rsvpNotAttending,
        },
        totalExpensePaise: metrics.totalExpensePaise,
        vendors: metrics.vendorsCount,
      },
      upcomingEvents: metrics.upcomingEvents,
      upcomingTasks: metrics.upcomingTasks,
    };
  },
};

