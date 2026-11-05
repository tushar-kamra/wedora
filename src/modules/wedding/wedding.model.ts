import 'server-only';
import mongoose, { Schema, type Document, type Model } from 'mongoose';

export type WebsiteTheme = 'CLASSIC' | 'MINIMAL' | 'MODERN';

export interface IWeddingLocation {
  formattedAddress?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  googlePlaceId?: string | null;
}

export interface IWeddingWebsite {
  slug: string;
  theme: WebsiteTheme;
  isPublished: boolean;
  welcomeMessage?: string | null;
}

export interface IWeddingGallery {
  token: string;
  tokenHash: string;
  isEnabled: boolean;
  guestUploadsEnabled: boolean;
}

export interface IWeddingLivestream {
  youtubeUrl?: string | null;
  isEnabled: boolean;
}

export interface IWeddingDocument extends Document {
  _id: mongoose.Types.ObjectId;
  brideName: string;
  groomName: string;
  title?: string | null;
  description?: string | null;
  weddingDate: string;
  timeZone: string;
  coverImageObjectKey?: string | null;
  location: IWeddingLocation;
  website: IWeddingWebsite;
  gallery: IWeddingGallery;
  livestream: IWeddingLivestream;
  createdByUserId: mongoose.Types.ObjectId;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const weddingSchema = new Schema<IWeddingDocument>(
  {
    brideName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    groomName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    title: {
      type: String,
      default: null,
      trim: true,
      maxlength: 160,
    },
    description: {
      type: String,
      default: null,
      trim: true,
      maxlength: 2000,
    },
    weddingDate: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    timeZone: {
      type: String,
      required: true,
      default: 'Asia/Kolkata',
    },
    coverImageObjectKey: {
      type: String,
      default: null,
    },
    location: {
      formattedAddress: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      country: { type: String, default: null },
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      googlePlaceId: { type: String, default: null },
    },
    website: {
      slug: { type: String, required: true, trim: true, lowercase: true },
      theme: {
        type: String,
        enum: ['CLASSIC', 'MINIMAL', 'MODERN'],
        default: 'CLASSIC',
      },
      isPublished: { type: Boolean, default: false },
      welcomeMessage: { type: String, default: null },
    },
    gallery: {
      token: { type: String, required: true, select: false },
      tokenHash: { type: String, required: true },
      isEnabled: { type: Boolean, default: true },
      guestUploadsEnabled: { type: Boolean, default: false },
    },
    livestream: {
      youtubeUrl: { type: String, default: null },
      isEnabled: { type: Boolean, default: false },
    },
    createdByUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    collection: 'weddings',
    timestamps: true,
  }
);

weddingSchema.index({ 'website.slug': 1 }, { unique: true });
weddingSchema.index({ 'gallery.tokenHash': 1 }, { unique: true });
weddingSchema.index({ createdAt: 1 });

export const WeddingModel: Model<IWeddingDocument> =
  (mongoose.models.Wedding as Model<IWeddingDocument>) ||
  mongoose.model<IWeddingDocument>('Wedding', weddingSchema);

