import { supabase } from "../lib/supabaseClient";
import { MoodLog } from "../type";

export async function logMood(moodLog: MoodLog) {
  const { data, error } = await supabase.from("mood_logs").insert([moodLog]);
  if (error) throw error;
  return data;
}

export async function fetchMoodLogs(userId: string) {
  const { data, error } = await supabase
    .from("mood_logs")
    .select("*")
    .eq("user_id", userId)
    .order("timestamp", { ascending: false });
  if (error) throw error;
  return data;
}
