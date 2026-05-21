'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FiDownload, FiShare2, FiAlertTriangle, FiFlag } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

export default function ReportPage() {
  const params = useParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Harmful content');
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace('/api/v1', '');

  useEffect(() => {
    const stored = localStorage.getItem('lastAnalysis');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setReport(data);
      } catch (e) {
        console.error('Error parsing report:', e);
      }
    }
    setLoading(false);
  }, [params.id]);

  const submitReport = async () => {
    setReportSubmitting(true);
    try {
      const content = report?.content_id
        ? `Content ID: ${report.content_id}`
        : 'Content from analysis report';
      const riskScore = report?.risk_scores?.overall_risk || 0;

      const res = await fetch(`${API_BASE}/api/db/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, reason: reportReason, risk_score: riskScore }),
      });
      if (res.ok) {
        toast.success('Report submitted anonymously to admin!');
        setShowReportModal(false);
      } else {
        toast.error('Failed to submit. Please try again.');
      }
    } catch {
      toast.error('Could not connect to server.');
    }
    setReportSubmitting(false);
  };

  const LANGUAGE_NAMES: Record<string, string> = {
    en: 'English', hi: 'Hindi', ur: 'Urdu', ar: 'Arabic', fr: 'French',
    de: 'German', es: 'Spanish', pt: 'Portuguese', it: 'Italian', ru: 'Russian',
    zh: 'Chinese', ja: 'Japanese', ko: 'Korean', bn: 'Bengali', pa: 'Punjabi',
    ta: 'Tamil', te: 'Telugu', mr: 'Marathi', gu: 'Gujarati', kn: 'Kannada',
    ml: 'Malayalam', tr: 'Turkish', nl: 'Dutch', pl: 'Polish', sv: 'Swedish',
    da: 'Danish', fi: 'Finnish', no: 'Norwegian', cs: 'Czech', sk: 'Slovak',
    ro: 'Romanian', hu: 'Hungarian', el: 'Greek', he: 'Hebrew', th: 'Thai',
    vi: 'Vietnamese', id: 'Indonesian', ms: 'Malay', tl: 'Filipino',
    so: 'Somali', sw: 'Swahili', af: 'Afrikaans',
  };

  const getLanguageName = (code: string): string => {
    return LANGUAGE_NAMES[code.toLowerCase()] || code.toUpperCase();
  };

  const getRiskLevel = (score: number) => {
    if (score < 25) return { label: 'Low', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800', borderColor: 'border-green-500' };
    if (score < 50) return { label: 'Medium', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', borderColor: 'border-yellow-500' };
    if (score < 75) return { label: 'High', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-800', borderColor: 'border-orange-500' };
    return { label: 'Critical', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800', borderColor: 'border-red-500' };
  };

  const exportPDF = () => {
    if (!report) return;
    
    try {
      // Create a simple text-based PDF export
      const content = `
CYBER-GUARD AI - ANALYSIS REPORT
================================

Overall Risk Score: ${riskScore.toFixed(1)} (${riskLevel.label})
Confidence: ${confidenceScore.toFixed(1)}%
${report.language?.primary_language ? `Language: ${report.language.primary_language.toUpperCase()}` : ''}

CATEGORY SCORES:
${categoryChartData.map(cat => `- ${cat.name}: ${cat.score}%`).join('\n')}

${report.behavioral_analysis ? `
BEHAVIORAL ANALYSIS:
- Sentiment: ${report.behavioral_analysis.sentiment || 'N/A'}
- Aggression: ${report.behavioral_analysis.aggression_index?.toFixed(2) || '0.00'}
- Manipulation: ${Math.min(report.behavioral_analysis.manipulation_score, 100).toFixed(0)}%
- Crisis Language: ${report.behavioral_analysis.crisis_language_detected ? 'Detected' : 'None'}
` : ''}

${report.highlighted_spans && report.highlighted_spans.length > 0 ? `
FLAGGED CONTENT:
${report.highlighted_spans.map((span: any, i: number) => 
  `${i + 1}. "${span.text}" - ${span.category} (${span.severity.toFixed(1)}%)`
).join('\n')}
` : ''}

RECOMMENDED ACTION: ${report.recommended_action?.toUpperCase() || 'N/A'}

Generated: ${new Date().toLocaleString()}
      `.trim();
      
      // Create blob and download
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cyber-guard-report-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export report');
    }
  };

  const exportCSV = () => {
    if (!report) return;
    
    // Create CSV content
    let csv = 'Category,Score\n';
    csv += `Overall Risk,${report.overall_risk_score || 0}\n`;
    csv += `Confidence,${report.confidence_score || 0}\n`;
    
    if (report.category_scores) {
      Object.entries(report.category_scores).forEach(([key, value]) => {
        csv += `${key},${value}\n`;
      });
    }
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analysis-report.csv';
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiAlertTriangle className="mx-auto text-6xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Report Found</h2>
          <p className="text-gray-600 mb-4">Please analyze content first</p>
          <a href="/analyze" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Go to Analyze
          </a>
        </div>
      </div>
    );
  }

  const riskScore = report.risk_scores?.overall_risk || report.overall_risk_score || 0;
  const riskLevel = getRiskLevel(riskScore);
  
  // Process category scores for charts
  const categoryData = report.risk_scores?.category_scores || report.category_scores;
  const categoryChartData = categoryData ? Object.entries(categoryData)
    .map(([key, value]: [string, any]) => ({
      name: key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      score: Math.round((value as number))
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score) : [];

  const confidenceScore = report.risk_scores?.confidence || report.confidence_score || 0;
  
  const COLORS = ['#ef4444', '#f59e0b', '#f97316', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analysis Report</h1>
          <div className="flex space-x-3">
            <button
              onClick={exportPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiDownload />
              <span>Download Report</span>
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <FiDownload />
              <span>CSV</span>
            </button>
            <button 
              onClick={() => {
                const url = window.location.href;
                navigator.clipboard.writeText(url);
                toast.success('Link copied to clipboard!');
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <FiShare2 />
              <span>Share</span>
            </button>
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <FiFlag />
              <span>Report</span>
            </button>
          </div>
        </div>

        {/* Overall Risk Score */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Overall Risk Score</h2>
            <div className={`inline-block text-6xl font-bold ${riskLevel.textColor} mb-4`}>
              {riskScore.toFixed(1)}
            </div>
            <div className={`inline-block px-6 py-2 ${riskLevel.bgColor} ${riskLevel.textColor} rounded-full text-lg font-medium`}>
              {riskLevel.label} Risk
            </div>
            <p className="text-gray-600 mt-4">
              Confidence: {(confidenceScore).toFixed(1)}%
            </p>
            {report.language && report.language.primary_language && (
              <p className="text-gray-600 mt-2">
                Language: <span className="font-semibold text-gray-800">{getLanguageName(report.language.primary_language)}</span>
                <span className="text-gray-500 text-sm ml-1">({report.language.primary_language.toUpperCase()} · {(report.language.confidence || 0).toFixed(1)}% confidence)</span>
              </p>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        {categoryChartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Category Breakdown</h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={categoryChartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={120}
                    interval={0}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    label={{ value: 'Risk Score (%)', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: any) => [`${value}%`, 'Risk Score']}
                  />
                  <Bar 
                    dataKey="score" 
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.score > 70 ? '#ef4444' : entry.score > 40 ? '#f59e0b' : '#10b981'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Risk Distribution</h2>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryChartData.slice(0, 8)}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="score"
                    paddingAngle={2}
                  >
                    {categoryChartData.slice(0, 8).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: any) => [`${value}%`, 'Risk Score']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Showing top {Math.min(8, categoryChartData.length)} risk categories
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Behavioral Analysis */}
        {report.behavioral_analysis && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Behavioral Analysis</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {report.behavioral_analysis.sentiment && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Sentiment</p>
                  <p className="text-lg font-bold text-gray-900 capitalize">
                    {report.behavioral_analysis.sentiment}
                  </p>
                </div>
              )}
              {report.behavioral_analysis.aggression_index !== undefined && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Aggression</p>
                  <p className="text-lg font-bold text-gray-900">
                    {report.behavioral_analysis.aggression_index.toFixed(2)}
                  </p>
                </div>
              )}
              {report.behavioral_analysis.manipulation_score !== undefined && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Manipulation</p>
                  <p className={`text-lg font-bold ${report.behavioral_analysis.manipulation_score > 50 ? 'text-red-600' : 'text-green-600'}`}>
                    {Math.min(report.behavioral_analysis.manipulation_score, 100).toFixed(0)}%
                  </p>
                </div>
              )}
              {report.behavioral_analysis.crisis_language_detected !== undefined && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Crisis Language</p>
                  <p className={`text-lg font-bold ${report.behavioral_analysis.crisis_language_detected ? 'text-red-600' : 'text-green-600'}`}>
                    {report.behavioral_analysis.crisis_language_detected ? 'Detected' : 'None'}
                  </p>
                </div>
              )}
            </div>
            
            {/* Emotions */}
            {report.behavioral_analysis.emotions && Object.keys(report.behavioral_analysis.emotions).length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Detected Emotions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(report.behavioral_analysis.emotions)
                    .filter(([emotion, score]: [string, any]) => score > 0)
                    .map(([emotion, score]: [string, any]) => (
                    <div key={emotion} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700 capitalize">{emotion}</span>
                      <span className="text-sm font-semibold text-gray-900">{(score * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
                {Object.values(report.behavioral_analysis.emotions).every((score: any) => score === 0) && (
                  <p className="text-gray-500 text-center py-4">No significant emotions detected</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Flagged Content */}
        {report.highlighted_spans && report.highlighted_spans.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Flagged Content</h2>
            <div className="space-y-4">
              {report.highlighted_spans.map((segment: any, index: number) => (
                <div key={index} className="border-l-4 border-red-500 pl-4 py-2 bg-red-50">
                  <p className="text-gray-900 font-medium">{segment.text}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {segment.category && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded capitalize">
                        {segment.category.replace(/_/g, ' ')}
                      </span>
                    )}
                    {segment.severity !== undefined && (
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded">
                        Severity: {segment.severity.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  {segment.reason && (
                    <p className="text-sm text-gray-600 mt-2">{segment.reason}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Action */}
        {report.recommended_action && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Action</h2>
            <div className={`p-4 rounded-lg ${
              report.recommended_action === 'block' ? 'bg-red-100 border border-red-300' :
              report.recommended_action === 'review' ? 'bg-yellow-100 border border-yellow-300' :
              'bg-green-100 border border-green-300'
            }`}>
              <p className={`text-lg font-bold uppercase ${
                report.recommended_action === 'block' ? 'text-red-800' :
                report.recommended_action === 'review' ? 'text-yellow-800' :
                'text-green-800'
              }`}>
                {report.recommended_action}
              </p>
              {report.explanation && (
                <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{report.explanation}</p>
              )}
            </div>
          </div>
        )}

        {/* Original Content */}
        {report.content && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Analyzed Content</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">{report.content}</p>
            </div>
          </div>
        )}

        {/* Report to Admin Banner */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiFlag className="text-red-500 text-xl flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800">Think this content needs admin attention?</p>
              <p className="text-sm text-red-600">Flag it anonymously and send it to admin for review.</p>
            </div>
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium whitespace-nowrap ml-4"
          >
            🚩 Report to Admin
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FiFlag className="text-red-500 text-xl" />
                  <h3 className="text-lg font-bold text-gray-900">Report to Admin</h3>
                </div>
                <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>
              <p className="text-sm text-gray-500 mb-4 bg-blue-50 p-3 rounded-lg">
                🔒 Your identity will remain anonymous. This report goes directly to admin for review.
              </p>
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

      <Toaster position="top-right" />
    </div>
  );
}
