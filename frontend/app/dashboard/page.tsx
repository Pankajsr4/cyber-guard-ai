'use client';

import { useState, useEffect } from 'react';
import { FiTrendingUp, FiAlertTriangle, FiCheckCircle, FiActivity, FiFlag } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

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
  safeCount: number;
  recentAnalyses: RecentAnalysis[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAnalyses: 0,
    avgRiskScore: 0,
    highRiskCount: 0,
    safeCount: 0,
    recentAnalyses: []
  });
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [reportReason, setReportReason] = useState('Harmful content');
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace('/api/v1', '');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, logsRes] = await Promise.all([
          fetch(`${API_BASE}/api/db/stats`),
          fetch(`${API_BASE}/api/db/moderation-logs`),
        ]);
        let dbStats = { total_analyses: 0, flagged_content: 0, blocked_content: 0, allowed_content: 0 };
        let logs: any[] = [];
        if (statsRes.ok) dbStats = await statsRes.json();
        if (logsRes.ok) logs = await logsRes.json();
        const avgRisk = logs.length > 0
          ? logs.reduce((sum: number, l: any) => sum + (l.risk_score || 0), 0) / logs.length : 0;
        const recentAnalyses = logs.slice(0, 5).map((l: any) => ({
          id: l.id,
          content: l.content || 'N/A',
          risk: Math.round(l.risk_score || 0),
          date: l.created_at ? String(l.created_at).split('T')[0].split(' ')[0] : '-',
        }));
        setStats({
          totalAnalyses: dbStats.total_analyses,
          avgRiskScore: Math.round(avgRisk * 10) / 10,
          highRiskCount: dbStats.blocked_content + dbStats.flagged_content,
          safeCount: dbStats.allowed_content,
          recentAnalyses,
        });
      } catch {
        setStats({ totalAnalyses: 0, avgRiskScore: 0, highRiskCount: 0, safeCount: 0, recentAnalyses: [] });
      }
      setLoading(false);
    };
    fetchDashboardData();
  }, []);

  const submitReport = async () => {
    if (!reportContent.trim()) {
      toast.error('Please enter the content you want to report.');
      return;
    }
    setReportSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/db/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: reportContent, reason: reportReason, risk_score: 0 }),
      });
      if (res.ok) {
        toast.success('Report submitted anonymously to admin!');
        setShowReportModal(false);
        setReportContent('');
        setReportReason('Harmful content');
      } else {
        toast.error('Failed to submit. Please try again.');
      }
    } catch {
      toast.error('Could not connect to server.');
    }
    setReportSubmitting(false);
  };

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
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FiFlag />
            Report Content
          </button>
        </div>

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
                <p className="text-2xl font-bold text-green-600">{stats.safeCount}</p>
              </div>
              <FiCheckCircle className="text-green-500 text-3xl" />
            </div>
          </div>
        </div>

        {/* Anonymous Report Banner */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiFlag className="text-orange-500 text-xl flex-shrink-0" />
            <div>
              <p className="font-medium text-orange-800">See something harmful?</p>
              <p className="text-sm text-orange-600">Report content anonymously — sent directly to admin for review.</p>
            </div>
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium whitespace-nowrap ml-4"
          >
            Flag Content
          </button>
        </div>

        {/* Recent Analyses */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Analyses</h2>
          {stats.recentAnalyses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No analyses yet. Go to Analyze to start.</p>
          ) : (
            <div className="space-y-4">
              {stats.recentAnalyses.map((analysis) => (
                <div key={analysis.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <p className="text-gray-900 font-medium truncate">{analysis.content}</p>
                      <p className="text-sm text-gray-500">{analysis.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getRiskBadge(analysis.risk)}`}>
                      Risk: {analysis.risk}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Anonymous Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FiFlag className="text-red-500 text-xl" />
                  <h3 className="text-lg font-bold text-gray-900">Report Content Anonymously</h3>
                </div>
                <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>
              <p className="text-sm text-gray-500 mb-4 bg-blue-50 p-3 rounded-lg">
                🔒 Your identity will remain anonymous. This report goes directly to admin for review.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content to Report <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reportContent}
                    onChange={e => setReportContent(e.target.value)}
                    placeholder="Paste or type the harmful content here..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Reporting</label>
                  <select
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option>Harmful content</option>
                    <option>Hate speech</option>
                    <option>Harassment or bullying</option>
                    <option>Violence or threats</option>
                    <option>Misinformation</option>
                    <option>Spam or scam</option>
                    <option>Sexual content</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={submitReport}
                  disabled={reportSubmitting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
                >
                  {reportSubmitting ? 'Submitting...' : '🚩 Submit Report'}
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
