'use client';

import { FiShield, FiZap, FiBarChart2, FiImage, FiFilter, FiTrendingUp, FiFileText, FiCpu } from 'react-icons/fi';
import Link from 'next/link';

export default function FeaturesPage() {
  const features = [
    {
      icon: <FiShield className="w-8 h-8" />,
      title: 'Text Toxicity Detection',
      description: 'Advanced NLP models detect harmful language, hate speech, and toxic behavior in real-time'
    },
    {
      icon: <FiFilter className="w-8 h-8" />,
      title: 'Hate Speech Recognition',
      description: 'Identify and flag discriminatory content targeting race, religion, gender, and other protected categories'
    },
    {
      icon: <FiZap className="w-8 h-8" />,
      title: 'Violence & Threat Detection',
      description: 'Detect violent language, threats, and potentially dangerous content before it causes harm'
    },
    {
      icon: <FiImage className="w-8 h-8" />,
      title: 'Image Content Moderation',
      description: 'AI-powered visual analysis for inappropriate images and graphic content'
    },
    {
      icon: <FiFilter className="w-8 h-8" />,
      title: 'Profanity Filtering',
      description: 'Comprehensive profanity detection across 50+ languages with context awareness'
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: 'Risk Scoring System',
      description: 'Multi-dimensional risk assessment with explainable AI and confidence scores'
    },
    {
      icon: <FiFileText className="w-8 h-8" />,
      title: 'Detailed Analytical Reports',
      description: 'Comprehensive reports with behavioral analysis, sentiment detection, and actionable insights'
    },
    {
      icon: <FiCpu className="w-8 h-8" />,
      title: 'Real-time API Processing',
      description: 'Lightning-fast analysis with <500ms response time for instant moderation decisions'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Powerful AI-Driven Moderation Engine
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cyber Guard AI delivers intelligent, real-time content analysis powered by advanced machine learning models.
          </p>
        </div>

        {/* Core Capabilities */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Core Capabilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Levels */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Risk Scoring System</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our system assigns a harmfulness score (0–100) and categorizes risk levels for actionable moderation decisions.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { level: 'Low Risk', range: '0-25', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800', borderColor: 'border-green-500' },
              { level: 'Moderate Risk', range: '26-50', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', borderColor: 'border-yellow-500' },
              { level: 'High Risk', range: '51-75', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-800', borderColor: 'border-orange-500' },
              { level: 'Critical', range: '76-100', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800', borderColor: 'border-red-500' }
            ].map((risk, index) => (
              <div key={index} className={`${risk.bgColor} border-2 ${risk.borderColor} rounded-xl p-6 text-center`}>
                <div className={`text-2xl font-bold ${risk.textColor} mb-2`}>{risk.level}</div>
                <div className={`text-lg ${risk.textColor}`}>{risk.range}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise Features */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-12 text-white mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Built for Enterprise</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Scalability', description: 'Handle millions of requests per day with auto-scaling infrastructure' },
              { title: 'Performance', description: 'Sub-500ms response time with 99.9% uptime SLA' },
              { title: 'Security', description: 'Enterprise-grade encryption, compliance-ready architecture' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-blue-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Experience the power of AI-driven content moderation
          </p>
          <Link
            href="/analyze"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
          >
            Try Live Demo
          </Link>
        </div>
      </div>
    </div>
  );
}
