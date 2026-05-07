// ============================================================
// src/types/database.ts
// ⚠️ ضع هذا الملف في: src/types/database.ts
// ============================================================

// ─── Enums ────────────────────────────────────────────────────
export type UserRole          = "user" | "agent" | "developer" | "admin";
export type PropertyStatus    = "for_sale" | "for_rent" | "pre_booking" | "sold" | "rented";
export type PropertyType      = "apartment" | "villa" | "duplex" | "office" | "land" | "warehouse" | "chalet";
export type PropertyBadge     = "featured" | "new" | "discount";
export type InquiryStatus     = "pending" | "in_progress" | "resolved" | "closed";
export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type ArticleStatus     = "draft" | "published" | "archived";
export type Furnishing        = "furnished" | "semi_furnished" | "unfurnished";
export type FeatureCategory   = "interior" | "exterior" | "building" | "nearby";

// ─── Row Types ────────────────────────────────────────────────

export interface Profile {
  id:             string;
  full_name:      string;
  full_name_en:   string | null;
  phone:          string | null;
  avatar_url:     string | null;
  role:           UserRole;
  preferred_lang: "ar" | "en";
  dark_mode:      boolean;
  is_verified:    boolean;
  is_active:      boolean;
  created_at:     string;
  updated_at:     string;
}

export interface City {
  id:         number;
  name_ar:    string;
  name_en:    string;
  region_ar:  string | null;
  region_en:  string | null;
  latitude:   number | null;
  longitude:  number | null;
  svg_x:      number | null;
  svg_y:      number | null;
  is_active:  boolean;
  created_at: string;
}

export interface Developer {
  id:             string;
  name_ar:        string;
  name_en:        string | null;
  slug:           string;
  logo_url:       string | null;
  description_ar: string | null;
  description_en: string | null;
  website:        string | null;
  phone:          string | null;
  email:          string | null;
  city_id:        number | null;
  is_verified:    boolean;
  is_active:      boolean;
  created_at:     string;
  updated_at:     string;
}

export interface Property {
  id:              string;
  title_ar:        string;
  title_en:        string | null;
  description_ar:  string | null;
  description_en:  string | null;
  slug:            string;
  type:            PropertyType;
  status:          PropertyStatus;
  badge:           PropertyBadge | null;
  city_id:         number;
  district_ar:     string | null;
  district_en:     string | null;
  address_ar:      string | null;
  address_en:      string | null;
  latitude:        number | null;
  longitude:       number | null;
  google_maps_url: string | null;
  price:           number;
  price_currency:  string;
  price_per_unit:  number | null;
  is_negotiable:   boolean;
  area:            number;
  bedrooms:        number | null;
  bathrooms:       number | null;
  floors:          number | null;
  floor_number:    number | null;
  parking_spaces:  number;
  year_built:      number | null;
  furnishing:      Furnishing | null;
  developer_id:    string | null;
  agent_id:        string | null;
  thumbnail_url:   string | null;
  video_url:       string | null;
  views_count:     number;
  favorites_count: number;
  inquiries_count: number;
  rating_avg:      number;
  rating_count:    number;
  is_featured:     boolean;
  is_active:       boolean;
  is_verified:     boolean;
  published_at:    string | null;
  created_at:      string;
  updated_at:      string;
}

export interface PropertyImage {
  id:          string;
  property_id: string;
  url:         string;
  alt_ar:      string | null;
  alt_en:      string | null;
  sort_order:  number;
  is_primary:  boolean;
  created_at:  string;
}

export interface Feature {
  id:       number;
  name_ar:  string;
  name_en:  string | null;
  icon:     string | null;
  category: FeatureCategory | null;
}

export interface Favorite {
  id:          string;
  user_id:     string;
  property_id: string;
  created_at:  string;
}

export interface Review {
  id:          string;
  user_id:     string;
  property_id: string;
  rating:      number;
  comment:     string | null;
  is_approved: boolean;
  created_at:  string;
}

export interface Inquiry {
  id:          string;
  property_id: string;
  user_id:     string | null;
  guest_name:  string | null;
  guest_phone: string | null;
  guest_email: string | null;
  message:     string;
  status:      InquiryStatus;
  agent_notes: string | null;
  created_at:  string;
  updated_at:  string;
}

export interface Appointment {
  id:           string;
  property_id:  string;
  user_id:      string | null;
  agent_id:     string | null;
  scheduled_at: string;
  duration_min: number;
  notes:        string | null;
  status:       AppointmentStatus;
  created_at:   string;
  updated_at:   string;
}

export interface Article {
  id:            string;
  title_ar:      string;
  title_en:      string | null;
  slug:          string;
  excerpt_ar:    string | null;
  excerpt_en:    string | null;
  content_ar:    string | null;
  content_en:    string | null;
  category_ar:   string | null;
  category_en:   string | null;
  cover_url:     string | null;
  author_id:     string | null;
  read_time_min: number | null;
  views_count:   number;
  status:        ArticleStatus;
  published_at:  string | null;
  created_at:    string;
  updated_at:    string;
}

// ─── Joined / Rich Types ──────────────────────────────────────

export interface PropertyWithRelations extends Property {
  city:      City;
  developer: Developer | null;
  agent:     Profile | null;
  images:    PropertyImage[];
  features:  Feature[];
}

export interface ArticleWithAuthor extends Article {
  author: Profile | null;
}

export interface ReviewWithUser extends Review {
  user: Pick<Profile, "id" | "full_name" | "avatar_url">;
}

// ─── Insert / Update Payload Types ───────────────────────────

export type PropertyInsert = Omit<
  Property,
  | "id" | "views_count" | "favorites_count" | "inquiries_count"
  | "rating_avg" | "rating_count" | "created_at" | "updated_at"
>;
export type PropertyUpdate      = Partial<PropertyInsert>;
export type InquiryInsert       = Omit<Inquiry,     "id" | "status" | "agent_notes" | "created_at" | "updated_at">;
export type ReviewInsert        = Omit<Review,      "id" | "is_approved" | "created_at">;
export type AppointmentInsert   = Omit<Appointment, "id" | "status" | "created_at" | "updated_at">;

// ─── Supabase Database Definition ────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row:    Profile;
        Insert: Partial<Profile>;
        Update: Partial<Profile>;
      };
      cities: {
        Row:    City;
        Insert: Omit<City, "id" | "created_at">;
        Update: Partial<City>;
      };
      developers: {
        Row:    Developer;
        Insert: Omit<Developer, "id" | "created_at" | "updated_at">;
        Update: Partial<Developer>;
      };
      properties: {
        Row:    Property;
        Insert: PropertyInsert;
        Update: PropertyUpdate;
      };
      property_images: {
        Row:    PropertyImage;
        Insert: Omit<PropertyImage, "id" | "created_at">;
        Update: Partial<PropertyImage>;
      };
      features: {
        Row:    Feature;
        Insert: Omit<Feature, "id">;
        Update: Partial<Feature>;
      };
      property_features: {
        Row:    { property_id: string; feature_id: number };
        Insert: { property_id: string; feature_id: number };
        Update: never;
      };
      favorites: {
        Row:    Favorite;
        Insert: Omit<Favorite, "id" | "created_at">;
        Update: never;
      };
      reviews: {
        Row:    Review;
        Insert: ReviewInsert;
        Update: Partial<Review>;
      };
      inquiries: {
        Row:    Inquiry;
        Insert: InquiryInsert;
        Update: Partial<Inquiry>;
      };
      appointments: {
        Row:    Appointment;
        Insert: AppointmentInsert;
        Update: Partial<Appointment>;
      };
      articles: {
        Row:    Article;
        Insert: Omit<Article, "id" | "views_count" | "created_at" | "updated_at">;
        Update: Partial<Article>;
      };
      newsletter_subscribers: {
        Row:    { id: string; email: string; is_active: boolean; subscribed_at: string };
        Insert: { email: string };
        Update: never;
      };
    };
    Enums: {
      user_role:          UserRole;
      property_status:    PropertyStatus;
      property_type:      PropertyType;
      property_badge:     PropertyBadge;
      inquiry_status:     InquiryStatus;
      appointment_status: AppointmentStatus;
      article_status:     ArticleStatus;
    };
  };
}