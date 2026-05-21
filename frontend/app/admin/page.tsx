'use client';

import { useState, useEffect } from 'react';
import { FiUsers, FiAlertCircle, FiBarChart2, FiX } from 'react-icons/fi';
import AdminRoute from '@/components/AdminRoute';
import toast, { Toaster } from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  analyses_count: number;
  created_at: string;
}

interface FlaggedItem {
  id: number;
  content_preview: string;
  risk_score: number;
  flag_reason: string;
  status: string;
  created_at: string;
}

function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'queue'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [flaggedItems, setFlaggedItems] = useState<FlaggedItem[]>([]);
  const [dbStats, setDbStats] = useState({ total_users: 0, total_analyses: 0, flagged_content: 0, blocked_content: 0, allowed_content: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editActive, setEditActive] = useState(true);

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace('/api/v1', '');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, flaggedRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/api/db/users`),
        fetch(`${API_BASE}/api/db/flagged-content`),
        fetch(`${API_BASE}/api/db/stats`),
      ]);
      if (usersRes.ok) setUsers(await usersRes.json());
      if (flaggedRes.ok) setFlaggedItems(await flaggedRes.json());
      if (statsRes.ok) setDbStats(await statsRes.json());
    } catch (e) {
      // fallback: load from localStorage (signup users)
      const stored = localStorage.getItem('cyberguard_users');
      if (stored) {
        try {
          const localUsers = JSON.parse(stored);
          const mapped = localUsers.map((u: any, i: number) => ({
            id: i + 1,
            name: u.name || u.email,
            email: u.email,
            role: u.role || 'user',
            is_active: true,
            analyses_count: u.analysesCount || 0,
            created_at: u.createdAt || new Date().toISOString(),
          }));
          setUsers(mapped);
        } catch {}
      }
    }
    setLoading(false);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openEdit = (user: User) => {
    setEditUser(user);
    setEditName(user.name);
    setEditRole(user.role);
    setEditActive(user.is_active);
  };

  const saveEdit = () => {
    if (!editUser) return;
    setUsers(prev => prev.map(u =>
      u.id === editUser.id
        ? { ...u, name: editName, role: editRole, is_active: editActive }
        : u
    ));
    setEditUser(null);
    toast.success('User updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { key: 'overview', label: 'Overview', icon: FiBarChart2 },
                { key: 'users', label: 'Users', icon: FiUsers },
                { key: 'queue', label: 'Review Queue', icon: FiAlertCircle },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === tab.key
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="inline mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{dbStats.total_users || users.length}</p>
                  <p className="text-sm text-green-600">{users.filter(u => u.is_active).length} active</p>
                </div>
                <FiUsers className="text-blue-500 text-3xl" />
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Analyses</p>
                  <p className="text-2xl font-bold text-gray-900">{dbStats.total_analyses}</p>
                  <p className="text-sm text-gray-500">All time</p>
                </div>
                <FiBarChart2 className="text-green-500 text-3xl" />
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Flagged Content</p>
                  <p className="text-2xl font-bold text-red-600">{dbStats.flagged_content}</p>
                  <p className="text-sm text-gray-500">Needs review</p>
                </div>
                <FiAlertCircle className="text-red-500 text-3xl" />
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Content Breakdown */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Content Breakdown</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">✅ Allowed</span>
                      <span className="text-sm font-semibold text-green-500">{dbStats.allowed_content}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: dbStats.total_analyses ? `${Math.round((dbStats.allowed_content / dbStats.total_analyses) * 100)}%` : '0%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">🚫 Blocked</span>
                      <span className="text-sm font-semibold text-red-500">{dbStats.blocked_content}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full transition-all" style={{ width: dbStats.total_analyses ? `${Math.round((dbStats.blocked_content / dbStats.total_analyses) * 100)}%` : '0%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">🔍 Flagged</span>
                      <span className="text-sm font-semibold text-yellow-500">{dbStats.flagged_content}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full transition-all" style={{ width: dbStats.total_analyses ? `${Math.round((dbStats.flagged_content / dbStats.total_analyses) * 100)}%` : '0%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-2">
                  {[
                    'AI Moderation Engine',
                    'Language Detection',
                    'Toxicity Detector',
                    'Database',
                    'API Server',
                  ].map(item => (
                    <div key={item} className="flex items-center justify-between py-1.5 border-b border-gray-700 last:border-0">
                      <span className="text-sm text-gray-400">{item}</span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-500">
                        ● Operational
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Users Table */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recently Registered Users</h3>
              {users.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No users yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2 px-3 text-xs text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="text-left py-2 px-3 text-xs text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="text-left py-2 px-3 text-xs text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="text-left py-2 px-3 text-xs text-gray-500 uppercase tracking-wider">Analyses</th>
                        <th className="text-left py-2 px-3 text-xs text-gray-500 uppercase tracking-wider">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.slice(0, 5).map(user => (
                        <tr key={user.id} className="border-b border-gray-700 hover:bg-blue-900/20 transition-colors">
                          <td className="py-2 px-3 text-sm font-medium text-gray-200">{user.name}</td>
                          <td className="py-2 px-3 text-sm text-gray-400">{user.email}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-400' : 'bg-blue-100 text-blue-400'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-sm text-gray-300">{user.analyses_count}</td>
                          <td className="py-2 px-3 text-sm text-gray-400">{user.created_at?.split('T')[0]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  All Users ({filteredUsers.length})
                </h2>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {loading ? (
                <p className="text-center text-gray-500 py-8">Loading users...</p>
              ) : filteredUsers.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No users found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {['ID', 'Name', 'Email', 'Role', 'Status', 'Joined', 'Analyses', 'Actions'].map(h => (
                          <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {user.created_at ? user.created_at.split('T')[0] : '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{user.analyses_count}</td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="text-blue-600 hover:text-blue-800 font-medium mr-3"
                            >
                              View
                            </button>
                            <button
                              onClick={() => openEdit(user)}
                              className="text-gray-600 hover:text-gray-800 font-medium"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Review Queue Tab */}
        {activeTab === 'queue' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">User Reports & Flagged Content</h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  {flaggedItems.filter(f => f.status === 'pending').length} Pending
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {flaggedItems.filter(f => f.status !== 'pending').length} Reviewed
                </span>
              </div>
            </div>

            {flaggedItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No reports yet.</p>
                <p className="text-gray-400 text-sm mt-1">User reports will appear here when submitted.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {flaggedItems.map(item => (
                  <div key={item.id} className={`border rounded-lg p-4 ${item.status === 'pending' ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="text-sm font-medium text-gray-700">Report #{item.id}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            item.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.risk_score > 80 ? 'bg-red-100 text-red-800' :
                            item.risk_score > 50 ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            Risk: {item.risk_score}%
                          </span>
                          <span className="text-xs text-gray-500">{item.created_at?.split('T')[0]}</span>
                        </div>

                        <div className="mb-2">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reason: </span>
                          <span className="text-sm text-red-700 font-medium">{item.flag_reason}</span>
                        </div>

                        <div className="bg-white border border-gray-200 rounded p-3">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Reported Content:</p>
                          <p className="text-sm text-gray-800">{item.content_preview}</p>
                        </div>
                      </div>

                      {item.status === 'pending' && (
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button
                            onClick={async () => {
                              const res = await fetch(`${API_BASE}/api/db/report/${item.id}/resolve`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'reviewed' }),
                              });
                              if (res.ok) {
                                setFlaggedItems(prev => prev.map(f => f.id === item.id ? { ...f, status: 'reviewed' } : f));
                                toast.success('Marked as reviewed');
                              }
                            }}
                            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 whitespace-nowrap"
                          >
                            ✓ Mark Reviewed
                          </button>
                          <button
                            onClick={async () => {
                              const res = await fetch(`${API_BASE}/api/db/report/${item.id}/resolve`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'resolved' }),
                              });
                              if (res.ok) {
                                setFlaggedItems(prev => prev.map(f => f.id === item.id ? { ...f, status: 'resolved' } : f));
                                toast.success('Marked as resolved');
                              }
                            }}
                            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 whitespace-nowrap"
                          >
                            ✓ Resolve
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* End of tabs */}
      </div>

      {/* View User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">User Details</h3>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                <FiX className="text-xl" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-500">ID</span><span className="font-medium">{selectedUser.id}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium">{selectedUser.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium">{selectedUser.email}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Role</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                  {selectedUser.role}
                </span>
              </div>
              <div className="flex justify-between"><span className="text-gray-500">Status</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${selectedUser.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {selectedUser.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between"><span className="text-gray-500">Joined</span><span className="font-medium">{selectedUser.created_at?.split('T')[0]}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Analyses</span><span className="font-medium">{selectedUser.analyses_count}</span></div>
            </div>
            <button onClick={() => setSelectedUser(null)} className="mt-6 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Edit User</h3>
              <button onClick={() => setEditUser(null)} className="text-gray-400 hover:text-gray-600">
                <FiX className="text-xl" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={editRole}
                  onChange={e => setEditRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editActive ? 'active' : 'inactive'}
                  onChange={e => setEditActive(e.target.value === 'active')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveEdit} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Changes
              </button>
              <button onClick={() => setEditUser(null)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProtectedAdminPage() {
  return (
    <AdminRoute>
      <AdminPage />
    </AdminRoute>
  );
}
