// types/index.ts - Shared TypeScript types for CVD Website

export interface UserProfile {
  id: string;
  email?: string;
  // ── actual columns in Supabase (set by Flutter app) ──
  name: string | null;          // Flutter writes "name", NOT "full_name"
  avatar_url: string | null;
  age: number | null;           // stored as integer
  gender: string | null;        // e.g. "male" / "female"
  height: number | null;        // cm
  weight: number | null;        // kg
  dob?: string | null;          // Date of Birth
  // ── optional extras ──
  created_at?: string;
  updated_at?: string;
}

export interface Prediction {
  id: string;
  user_id: string;
  date: string;               // Flutter uses 'date', not 'created_at'
  probability: number;         // Flutter uses 'probability', not 'risk_score'
  prediction: boolean;         // Flutter uses boolean for the ML output
  risk_level: string;          // Flutter saves "Low", "Medium", "High"
  advice: string;              
  // Input features
  age_years: number;           // Flutter uses 'age_years', not 'age'
  gender: number; // 0 = female, 1 = male
  height: number; // cm
  weight: number; // kg
  ap_hi: number; // systolic BP
  ap_lo: number; // diastolic BP
  cholesterol: number; 
  gluc: number; 
  smoke: number; // 0/1
  alco: number; // 0/1
  active: number; // 0/1
  bmi: number;
  bmi_category: string;
}

export interface PredictPayload {
  age_years: number;
  gender: number;
  height: number;
  weight: number;
  ap_hi: number;
  ap_lo: number;
  cholesterol: number;
  gluc: number;
  smoke: number;
  alco: number;
  active: number;
}

export interface PredictionResult {
  prediction: number;
  probability: number;
  risk_level: 'low' | 'medium' | 'high';
  message: string;
}

export interface DashboardStats {
  totalPredictions: number;
  latestRisk: number;
  avgRisk: number;
  trend: 'improving' | 'stable' | 'worsening';
}

export interface ChartDataPoint {
  date: string;
  risk: number;
  label?: string;
}

export type RiskLevel = 'low' | 'medium' | 'high';

export interface AuthState {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
}
