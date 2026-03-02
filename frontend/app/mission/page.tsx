'use client';

import { FiTarget, FiHeart, FiShield, FiUsers } from 'react-icons/fi';

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-blue-100 px-6 py-3 rounded-full mb-6">
            <FiTarget className="w-6 h-6 text-blue-600" />
            <span className="text-blue-600 font-semibold">Our Mission</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Empowering Safer Digital Communities
          </h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our mission is to enable responsible AI adoption while protecting digital communities from abuse, misinformation, and harmful interactions.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-16">
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-xl mb-6">
              At Cyber Guard AI, we believe that technology should serve humanity by creating spaces where people can communicate freely, safely, and respectfully. Our mission extends beyond simple content filtering—we aim to foster digital environments where diverse voices can be heard without fear of harassment, abuse, or harm.
            </p>
            <p className="text-xl mb-6">
              We are committed to developing AI systems that are not only powerful but also transparent, fair, and accountable. Every moderation decision made by our platform is explainable, allowing organizations to understand and trust the technology they deploy.
            </p>
            <p className="text-xl">
              Through continuous research, ethical AI practices, and collaboration with communities worldwide, we strive to set new standards for responsible content moderation that respects both safety and freedom of expression.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {[
            {
              icon: <FiShield className="w-12 h-12" />,
              title: 'Safety & Protection',
              description: 'We prioritize user safety by detecting and preventing harmful content before it causes damage to individuals and communities.'
            },
            {
              icon: <FiHeart className="w-12 h-12" />,
              title: 'Ethical AI',
              description: 'We develop AI systems with fairness, transparency, and accountability at their core, ensuring unbiased and explainable decisions.'
            },
            {
              icon: <FiUsers className="w-12 h-12" />,
              title: 'Community Empowerment',
              description: 'We empower organizations to build and maintain healthy digital communities through intelligent, scalable moderation tools.'
            },
            {
              icon: <FiTarget className="w-12 h-12" />,
              title: 'Continuous Innovation',
              description: 'We invest in research and development to stay ahead of emerging threats and evolving patterns of harmful behavior online.'
            }
          ].map((value, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-blue-600 mb-4">{value.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
              <p className="text-gray-600 text-lg">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Impact Section */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-6">Our Impact</h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Together with our partners, we're making the internet a safer place for millions of users worldwide.
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-5xl font-bold mb-2">1M+</div>
              <div className="text-blue-200">Content Analyzed Daily</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Languages Supported</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">99.9%</div>
              <div className="text-blue-200">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">Protection</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
