
// /lib/types.ts

// =================================
// Catalogue Service Types
// =================================

/**
 * Represents a category for organizing videos.
 */
export interface Category {
  id: string; // Unique identifier (e.g., UUID)
  name: string; // Name of the category (e.g., "Entertainment", "Education")
  description?: string; // Optional description
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

/**
 * Represents the type of content (e.g., Movie, Series, Clip).
 */
export interface ContentType {
  id: string;
  name: string; // e.g., "Movie", "TV Show", "Short Film"
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a director of a video.
 */
export interface Director {
  id: string;
  name: string; // Full name of the director
  bio?: string; // A short biography
  avatarUrl?: string; // URL to a profile picture
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents an actor who appears in a video.
 */
export interface Actor {
  id: string;
  name: string; // Full name of the actor
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a genre for classifying videos.
 */
export interface Genre {
  id: string;
  name: string; // e.g., "Action", "Comedy", "Drama"
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a video resolution.
 */
export interface Resolution {
  id: string;
  name: string; // e.g., "1080p", "720p", "4K"
  description?: string; // e.g., "Full HD", "HD"
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents the original bitrate of a video file.
 */
export interface OriginalBitrate {
  id: string;
  value: number; // e.g., 5000 (for 5000 kbps)
  unit: 'kbps' | 'Mbps'; // Kilobits or Megabits per second
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// =================================
// Video Service Types
// =================================

/**
 * Represents a single video record in the system.
 */
export interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string; // URL to the main video file
  thumbnail_url: string; // URL to the video thumbnail
  creators_name: string;
  year_of_production: number;
  parental_rating: string; // e.g., "G", "PG", "PG-13", "R"
  genres: Genre[]; // Array of associated genres
  actors: Actor[]; // Array of associated actors
  directors: Director[]; // Array of associated directors
  category: Category; // The primary category
  content_type: ContentType; // The type of content
  language: string;
  country_of_production: string;
  tags: string[];
  duration_in_minutes: number;
  resolutions: Resolution[]; // Available resolutions
  original_bitrate?: OriginalBitrate;
  trailer_url?: string;
  subtitle_urls?: Record<string, string>; // e.g., { "en": "url_to_en.vtt", "fr": "url_to_fr.vtt" }
  is_paid: boolean;
  price?: number; // Required if is_paid is true
  is_featured: boolean;
  publication_date: string; // ISO 8601 date string
  createdAt: string;
  updatedAt: string;
}

// =================================
// User & Notification Service Types
// =================================

/**
 * Represents a user in the system.
 */
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role: 'admin' | 'creator' | 'viewer';
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a notification or email sent to a user.
 */
export interface Notification {
  id: string;
  recipient: User | string; // User object or email string
  subject: string;
  message: string;
  status: 'sent' | 'failed' | 'pending';
  createdAt: string;
}
