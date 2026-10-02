import { RoutineLog } from '../type';
import React, { useState } from "react";
import { logRoutine } from "../api/routineApi";

interface Props {
  userId: string;
}

export const RoutineTracker: React.FC<Props> = ({ userId }) => {
  const [activity, setActivity] = useState<string>("sleep");
  const [duration, setDuration] = useState<string>("01:00:00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // Validate duration format HH:MM:SS
      if (!/^\d{2}:\d{2}:\d{2}$/.test(duration)) {
        setError("Duration must be in HH:MM:SS format");
        setLoading(false);
        return;
      }
      const routine: RoutineLog = {
        user_id: userId,
        activity,
        duration,
      };
      await logRoutine(routine);
      setSuccess(true);
    } catch {
      setError("Failed to save routine. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 border rounded-lg shadow-md mt-4">
      <h2 className="text-lg font-bold mb-2">Routine Tracker</h2>
      <select
        value={activity}
           onChange={(event) => setActivity(event.target.value)}
        className="p-2 border rounded"
      >
        <option value="sleep">😴 Sleep</option>
        <option value="wake">🌅 Wake Up</option>
        <option value="exercise">💪 Exercise</option>
      </select>
      <input
        type="text"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="ml-2 p-2 border rounded"
        placeholder="HH:MM:SS"
        pattern="\d{2}:\d{2}:\d{2}"
        maxLength={8}
      />
      <button
        onClick={handleSave}
        className="ml-2 px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-600 mt-2">Routine saved!</div>}
    </div>
  );
};
