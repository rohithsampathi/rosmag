// src/components/Navbar.tsx

import Link from 'next/link';
import { Calendar, Users, Settings, Plus } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Roster Management</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2 hover:text-blue-200">
              <Calendar className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link href="/staff" className="flex items-center space-x-2 hover:text-blue-200">
              <Users className="w-4 h-4" />
              <span>Staff</span>
            </Link>
            <Link href="/roster/create" className="flex items-center space-x-2 hover:text-blue-200">
              <Plus className="w-4 h-4" />
              <span>Create Roster</span>
            </Link>
            <button className="flex items-center space-x-2 hover:text-blue-200">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}