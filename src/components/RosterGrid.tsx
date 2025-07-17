// src/components/RosterGrid.tsx

'use client';

import { useState } from 'react';
import { Roster, Person, Assignment } from '@/lib/types';
import { Clock, User, AlertTriangle, CheckCircle } from 'lucide-react';

interface RosterGridProps {
  roster: Roster;
  staff: Person[];
  onUpdateRoster: (updatedRoster: Roster) => void;
  analysis?: any;
}

export function RosterGrid({ roster, staff, onUpdateRoster, analysis }: RosterGridProps) {
  const [selectedShift, setSelectedShift] = useState<string | null>(null);
  const [draggedPerson, setDraggedPerson] = useState<Person | null>(null);

  const getPersonName = (personId: string): string => {
    const person = staff.find(p => p.personId === personId);
    return person ? person.name : personId;
  };

  const getPersonRole = (personId: string): string => {
    const person = staff.find(p => p.personId === personId);
    return person ? person.role : 'Unknown';
  };

  const formatTime = (utcTime: string): string => {
    return new Date(utcTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const handleDragStart = (person: Person) => {
    setDraggedPerson(person);
  };

  const handleDrop = (shiftId: string, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedPerson) return;

    const updatedRoster = { ...roster };
    const shiftIndex = updatedRoster.shifts.findIndex(s => s.shiftId === shiftId);
    
    if (shiftIndex !== -1) {
      // Remove person from other shifts
      updatedRoster.shifts.forEach(shift => {
        shift.assignments = shift.assignments.filter(a => a.personId !== draggedPerson.personId);
      });

      // Add to new shift
      const newAssignment: Assignment = {
        personId: draggedPerson.personId,
        role: draggedPerson.role,
        tags: draggedPerson.seniority ? { senior: true } : {}
      };

      updatedRoster.shifts[shiftIndex].assignments.push(newAssignment);
      updatedRoster.version += 1;
      
      onUpdateRoster(updatedRoster);
    }

    setDraggedPerson(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getCellStatus = (shift: any): string => {
    if (!analysis) return '';
    
    // Check if this shift has violations
    const hasViolation = analysis.explanation?.includes(shift.shiftId);
    if (hasViolation && analysis.status === 'VIOLATION') return 'violation';
    
    // Check for good affinity
    const hasGoodAffinity = shift.assignments.some((a: Assignment) => 
      Object.keys(roster.meta.affinityWeights).some(key => key.startsWith(a.personId))
    );
    if (hasGoodAffinity) return 'optimal';

    return '';
  };

  return (
    <div className="space-y-6">
      {/* Staff Panel */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Available Staff
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {staff.map((person) => {
            const isAssigned = roster.shifts.some(shift =>
              shift.assignments.some(a => a.personId === person.personId)
            );

            return (
              <div
                key={person.personId}
                draggable={!isAssigned}
                onDragStart={() => handleDragStart(person)}
                className={`p-3 rounded-lg border text-sm cursor-move transition-colors ${
                  isAssigned 
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                }`}
              >
                <div className="font-medium truncate">{person.name}</div>
                <div className="text-xs text-gray-600">{person.role}</div>
                {person.seniority && (
                  <div className="text-xs text-blue-600 font-medium">
                    {person.seniority}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Roster Grid */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Roster for {roster.date}
          </h3>
          {analysis && (
            <div className={`mt-2 p-3 rounded-lg ${
              analysis.status === 'VIOLATION' ? 'bg-red-50 text-red-800' :
              analysis.status === 'SUGGESTION' ? 'bg-yellow-50 text-yellow-800' :
              'bg-green-50 text-green-800'
            }`}>
              <div className="flex items-center space-x-2">
                {analysis.status === 'VIOLATION' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                <span className="font-medium">AI Analysis:</span>
                <span>{analysis.explanation}</span>
                {analysis.score && (
                  <span className="ml-auto font-bold">Score: {analysis.score}/100</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="grid gap-4">
            {roster.shifts.map((shift) => (
              <div
                key={shift.shiftId}
                className={`roster-cell ${getCellStatus(shift)}`}
                onDrop={(e) => handleDrop(shift.shiftId, e)}
                onDragOver={handleDragOver}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{shift.shiftId.toUpperCase()}</h4>
                    <p className="text-sm text-gray-600">{shift.ward}</p>
                    <p className="text-xs text-gray-500">
                      {formatTime(shift.startUtc)} - {formatTime(shift.endUtc)}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {shift.assignments.length} assigned
                  </div>
                </div>

                <div className="space-y-2">
                  {shift.assignments.map((assignment, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                    >
                      <div>
                        <div className="font-medium text-sm">
                          {getPersonName(assignment.personId)}
                        </div>
                        <div className="text-xs text-gray-600">
                          {assignment.role}
                          {assignment.tags.senior && (
                            <span className="ml-2 text-blue-600 font-medium">Senior</span>
                          )}
                        </div>
                      </div>
                      {assignment.tags.prefersWith && (
                        <div className="text-xs text-green-600">
                          Preferred pairing
                        </div>
                      )}
                    </div>
                  ))}

                  {shift.assignments.length === 0 && (
                    <div className="text-center py-4 text-gray-400 border-2 border-dashed border-gray-200 rounded">
                      Drop staff here
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}