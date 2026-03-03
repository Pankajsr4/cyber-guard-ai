'use client';

import { useState, useEffect } from 'react';
import { FiTrendingUp, FiAlertTriangle, FiCheckCircle, FiActivity } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RecentAnalysis {
  id: number;
  content: string;
  risk: number;
  date: string;
}

interface DashboardStats {
  totalAnalyses: number;
  avgRiskScore: number;
  highRiskCount: number;
  recentAnalyses: RecentAnalysis[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAnalyses: 0,
    avgRiskScore: 0,
    highRiskCount: 0,
    recentAnalyses: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setStats({
        totalAnalyses: 1247,
        avgRiskScore: 23.5,
        highRiskCount: 89,
        recentAnalyses: [
          { id: 1, content: 'Sample text...', risk: 15, date: '2024-02-28' },
          { id: 2, content: 'Another sample...', risk: 45, date: '2024-02-27' },
          { id: 3, content: 'Test content...', risk: 8, date: '2024-02-26' }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const trendData = [
    { date: 'Mon', risk: 20 },
    { date: 'Tue', risk: 35 },
    { date: 'Wed', risk: 15 },
    { date: 'Thu', risk: 42 },
    { date: 'Fri', risk: 28 },
    { date: 'Sat', risk: 18 },
    { date: 'Sun', risk: 25 }
  ];

  const getRiskColor = (risk: number) => {
    if (risk < 25) return 'text-green-500';
    if (risk < 50) return 'text-yellow-500';
    if (risk < 75) return 'text-orange-500';
    return 'text-red-500';
  };

  const getRiskBadge = (risk: number) => {
    if (risk < 25) return 'bg-green-100 text-green-800';
    if (risk < 50) return 'bg-yellow-100 text-yellow-800';
    if (risk < 75) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Analyses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAnalyses}</p>
              </div>
              <FiActivity className="text-blue-500 text-3xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Risk Score</p>
                <p className={`text-2xl font-bold ${getRiskColor(stats.avgRiskScore)}`}>
                  {stats.avgRiskScore.toFixed(1)}
                </p>
              </div>
              <FiTrendingUp className="text-green-500 text-3xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Risk Items</p>
                <p className="text-2xl font-bold text-red-600">{stats.highRiskCount}</p>
              </div>
              <FiAlertTriangle className="text-red-500 text-3xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Safe Content</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalAnalyses - stats.highRiskCount}
                </p>
              </div>
              <FiCheckCircle className="text-green-500 text-3xl" />
            </div>
          </div>
        </div>

        {/* Risk Trend Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Risk Trend (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="risk" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Analyses */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Analyses</h2>
          <div className="space-y-4">
            {stats.recentAnalyses.map((analysis: any) => (
              <div key={analysis.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium truncate">{analysis.content}</p>
                    <p className="text-sm text-gray-500">{analysis.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskBadge(analysis.risk)}`}>
                    Risk: {analysis.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
