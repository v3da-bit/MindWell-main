import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useStreak(userId: string | null) {
  const [streak, setStreak] = useState(0);
  const [lastCompleted, setLastCompleted] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    (async () => {
      try {
        const { data, error } = await supabase
          .from('streaks')
          .select('count,last_completed')
          .eq('user_id', userId)
          .limit(1)
          .maybeSingle();
        if (!error && data) {
          setStreak(data.count);
          setLastCompleted(data.last_completed);
        } else {
          setStreak(0);
          setLastCompleted(null);
          if (error) {
            window.alert('Error loading streak data: ' + error.message);
          }
        }
      } catch (err) {
        window.alert('Network error loading streak data: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const completeToday = async () => {
    if (!userId) return;
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    let newStreak = 1; // Default to 1 for new streak

    if (lastCompleted === yesterdayStr) {
      // Consecutive day, increment streak
      newStreak = streak + 1;
    } else if (lastCompleted === today) {
      // Already completed today, don't change
      return;
    } else {
      // Not consecutive, reset to 1
      newStreak = 1;
    }

    try {
      const { error } = await supabase
        .from('streaks')
        .upsert({ user_id: userId, count: newStreak, last_completed: today });
      if (error) {
        window.alert('Error updating streak: ' + error.message);
        return;
      }
      setStreak(newStreak);
      setLastCompleted(today);
    } catch (error) {
      window.alert('Network error updating streak: ' + (error as Error).message);
    }
  };

  return { streak, lastCompleted, loading, completeToday };
}
