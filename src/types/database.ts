// D1 Database Binding Type
export type Bindings = {
  DB: D1Database;
}

// Database Table Types
export interface Region {
  id: number;
  name: string;
  province: string;
  city: string;
  population_risk_level: number;
  elderly_rate: number;
  empty_house_rate: number;
  lat: number | null;
  lng: number | null;
  support_budget: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmptyHouse {
  id: number;
  region_id: number;
  address: string;
  lat: number;
  lng: number;
  house_type: string | null;
  area: number | null;
  price: number | null;
  rental_type: string | null;
  monthly_rent: number | null;
  deposit: number | null;
  status: string;
  facilities: string | null;
  images: string | null;
  contact: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface SmartFarm {
  id: number;
  region_id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  farm_type: string | null;
  crop_type: string | null;
  area: number | null;
  capacity: number | null;
  facilities: string | null;
  education_available: number;
  rental_available: number;
  rental_price: number | null;
  images: string | null;
  contact: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Farmland {
  id: number;
  region_id: number;
  address: string;
  lat: number;
  lng: number;
  land_type: string | null;
  area: number;
  price: number | null;
  rental_type: string | null;
  monthly_rent: number | null;
  deposit: number | null;
  soil_type: string | null;
  water_access: number;
  road_access: number;
  status: string;
  images: string | null;
  contact: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface EducationProgram {
  id: number;
  region_id: number | null;
  title: string;
  category: string | null;
  duration: number | null;
  capacity: number | null;
  price: number;
  schedule: string | null;
  location: string | null;
  online_available: number;
  instructor: string | null;
  description: string | null;
  syllabus: string | null;
  images: string | null;
  created_at: string;
  updated_at: string;
}

export interface SettlementPackage {
  id: number;
  region_id: number;
  name: string;
  target_group: string | null;
  housing_support: number;
  education_support: number;
  startup_support: number;
  farmland_support: number;
  duration: number | null;
  requirements: string | null;
  benefits: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface SuccessStory {
  id: number;
  region_id: number;
  title: string;
  author: string | null;
  age_group: string | null;
  previous_job: string | null;
  settlement_year: number | null;
  business_type: string | null;
  annual_revenue: number | null;
  content: string | null;
  images: string | null;
  video_url: string | null;
  created_at: string;
}
