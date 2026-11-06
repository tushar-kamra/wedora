import 'server-only';
import mongoose from 'mongoose';
import {
  WeddingModel,
  type IWeddingDocument,
  type IWeddingLocation,
} from '@/modules/wedding/wedding.model';
import {
  WeddingMembershipModel,
  type IWeddingMembershipDocument,
} from '@/modules/members/membership.model';
import type {
  DashboardEventItemDTO,
  DashboardTaskItemDTO,
} from '@/modules/wedding/wedding.types';

export interface CreateWeddingRecordParams {
  userId: string;
  brideName: string;
  groomName: string;
  title?: string | null;
  description?: string | null;
  weddingDate: string;
  timeZone: string;
  location?: IWeddingLocation;
  slug: string;
  galleryToken: string;
  galleryTokenHash: string;
}

export const WeddingRepository = {
  async findMembershipByUserId(
    userId: string
  ): Promise<IWeddingMembershipDocument | null> {
    return WeddingMembershipModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });
  },

  async slugExists(slug: string): Promise<boolean> {
    const existing = await WeddingModel.exists({ 'website.slug': slug });
    return Boolean(existing);
  },

  async resolveUniqueSlug(baseSlug: string): Promise<string> {
    let candidate = baseSlug;
    let counter = 2;

    while (await this.slugExists(candidate)) {
      candidate = `${baseSlug}-${counter}`;
      counter += 1;
    }

    return candidate;
  },

  async createWeddingWithAdminMembership(
    params: CreateWeddingRecordParams
  ): Promise<{
    wedding: IWeddingDocument;
    membership: IWeddingMembershipDocument;
  }> {
    const userObjectId = new mongoose.Types.ObjectId(params.userId);
    const session = await mongoose.startSession();

    try {
      let createdWedding: IWeddingDocument | null = null;
      let createdMembership: IWeddingMembershipDocument | null = null;

      await session.withTransaction(async () => {
        const [weddingDoc] = await WeddingModel.create(
          [
            {
              brideName: params.brideName,
              groomName: params.groomName,
              title: params.title ?? `${params.brideName} & ${params.groomName}`,
              description: params.description ?? null,
              weddingDate: params.weddingDate,
              timeZone: params.timeZone,
              location: {
                formattedAddress: params.location?.formattedAddress ?? null,
                city: params.location?.city ?? null,
                state: params.location?.state ?? null,
                country: params.location?.country ?? null,
                latitude: params.location?.latitude ?? null,
                longitude: params.location?.longitude ?? null,
                googlePlaceId: params.location?.googlePlaceId ?? null,
              },
              website: {
                slug: params.slug,
                theme: 'CLASSIC',
                isPublished: false,
                welcomeMessage: params.description ?? null,
              },
              gallery: {
                token: params.galleryToken,
                tokenHash: params.galleryTokenHash,
                isEnabled: true,
                guestUploadsEnabled: false,
              },
              livestream: {
                youtubeUrl: null,
                isEnabled: false,
              },
              createdByUserId: userObjectId,
              deletedAt: null,
            },
          ],
          { session }
        );

        const [membershipDoc] = await WeddingMembershipModel.create(
          [
            {
              userId: userObjectId,
              weddingId: weddingDoc._id,
              role: 'ADMIN',
              joinedAt: new Date(),
            },
          ],
          { session }
        );

        createdWedding = weddingDoc;
        createdMembership = membershipDoc;
      });

      if (!createdWedding || !createdMembership) {
        throw new Error('Failed to create wedding and admin membership');
      }

      return {
        wedding: createdWedding,
        membership: createdMembership,
      };
    } finally {
      await session.endSession();
    }
  },

  async findWeddingById(weddingId: string): Promise<IWeddingDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(weddingId)) {
      return null;
    }
    return WeddingModel.findOne({
      _id: new mongoose.Types.ObjectId(weddingId),
      deletedAt: null,
    });
  },

  async updateWeddingById(
    weddingId: string,
    updates: {
      brideName?: string;
      groomName?: string;
      title?: string | null;
      description?: string | null;
      weddingDate?: string;
      timeZone?: string;
      location?: IWeddingLocation;
    }
  ): Promise<IWeddingDocument | null> {
    const setFields: Record<string, unknown> = {};

    if (updates.brideName !== undefined) {
      setFields.brideName = updates.brideName;
    }
    if (updates.groomName !== undefined) {
      setFields.groomName = updates.groomName;
    }
    if (updates.title !== undefined) {
      setFields.title = updates.title;
    }
    if (updates.description !== undefined) {
      setFields.description = updates.description;
    }
    if (updates.weddingDate !== undefined) {
      setFields.weddingDate = updates.weddingDate;
    }
    if (updates.timeZone !== undefined) {
      setFields.timeZone = updates.timeZone;
    }
    if (updates.location !== undefined) {
      const loc = updates.location;
      if (loc.formattedAddress !== undefined) {
        setFields['location.formattedAddress'] = loc.formattedAddress;
      }
      if (loc.city !== undefined) {
        setFields['location.city'] = loc.city;
      }
      if (loc.state !== undefined) {
        setFields['location.state'] = loc.state;
      }
      if (loc.country !== undefined) {
        setFields['location.country'] = loc.country;
      }
      if (loc.latitude !== undefined) {
        setFields['location.latitude'] = loc.latitude;
      }
      if (loc.longitude !== undefined) {
        setFields['location.longitude'] = loc.longitude;
      }
      if (loc.googlePlaceId !== undefined) {
        setFields['location.googlePlaceId'] = loc.googlePlaceId;
      }
    }

    return WeddingModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(weddingId),
        deletedAt: null,
      },
      { $set: setFields },
      { new: true }
    );
  },

  async getDashboardMetrics(weddingId: string): Promise<{
    eventsCount: number;
    tasksTotal: number;
    tasksCompleted: number;
    guestsCount: number;
    rsvpPending: number;
    rsvpAttending: number;
    rsvpNotAttending: number;
    totalExpensePaise: number;
    vendorsCount: number;
    upcomingEvents: DashboardEventItemDTO[];
    upcomingTasks: DashboardTaskItemDTO[];
  }> {
    const db = mongoose.connection.db;
    if (!db) {
      return {
        eventsCount: 0,
        tasksTotal: 0,
        tasksCompleted: 0,
        guestsCount: 0,
        rsvpPending: 0,
        rsvpAttending: 0,
        rsvpNotAttending: 0,
        totalExpensePaise: 0,
        vendorsCount: 0,
        upcomingEvents: [],
        upcomingTasks: [],
      };
    }

    const weddingObjectId = new mongoose.Types.ObjectId(weddingId);

    const [
      eventsCount,
      tasksTotal,
      tasksCompleted,
      guestsDocs,
      expensesAgg,
      vendorsCount,
      upcomingEventsRaw,
      upcomingTasksRaw,
    ] = await Promise.all([
      db.collection('events').countDocuments({
        weddingId: weddingObjectId,
        archivedAt: null,
      }),
      db.collection('tasks').countDocuments({
        weddingId: weddingObjectId,
      }),
      db.collection('tasks').countDocuments({
        weddingId: weddingObjectId,
        status: 'COMPLETED',
      }),
      db
        .collection('guests')
        .find(
          { weddingId: weddingObjectId },
          { projection: { 'rsvp.status': 1 } }
        )
        .toArray(),
      db
        .collection('expenses')
        .aggregate<{ totalPaise: number }>([
          { $match: { weddingId: weddingObjectId } },
          { $group: { _id: null, totalPaise: { $sum: '$amountPaise' } } },
        ])
        .toArray(),
      db.collection('vendors').countDocuments({
        weddingId: weddingObjectId,
      }),
      db
        .collection('events')
        .find({
          weddingId: weddingObjectId,
          archivedAt: null,
        })
        .sort({ startAt: 1, sortOrder: 1 })
        .limit(5)
        .toArray(),
      db
        .collection('tasks')
        .find({
          weddingId: weddingObjectId,
        })
        .sort({ status: -1, dueDate: 1, createdAt: -1 })
        .limit(6)
        .toArray(),
    ]);

    let rsvpPending = 0;
    let rsvpAttending = 0;
    let rsvpNotAttending = 0;

    for (const g of guestsDocs) {
      const status = g.rsvp?.status ?? 'PENDING';
      if (status === 'ATTENDING') rsvpAttending += 1;
      else if (status === 'NOT_ATTENDING') rsvpNotAttending += 1;
      else rsvpPending += 1;
    }

    const upcomingEvents: DashboardEventItemDTO[] = upcomingEventsRaw.map(
      (ev) => ({
        id: String(ev._id),
        title: String(ev.title ?? ''),
        startAt:
          ev.startAt instanceof Date
            ? ev.startAt.toISOString()
            : String(ev.startAt ?? ''),
        endAt:
          ev.endAt instanceof Date
            ? ev.endAt.toISOString()
            : ev.endAt
              ? String(ev.endAt)
              : null,
        venueName: ev.venue?.name ?? null,
        city: ev.venue?.city ?? null,
        dressCode: ev.dressCode ?? null,
      })
    );

    const upcomingTasks: DashboardTaskItemDTO[] = upcomingTasksRaw.map((t) => ({
      id: String(t._id),
      title: String(t.title ?? ''),
      status: t.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING',
      priority:
        t.priority === 'HIGH' || t.priority === 'LOW' ? t.priority : 'MEDIUM',
      dueDate:
        t.dueDate instanceof Date
          ? t.dueDate.toISOString()
          : t.dueDate
            ? String(t.dueDate)
            : null,
    }));

    return {
      eventsCount,
      tasksTotal,
      tasksCompleted,
      guestsCount: guestsDocs.length,
      rsvpPending,
      rsvpAttending,
      rsvpNotAttending,
      totalExpensePaise: expensesAgg[0]?.totalPaise ?? 0,
      vendorsCount,
      upcomingEvents,
      upcomingTasks,
    };
  },
};

