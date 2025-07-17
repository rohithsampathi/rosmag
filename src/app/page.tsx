// src/app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Building2, Users, AlertTriangle } from 'lucide-react';
import { Roster, Person } from '@/lib/types';

export default function HomePage() {
  const [rosters, setRosters] = useState<Roster[]>([]);
  const [staffCount, setStaffCount] = useState(0);
  const [hospitalCount, setHospitalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch staff count
        const staffResponse = await fetch('/api/staff');
        if (staffResponse.ok) {
          const staff: Person[] = await staffResponse.json();
          setStaffCount(staff.length);
          
          // Count unique hospitals from staff departments
          const uniqueHospitals = new Set(staff.map(s => s.department).filter(Boolean));
          setHospitalCount(uniqueHospitals.size || 1);
        }

        // Fetch all rosters
        const rostersResponse = await fetch('/api/rosters');
        if (rostersResponse.ok) {
          const rosters: Roster[] = await rostersResponse.json();
          setRosters(rosters);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const initializeData = async () => {
    try {
      const response = await fetch('/api/seed', { method: 'POST' });
      if (response.ok) {
        alert('Sample data initialized successfully!');
        window.location.reload();
      }
    } catch (error) {
      alert('Failed to initialize data');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Roster Management System
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          AI-powered hospital staff scheduling and optimization
        </p>
        
        <button 
          onClick={initializeData}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Initialize Sample Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
            <h2 className="text-xl font-semibold">Hospitals</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{hospitalCount}</p>
          <p className="text-gray-600">Active facilities</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-8 h-8 text-green-600" />
            <h2 className="text-xl font-semibold">Active Rosters</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{rosters.length}</p>
          <p className="text-gray-600">Current schedules</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-8 h-8 text-purple-600" />
            <h2 className="text-xl font-semibold">Staff Members</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{staffCount}</p>
          <p className="text-gray-600">Total personnel</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Recent Rosters</h2>
        </div>
        
        <div className="p-6">
          {rosters.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No rosters found. Initialize sample data to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rosters.map((roster) => (
                <Link
                  key={`${roster.hospitalId}-${roster.date}`}
                  href={`/roster/${roster.hospitalId}/${roster.date}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        Hospital {roster.hospitalId.toUpperCase()}
                      </h3>
                      <p className="text-gray-600">
                        Date: {roster.date} • Version: {roster.version}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        active
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}