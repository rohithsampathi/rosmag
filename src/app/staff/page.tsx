// src/app/staff/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Person } from '@/lib/types';
import { Plus, Edit, Trash2, Save, X, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function StaffPage() {
  const [staff, setStaff] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Person>>({
    personId: '',
    name: '',
    role: 'Nurse',
    skills: [],
    preferences: {},
    seniority: '',
    grade: ''
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
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

  const handleSave = async () => {
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/staff/${editingId}` : '/api/staff';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchStaff();
        setEditingId(null);
        setShowAddForm(false);
        setFormData({
          personId: '',
          name: '',
          role: 'Nurse',
          skills: [],
          preferences: {},
          seniority: '',
          grade: ''
        });
      }
    } catch (error) {
      console.error('Error saving staff:', error);
    }
  };

  const handleDelete = async (personId: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    
    try {
      const response = await fetch(`/api/staff/${personId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchStaff();
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };

  const startEdit = (person: Person) => {
    setEditingId(person.personId);
    setFormData(person);
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      personId: '',
      name: '',
      role: 'Nurse',
      skills: [],
      preferences: {},
      seniority: '',
      grade: ''
    });
  };

  const updateAttendance = async (personId: string, status: 'present' | 'absent') => {
    try {
      const response = await fetch(`/api/staff/${personId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendance: {
            status,
            lastUpdated: new Date().toISOString(),
            updatedBy: 'system' // In real app, get from auth
          }
        })
      });

      if (response.ok) {
        await fetchStaff();
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const getAvailabilityStatus = (person: Person) => {
    if (!person.availability) return 'available';
    return person.availability.status || 'available';
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceStatus = (person: Person) => {
    if (!person.attendance) return 'unknown';
    return person.attendance.status || 'unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-lg">Loading staff...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">Manage hospital staff members and their details</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Staff Member' : 'Add New Staff Member'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Person ID
              </label>
              <input
                type="text"
                value={formData.personId || ''}
                onChange={(e) => setFormData({...formData, personId: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                disabled={!!editingId}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={formData.role || 'Nurse'}
                onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Technician">Technician</option>
                <option value="Admin">Admin</option>
                <option value="Pharmacist">Pharmacist</option>
                <option value="Therapist">Therapist</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialty/Unit
              </label>
              <input
                type="text"
                value={formData.specialty || formData.unit || ''}
                onChange={(e) => setFormData({...formData, specialty: e.target.value, unit: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                value={formData.skills?.join(', ') || ''}
                onChange={(e) => setFormData({...formData, skills: e.target.value.split(',').map(s => s.trim())})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seniority/Grade
              </label>
              <input
                type="text"
                value={formData.seniority || formData.grade || ''}
                onChange={(e) => setFormData({...formData, seniority: e.target.value, grade: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-6">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={cancelEdit}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Staff List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Staff Members ({staff.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialty/Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seniority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staff.map((person) => (
                <tr key={person.personId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{person.name}</div>
                    <div className="text-sm text-gray-500">{person.personId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {person.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {person.specialty || person.unit || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      {person.skills.slice(0, 2).map((skill, idx) => (
                        <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                      {person.skills.length > 2 && (
                        <span className="text-xs text-gray-500">+{person.skills.length - 2} more</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {person.seniority || person.grade || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityColor(getAvailabilityStatus(person))}`}>
                      {getAvailabilityStatus(person)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        getAttendanceStatus(person) === 'present' 
                          ? 'bg-green-100 text-green-800' 
                          : getAttendanceStatus(person) === 'absent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {getAttendanceStatus(person) === 'present' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {getAttendanceStatus(person) === 'absent' && <XCircle className="w-3 h-3 mr-1" />}
                        {getAttendanceStatus(person) === 'unknown' && <Clock className="w-3 h-3 mr-1" />}
                        {getAttendanceStatus(person)}
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => updateAttendance(person.personId, 'present')}
                          className="text-green-600 hover:text-green-900 text-xs"
                          title="Mark Present"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateAttendance(person.personId, 'absent')}
                          className="text-red-600 hover:text-red-900 text-xs"
                          title="Mark Absent"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEdit(person)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(person.personId)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}