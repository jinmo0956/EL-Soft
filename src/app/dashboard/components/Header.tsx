'use client';

import { Search, Bell, User } from 'lucide-react';
import { useState } from 'react';

export default function DashboardHeader() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <header className="dashboard-header">
            <div className="search-box">
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="header-actions">
                <button className="notification-btn">
                    <Bell size={20} />
                </button>
                <div className="user-menu">
                    <User size={18} />
                    <span>Admin</span>
                </div>
            </div>

            <style jsx>{`
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: transparent;
        }
        .search-box {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 0.6rem 1rem;
          width: 320px;
        }
        .search-box input {
          background: transparent;
          border: none;
          color: #fff;
          margin-left: 0.75rem;
          font-size: 0.9rem;
          width: 100%;
          outline: none;
        }
        .search-box input::placeholder {
          color: #64748b;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .notification-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .notification-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }
        .user-menu {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 0.5rem 1rem;
          color: #fff;
          font-size: 0.9rem;
          cursor: pointer;
        }
      `}</style>
        </header>
    );
}
