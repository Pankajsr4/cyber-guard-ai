'use client';

import { FiCode, FiCpu, FiLayout, FiShield, FiMail } from 'react-icons/fi';

export default function CareersPage() {
  const openings = [
    {
      icon: <FiCpu className="w-8 h-8" />,
      title: 'AI Engineer',
      location: 'Remote / India',
      type: 'Full-time',
      description: 'Build and optimize machine learning models for content moderation and toxicity detection.'
    },
    {
      icon: <FiCode className="w-8 h-8" />,
      title: 'Backend Developer',
      location: 'Remote / India',
      type: 'Full-time',
      description: 'Develop scalable APIs and microservices for high-performance content analysis.'
    },
    {
      icon: <FiLayout className="w-8 h-8" />,
      title: 'Frontend Developer',
      location: 'Remote / India',
      type: 'Full-time',
      description: 'Create intuitive user interfaces and dashboards for moderation analytics.'
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: 'Security Analyst',
      location: 'Remote / India',
      type: 'Full-time',
      description: 'Ensure platform security, conduct audits, and implement best practices.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're building the future of AI moderation. Join us in making the internet a safer place for everyone.
          </p>
        </div>

        {/* Why Join Us */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Cyber Guard AI?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Impactful Work',
                description: 'Your work directly contributes to making digital spaces safer for millions of users worldwide.'
              },
              {
                title: 'Cutting-Edge Tech',
                description: 'Work with the latest AI/ML technologies, cloud infrastructure, and modern development tools.'
              },
              {
                title: 'Growth & Learning',
                description: 'Continuous learning opportunities, conference attendance, and professional development support.'
              },
              {
                title: 'Remote-First',
                description: 'Work from anywhere with flexible hours and a strong remote-first culture.'
              },
              {
                title: 'Competitive Benefits',
                description: 'Attractive salary, health insurance, equity options, and performance bonuses.'
              },
              {
                title: 'Inclusive Culture',
                description: 'Diverse, collaborative team that values different perspectives and backgrounds.'
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Open Roles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {openings.map((job, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="text-blue-600 mb-4">{job.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h3>
                <div className="flex gap-4 mb-4">
                  <span className="text-sm text-gray-600">{job.location}</span>
                  <span className="text-sm text-gray-600">•</span>
                  <span className="text-sm text-gray-600">{job.type}</span>
                </div>
                <p className="text-gray-600 mb-6">{job.description}</p>
                <a
                  href="mailto:careers@cyberguardai.com"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Application CTA */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-12 text-center text-white">
          <FiMail className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Don't See Your Role?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals. Send us your resume and let us know how you can contribute.
          </p>
          <a
            href="mailto:careers@cyberguardai.com"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            careers@cyberguardai.com
          </a>
        </div>
      </div>
    </div>
  );
}
