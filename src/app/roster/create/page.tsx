// src/app/roster/create/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Roster, Person, Shift, Assignment, TeamOption, RosterGenerationResult } from '@/lib/types';
import { Calendar, Plus, Save, Brain, Users } from 'lucide-react';

export default function CreateRosterPage() {
  const router = useRouter();
  const [staff, setStaff] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [situation, setSituation] = useState('');
  const [teamOptions, setTeamOptions] = useState<TeamOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [roster, setRoster] = useState<Partial<Roster>>({
    hospitalId: 'hosp-01',
    date: new Date().toISOString().split('T')[0],
    version: 1,
    meta: {
      maxHours7d: 48,
      minRest: 8,
      seniorCoverage: true,
      affinityWeights: {}
    },
    shifts: []
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/staff');
      if (response.ok) {
        const data = await response.json();
        setStaff(data);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const addShift = () => {
    const newShift: Shift = {
      shiftId: `shift-${Date.now()}`,
      ward: 'General',
      startUtc: `${roster.date}T08:00:00Z`,
      endUtc: `${roster.date}T20:00:00Z`,
      assignments: []
    };

    setRoster({
      ...roster,
      shifts: [...(roster.shifts || []), newShift]
    });
  };

  const updateShift = (index: number, updatedShift: Shift) => {
    const newShifts = [...(roster.shifts || [])];
    newShifts[index] = updatedShift;
    setRoster({
      ...roster,
      shifts: newShifts
    });
  };

  const removeShift = (index: number) => {
    const newShifts = roster.shifts?.filter((_, i) => i !== index) || [];
    setRoster({
      ...roster,
      shifts: newShifts
    });
  };

  const assignStaff = (shiftIndex: number, personId: string) => {
    const person = staff.find(p => p.personId === personId);
    if (!person) return;

    const newAssignment: Assignment = {
      personId,
      role: person.role,
      tags: person.seniority ? { senior: true } : {}
    };

    const newShifts = [...(roster.shifts || [])];
    newShifts[shiftIndex].assignments.push(newAssignment);

    setRoster({
      ...roster,
      shifts: newShifts
    });
  };

  const removeAssignment = (shiftIndex: number, assignmentIndex: number) => {
    const newShifts = [...(roster.shifts || [])];
    newShifts[shiftIndex].assignments.splice(assignmentIndex, 1);

    setRoster({
      ...roster,
      shifts: newShifts
    });
  };

  const generateRoster = async () => {
    if (!situation.trim()) {
      alert('Please enter a situation description');
      return;
    }

    try {
      setGenerating(true);
      
      const response = await fetch('/api/roster/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation,
          hospitalId: roster.hospitalId,
          date: roster.date,
          staff: staff,
          constraints: roster.meta
        })
      });

      if (response.ok) {
        const rosterResult: RosterGenerationResult = await response.json();
        setTeamOptions(rosterResult.options);
        setSelectedOption(null);
      } else {
        throw new Error('Failed to generate roster');
      }
    } catch (error) {
      console.error('Error generating roster:', error);
      alert('Failed to generate roster. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const selectTeamOption = (optionId: string) => {
    const option = teamOptions.find(opt => opt.optionId === optionId);
    if (option) {
      setSelectedOption(optionId);
      setRoster({
        ...roster,
        shifts: option.shifts
      });
    }
  };

  const saveRoster = async () => {
    try {
      setSaving(true);
      
      const completeRoster: Roster = {
        _id: `${roster.hospitalId}:${roster.date}`,
        hospitalId: roster.hospitalId!,
        date: roster.date!,
        version: roster.version!,
        meta: roster.meta!,
        shifts: roster.shifts!
      };

      const response = await fetch(`/api/roster/${roster.hospitalId}/${roster.date}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeRoster)
      });

      if (response.ok) {
        router.push(`/roster/${roster.hospitalId}/${roster.date}`);
      }
    } catch (error) {
      console.error('Error saving roster:', error);
    } finally {
      setSaving(false);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Roster</h1>
          <p className="text-gray-600">Plan and create a new hospital roster</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={saveRoster}
            disabled={saving || !roster.shifts?.length}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save Roster</span>
          </button>
        </div>
      </div>

      {/* AI Situation Input */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          AI-Powered Roster Generation
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe the situation and requirements for this roster:
            </label>
            <textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="e.g., 'We need coverage for a busy cardiac surgery day with 3 scheduled procedures and expect high ICU occupancy. Need senior cardiology coverage and ensure adequate nursing staff in ICU and cardiology units.'"
              className="w-full h-24 border border-gray-300 rounded-lg px-3 py-2 resize-none"
            />
          </div>
          <button
            onClick={generateRoster}
            disabled={generating || !situation.trim()}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {generating ? (
              <>
                <Brain className="w-4 h-4 animate-pulse" />
                <span>Generating Roster...</span>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                <span>Generate Ideal Roster</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Team Options Display */}
      {teamOptions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Generated Team Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teamOptions.map((option) => (
              <div
                key={option.optionId}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedOption === option.optionId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => selectTeamOption(option.optionId)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{option.title}</h4>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-gray-600">Match:</span>
                    <span className={`text-sm font-bold ${
                      option.matchScore >= 80 ? 'text-green-600' :
                      option.matchScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {option.matchScore}%
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{option.explanation}</p>
                
                {/* Team Composition */}
                <div className="bg-gray-50 rounded p-2 mb-3">
                  <h5 className="text-xs font-medium text-gray-700 mb-1">Team Composition:</h5>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div>Total Staff: {option.teamComposition.totalStaff}</div>
                    <div>Doctors: {option.teamComposition.doctors}</div>
                    <div>Nurses: {option.teamComposition.nurses}</div>
                    <div>Specialists: {option.teamComposition.specialists}</div>
                    <div>Senior Staff: {option.teamComposition.seniorStaff}</div>
                  </div>
                </div>
                
                {/* Strengths */}
                <div className="mb-2">
                  <h5 className="text-xs font-medium text-green-700 mb-1">Strengths:</h5>
                  <ul className="text-xs text-green-600 space-y-0.5">
                    {option.strengths.map((strength, index) => (
                      <li key={index}>• {strength}</li>
                    ))}
                  </ul>
                </div>
                
                {/* Weaknesses */}
                <div>
                  <h5 className="text-xs font-medium text-red-700 mb-1">Considerations:</h5>
                  <ul className="text-xs text-red-600 space-y-0.5">
                    {option.weaknesses.map((weakness, index) => (
                      <li key={index}>• {weakness}</li>
                    ))}
                  </ul>
                </div>
                
                {selectedOption === option.optionId && (
                  <div className="mt-3 text-xs text-blue-600 font-medium">
                    ✓ Selected - View shifts below
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Roster Metadata */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Roster Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital ID</label>
            <input
              type="text"
              value={roster.hospitalId || ''}
              onChange={(e) => setRoster({...roster, hospitalId: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={roster.date || ''}
              onChange={(e) => setRoster({...roster, date: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
            <input
              type="number"
              value={roster.version || 1}
              onChange={(e) => setRoster({...roster, version: parseInt(e.target.value)})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Available Staff */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Available Staff ({staff.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {staff.map((person) => (
            <div
              key={person.personId}
              className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm"
            >
              <div className="font-medium truncate">{person.name}</div>
              <div className="text-xs text-gray-600">{person.role}</div>
              {person.seniority && (
                <div className="text-xs text-blue-600 font-medium">{person.seniority}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Shifts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Shifts</h3>
          <button
            onClick={addShift}
            className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Shift</span>
          </button>
        </div>

        <div className="space-y-4">
          {roster.shifts?.map((shift, shiftIndex) => (
            <div key={shiftIndex} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift ID</label>
                  <input
                    type="text"
                    value={shift.shiftId}
                    onChange={(e) => updateShift(shiftIndex, {...shift, shiftId: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ward</label>
                  <input
                    type="text"
                    value={shift.ward}
                    onChange={(e) => updateShift(shiftIndex, {...shift, ward: e.target.value})}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    value={shift.startUtc.slice(0, -1)}
                    onChange={(e) => updateShift(shiftIndex, {...shift, startUtc: e.target.value + 'Z'})}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="datetime-local"
                    value={shift.endUtc.slice(0, -1)}
                    onChange={(e) => updateShift(shiftIndex, {...shift, endUtc: e.target.value + 'Z'})}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Assignments ({shift.assignments.length})</h4>
                <div className="flex items-center space-x-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        assignStaff(shiftIndex, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="">Assign Staff...</option>
                    {staff
                      .filter(person => !shift.assignments.some(a => a.personId === person.personId))
                      .map(person => (
                        <option key={person.personId} value={person.personId}>
                          {person.name} ({person.role})
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() => removeShift(shiftIndex)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove Shift
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {shift.assignments.map((assignment, assignmentIndex) => {
                  const person = staff.find(p => p.personId === assignment.personId);
                  return (
                    <div key={assignmentIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{person?.name || assignment.personId}</span>
                          <span className="text-sm text-gray-600">({assignment.role})</span>
                          {assignment.tags.senior && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">Senior</span>
                          )}
                          {assignment.tags.specialty && (
                            <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                              {assignment.tags.specialty}
                            </span>
                          )}
                          {assignment.tags.matchScore && (
                            <span className={`text-xs px-1 py-0.5 rounded ${
                              assignment.tags.matchScore >= 80 ? 'bg-green-100 text-green-800' :
                              assignment.tags.matchScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {assignment.tags.matchScore}% match
                            </span>
                          )}
                        </div>
                        {assignment.tags.experience && (
                          <div className="text-xs text-gray-500 mt-1">
                            {assignment.tags.experience} years experience
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeAssignment(shiftIndex, assignmentIndex)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {roster.shifts?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No shifts added yet. Click "Add Shift" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}