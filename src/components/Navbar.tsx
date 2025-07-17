// src/components/Navbar.tsx

import Link from 'next/link';
import { Calendar, Users, Settings, Plus } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-lg sm:text-xl font-bold hover:text-blue-200 transition-colors">
              Roster Management
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-6">
            <Link href="/" className="flex items-center space-x-1 sm:space-x-2 hover:text-blue-200 p-2 sm:p-0">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link href="/staff" className="flex items-center space-x-1 sm:space-x-2 hover:text-blue-200 p-2 sm:p-0">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Staff</span>
            </Link>
            <Link href="/roster/create" className="flex items-center space-x-1 sm:space-x-2 hover:text-blue-200 p-2 sm:p-0">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Roster</span>
            </Link>
            <Link href="/settings" className="flex items-center space-x-1 sm:space-x-2 hover:text-blue-200 p-2 sm:p-0">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}