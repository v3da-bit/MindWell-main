import { supabase } from "./supabaseClient";

export async function storeUserData({ user_id, text, speech, face }: {
  user_id: string;
  text?: string;
  speech?: string;
  face?: string;
}) {
  const { error } = await supabase.from("user_data").insert([
    { user_id, text, speech, face, created_at: new Date().toISOString() }
  ]);
  return error;
}
