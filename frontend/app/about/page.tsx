'use client';

import { FiShield, FiUsers, FiTarget, FiAward } from 'react-icons/fi';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-blue-100 px-6 py-3 rounded-full mb-6">
            <FiShield className="w-6 h-6 text-blue-600" />
            <span className="text-blue-600 font-semibold">About Cyber Guard AI</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Making Digital Spaces Safer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cyber Guard AI is a next-generation content moderation platform designed to make digital spaces safer through intelligent AI-powered analysis.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              Founded with a vision to combine AI and cybersecurity principles, we empower businesses to manage harmful content intelligently. In an era where online interactions are increasing exponentially, the need for responsible content moderation has never been more critical.
            </p>
            <p className="mb-4">
              Cyber Guard AI was born from the recognition that traditional moderation methods cannot scale with the volume and complexity of modern digital communication. Our team of AI researchers, cybersecurity experts, and ethical technologists came together to build a solution that is not only powerful but also transparent and fair.
            </p>
            <p>
              Today, we serve organizations across social media, gaming, education, and enterprise sectors, helping them maintain safe and respectful digital communities while respecting user privacy and freedom of expression.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            {
              icon: <FiShield className="w-8 h-8" />,
              title: 'Safety First',
              description: 'Protecting users from harmful content is our top priority'
            },
            {
              icon: <FiUsers className="w-8 h-8" />,
              title: 'User Privacy',
              description: 'We respect privacy and handle data with utmost care'
            },
            {
              icon: <FiTarget className="w-8 h-8" />,
              title: 'Accuracy',
              description: 'Advanced AI models ensure precise content analysis'
            },
            {
              icon: <FiAward className="w-8 h-8" />,
              title: 'Transparency',
              description: 'Explainable AI with clear reasoning for every decision'
            }
          ].map((value, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full text-blue-600 mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Built by Experts</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our team combines expertise in artificial intelligence, cybersecurity, ethics, and product development to deliver world-class content moderation solutions.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-200">AI Models Trained</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-blue-200">Content Analyzed Daily</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-200">System Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
