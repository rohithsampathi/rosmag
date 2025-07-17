
// src/app/settings/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw } from 'lucide-react';
import { BackButton } from '@/components/BackButton';

interface AppSettings {
  maxHours7d: number;
  minRest: number;
  seniorCoverage: boolean;
  claudeApiKey: string;
  mongoUri: string;
  hospitalName: string;
  timezone: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({
    maxHours7d: 48,
    minRest: 8,
    seniorCoverage: true,
    claudeApiKey: '',
    mongoUri: '',
    hospitalName: 'General Hospital',
    timezone: 'Asia/Kolkata'
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <BackButton href="/" />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm sm:text-base text-gray-600">Configure application settings and roster rules</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 w-full sm:w-auto"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Settings</span>
        </button>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-green-800">Settings saved successfully!</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Roster Rules */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Roster Rules
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Hours per Week
              </label>
              <input
                type="number"
                value={settings.maxHours7d}
                onChange={(e) => setSettings({...settings, maxHours7d: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Rest Hours
              </label>
              <input
                type="number"
                value={settings.minRest}
                onChange={(e) => setSettings({...settings, minRest: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="seniorCoverage"
                checked={settings.seniorCoverage}
                onChange={(e) => setSettings({...settings, seniorCoverage: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="seniorCoverage" className="text-sm font-medium text-gray-700">
                Require Senior Coverage
              </label>
            </div>
          </div>
        </div>

        {/* Hospital Settings */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Hospital Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hospital Name
              </label>
              <input
                type="text"
                value={settings.hospitalName}
                onChange={(e) => setSettings({...settings, hospitalName: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              </select>
            </div>
          </div>
        </div>

        {/* API Configuration */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:col-span-2">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">API Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Claude API Key
              </label>
              <input
                type="password"
                value={settings.claudeApiKey}
                onChange={(e) => setSettings({...settings, claudeApiKey: e.target.value})}
                placeholder="sk-ant-..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Required for AI-powered roster analysis
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MongoDB URI
              </label>
              <input
                type="password"
                value={settings.mongoUri}
                onChange={(e) => setSettings({...settings, mongoUri: e.target.value})}
                placeholder="mongodb://..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Database connection string
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}