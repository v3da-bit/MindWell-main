export interface MoodLog {
  id?: string;
  user_id: string;
  mood: string;
  note?: string;
  source?: string;
  confidence_score?: number;
  created_at?: string;
}

export interface RoutineLog {
  id?: string;
  user_id: string;
  activity: string;
  duration?: string;
  completed?: boolean;
  created_at?: string;
}
