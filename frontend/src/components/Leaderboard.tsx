import React, { useEffect, useState } from 'react';

interface LeaderboardUser {
  id: number;
  email: string;
  karma_24h: number;
}

export const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from /api/leaderboard/
    setUsers([
      { id: 1, email: 'alice@playto.app', karma_24h: 250 },
      { id: 2, email: 'bob@playto.app', karma_24h: 180 },
      { id: 3, email: 'charlie@playto.app', karma_24h: 150 },
      { id: 4, email: 'diana@playto.app', karma_24h: 120 },
      { id: 5, email: 'eve@playto.app', karma_24h: 90 },
    ]);
    setLoading(false);
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
                <span className="text-sm truncate">{user.email.split('@')[0]}</span>
              </div>
              <span className="badge badge-primary">{user.karma_24h}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
