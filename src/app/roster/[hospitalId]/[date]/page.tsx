// src/app/roster/[hospitalId]/[date]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { RosterGrid } from '@/components/RosterGrid';
import { Roster, Person, AIAnalysis } from '@/lib/types';
import { Loader, RefreshCw, Save, Brain } from 'lucide-react';

export default function RosterPage() {
  const params = useParams();
  const { hospitalId, date } = params;
  
  const [roster, setRoster] = useState<Roster | null>(null);
  const [staff, setStaff] = useState<Person[]>([]);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [hospitalId, date]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch roster
      const rosterResponse = await fetch(`/api/roster/${hospitalId}/${date}`);
      if (rosterResponse.ok) {
        const rosterData = await rosterResponse.json();
        setRoster(rosterData);
      }

      // Fetch staff
      const staffResponse = await fetch('/api/staff');
      if (staffResponse.ok) {
        const staffData = await staffResponse.json();
        setStaff(staffData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRoster = async (updatedRoster: Roster) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/roster/${hospitalId}/${date}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRoster)
      });

      if (response.ok) {
        const savedRoster = await response.json();
        setRoster(savedRoster);
        
        // Trigger analysis
        analyzeRoster(savedRoster);
      }
    } catch (error) {
      console.error('Error saving roster:', error);
    } finally {
      setSaving(false);
    }
  };

  const analyzeRoster = async (rosterToAnalyze?: Roster) => {
    const targetRoster = rosterToAnalyze || roster;
    if (!targetRoster) return;

    try {
      setAnalyzing(true);
      const response = await fetch('/api/roster/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roster: targetRoster,
          question: "Analyze this roster for rule violations and optimization opportunities"
        })
      });

      if (response.ok) {
        const analysisResult = await response.json();
        setAnalysis(analysisResult);
      }
    } catch (error) {
      console.error('Error analyzing roster:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading roster...</span>
      </div>
    );
  }

  if (!roster) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Roster Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          No roster found for {hospitalId} on {date}
        </p>
        <button
          onClick={() => window.history.back()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Roster Management
          </h1>
          <p className="text-gray-600">
            {Array.isArray(hospitalId) ? hospitalId[0].toUpperCase() : hospitalId.toUpperCase()} • {Array.isArray(date) ? date[0] : date} • Version {roster.version}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => analyzeRoster()}
            disabled={analyzing}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {analyzing ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Brain className="w-4 h-4" />
            )}
            <span>AI Analysis</span>
          </button>

          <button
            onClick={fetchData}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {saving && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-blue-800">
            <Loader className="w-4 h-4 animate-spin" />
            <span>Saving changes...</span>
          </div>
        </div>
      )}

      <RosterGrid
        roster={roster}
        staff={staff}
        onUpdateRoster={handleUpdateRoster}
        analysis={analysis}
      />
    </div>
  );
}