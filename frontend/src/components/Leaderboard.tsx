import React, { useEffect, useState } from 'react';
import { api } from '../api';

interface LeaderboardUser {
  id: number;
  username: string;
  email: string;
  total_karma: number;
}

export const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await api.getLeaderboard(5);
        setUsers(response.data.results || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
        setError('Failed to load leaderboard');
        // Fallback to placeholder data
        setUsers([
          { id: 1, username: 'alice', email: 'alice@playto.app', total_karma: 250 },
          { id: 2, username: 'bob', email: 'bob@playto.app', total_karma: 180 },
          { id: 3, username: 'charlie', email: 'charlie@playto.app', total_karma: 150 },
          { id: 4, username: 'diana', email: 'diana@playto.app', total_karma: 120 },
          { id: 5, username: 'eve', email: 'eve@playto.app', total_karma: 90 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="bg-base-100 border border-base-300 rounded-xl p-6">
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-sm text-primary"></span>
        </div>
      </div>
    );
  }

  const getMedalEmoji = (index: number) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return '⭐';
    }
  };

  return (
    <aside className="bg-base-100 border border-base-300 rounded-xl p-6 sticky top-24 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="text-xl">🏆</span>
          Leaderboard
        </h2>
        <p className="text-xs opacity-50 mt-1">Top contributors</p>
      </div>

      {error && (
        <div className="alert alert-sm alert-warning mb-4 text-xs">
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-3">
        {users.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors duration-200 border border-base-300"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-lg font-bold w-6 text-center">
                {getMedalEmoji(index)}
              </span>
              <div className="avatar placeholder">
                <div className="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-full w-7">
                  <span className="text-xs font-bold">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.username || user.email.split('@')[0]}
                </p>
                <p className="text-xs opacity-50 truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
              <span className="badge badge-sm badge-primary font-bold">
                {user.total_karma}
              </span>
              <span className="text-xs opacity-60">pts</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-base-300 text-xs opacity-60 text-center">
        <p>Karma system: 5pts per post like, 1pt per comment like</p>
      </div>
    </aside>
  );
};
