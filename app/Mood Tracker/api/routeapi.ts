import { supabase } from "../lib/supabaseClient";
import { RoutineLog } from "../type";

export async function logRoutine(routineLog: RoutineLog) {
  const { data, error } = await supabase.from("routine_logs").insert([{
    user_id: routineLog.user_id,
    activity: routineLog.activity,
    duration: routineLog.duration,
    completed: routineLog.completed || false,
  }]);
  if (error) throw error;
  return data;
}

export async function fetchRoutineLogs(userId: string) {
  const { data, error } = await supabase
    .from("routine_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
