'use client';

import { useState } from 'react';
import { FiUsers, FiAlertCircle, FiSettings, FiBarChart2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import AdminRoute from '@/components/AdminRoute';

function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'queue' | 'config'>('overview');
  const [reviewQueue] = useState([
    { id: 1, content: 'Sample flagged content...', risk: 85, status: 'pending', date: '2024-02-28' },
    { id: 2, content: 'Another flagged item...', risk: 72, status: 'pending', date: '2024-02-27' },
    { id: 3, content: 'Reviewed content...', risk: 65, status: 'reviewed', date: '2024-02-26' },
    { id: 4, content: 'High risk content detected...', risk: 92, status: 'pending', date: '2024-02-28' },
    { id: 5, content: 'Potentially harmful message...', risk: 78, status: 'pending', date: '2024-02-27' }
  ]);

  // Comprehensive user list
  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active', joined: '2024-01-15', analyses: 45 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', joined: '2024-01-20', analyses: 32 },
    { id: 3, name: 'Admin User', email: 'admin@cyberguard.com', role: 'Admin', status: 'Active', joined: '2024-01-01', analyses: 156 },
    { id: 4, name: 'Mike Johnson', email: 'mike@company.com', role: 'User', status: 'Active', joined: '2024-02-01', analyses: 28 },
    { id: 5, name: 'Sarah Williams', email: 'sarah@test.com', role: 'User', status: 'Active', joined: '2024-02-10', analyses: 19 },
    { id: 6, name: 'David Brown', email: 'david@example.com', role: 'User', status: 'Inactive', joined: '2024-01-25', analyses: 12 },
    { id: 7, name: 'Emily Davis', email: 'emily@company.com', role: 'User', status: 'Active', joined: '2024-02-15', analyses: 8 },
    { id: 8, name: 'Robert Wilson', email: 'robert@test.com', role: 'User', status: 'Active', joined: '2024-02-20', analyses: 5 },
    { id: 9, name: 'Lisa Anderson', email: 'lisa@example.com', role: 'User', status: 'Active', joined: '2024-02-22', analyses: 3 },
    { id: 10, name: 'James Taylor', email: 'james@company.com', role: 'User', status: 'Active', joined: '2024-02-25', analyses: 2 }
  ]);

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'Active').length,
    totalAnalyses: users.reduce((sum, u) => sum + u.analyses, 0),
    flaggedContent: reviewQueue.filter(q => q.status === 'pending').length,
    accuracy: 94.5,
    falsePositives: 12
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FiBarChart2 className="inline mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'users'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FiUsers className="inline mr-2" />
                Users
              </button>
              <button
                onClick={() => setActiveTab('queue')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'queue'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FiAlertCircle className="inline mr-2" />
                Review Queue
              </button>
              <button
                onClick={() => setActiveTab('config')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'config'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FiSettings className="inline mr-2" />
                Configuration
              </button>
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                    <p className="text-sm text-green-600">{stats.activeUsers} active</p>
                  </div>
                  <FiUsers className="text-blue-500 text-3xl" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Analyses</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalAnalyses}</p>
                    <p className="text-sm text-gray-500">All time</p>
                  </div>
                  <FiBarChart2 className="text-green-500 text-3xl" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Flagged Content</p>
                    <p className="text-2xl font-bold text-red-600">{stats.flaggedContent}</p>
                    <p className="text-sm text-gray-500">Needs review</p>
                  </div>
                  <FiAlertCircle className="text-red-500 text-3xl" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Model Performance</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Accuracy</span>
                      <span className="text-sm font-medium text-gray-900">{stats.accuracy}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${stats.accuracy}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">False Positives</span>
                      <span className="text-sm font-medium text-gray-900">{stats.falsePositives}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">New user registered</span>
                    <span className="ml-auto text-gray-500">2m ago</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">Content analyzed</span>
                    <span className="ml-auto text-gray-500">5m ago</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">High risk content flagged</span>
                    <span className="ml-auto text-gray-500">12m ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">All Users ({users.length})</h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Analyses</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.role === 'Admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joined}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.analyses}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                          <button className="text-gray-600 hover:text-gray-800">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Review Queue Tab */}
        {activeTab === 'queue' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Content Review Queue</h2>
              <div className="mb-4 flex gap-2">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  {reviewQueue.filter(q => q.status === 'pending').length} Pending
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {reviewQueue.filter(q => q.status === 'reviewed').length} Reviewed
                </span>
              </div>
              <div className="space-y-4">
                {reviewQueue.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-medium text-gray-900">ID: {item.id}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.risk > 80 
                              ? 'bg-red-100 text-red-800' 
                              : item.risk > 60 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            Risk: {item.risk}%
                          </span>
                        </div>
                        <p className="text-gray-900 mb-2">{item.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Date: {item.date}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Configuration Tab */}
        {activeTab === 'config' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Model Configuration</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Risk Threshold
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="50"
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">Content above this score will be flagged</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Active Categories
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Hate Speech', 'Harassment', 'Violence', 'Sexual Content', 'Self-Harm', 'Extremism'].map((category) => (
                    <label key={category} className="flex items-center">
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" />
                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrap with AdminRoute for role-based access control
export default function ProtectedAdminPage() {
  return (
    <AdminRoute>
      <AdminPage />
    </AdminRoute>
  );
}
