import React, { useState } from "react";
import { logMood } from "../api/moodApi";
import { MoodLog } from "../type";

interface Props {
  userId: string;
}

export const MoodTracker: React.FC<Props> = ({ userId }) => {
  const [mood, setMood] = useState<string>("happy");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const moodLog: MoodLog = {
        user_id: userId,
        source: "face",
        mood,
        confidence_score: 0.9,
      };
      await logMood(moodLog);
      setSuccess(true);
    } catch {
      setError("Failed to save mood. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-2">Mood Tracker</h2>
      <select
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="happy">😊 Happy</option>
        <option value="sad">😢 Sad</option>
        <option value="stressed">😟 Stressed</option>
        <option value="neutral">😐 Neutral</option>
      </select>
      <button
        onClick={handleSave}
        disabled={loading}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save"}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-600 mt-2">Mood saved!</div>}
    </div>
  );
};
