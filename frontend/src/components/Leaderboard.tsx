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
      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <span className="loading loading-spinner loading-sm"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-200 shadow-md sticky top-20">
      <div className="card-body">
        <h2 className="card-title text-lg">🏆 Leaderboard</h2>
        <p className="text-xs opacity-60 mb-4">Top 5 in last 24 hours</p>
        
        {error && (
          <div className="alert alert-warning alert-sm mb-2">
            <span>{error}</span>
          </div>
        )}
        
        <div className="space-y-2">
          {users.map((user, index) => (
            <div key={user.id} className="flex items-center justify-between p-2 bg-base-100 rounded">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg w-6">{index + 1}</span>
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-8">
                    <span className="text-xs">{user.email.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
                <span className="text-sm truncate">{user.username || user.email.split('@')[0]}</span>
              </div>
              <span className="badge badge-primary">{user.total_karma}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
