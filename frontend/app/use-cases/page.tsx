'use client';

import { FiMessageSquare, FiUsers, FiGamepad, FiBook, FiShield, FiBriefcase } from 'react-icons/fi';
import Link from 'next/link';

export default function UseCasesPage() {
  const useCases = [
    {
      iconName: 'message',
      title: 'Social Media Moderation',
      description: 'Filter toxic comments in real-time across posts, comments, and direct messages.',
      benefits: [
        'Real-time comment filtering',
        'Automated flagging of harmful content',
        'Reduced moderation workload by 80%',
        'Improved user experience and retention'
      ],
      color: 'blue'
    },
    {
      iconName: 'users',
      title: 'Online Communities',
      description: 'Maintain respectful conversations in forums, discussion boards, and community platforms.',
      benefits: [
        'Automated community guidelines enforcement',
        'Proactive harassment prevention',
        'Sentiment analysis for community health',
        'Customizable moderation rules'
      ],
      color: 'green'
    },
    {
      iconName: 'gamepad',
      title: 'Gaming Platforms',
      description: 'Prevent abusive in-game chat and create safer gaming environments.',
      benefits: [
        'Real-time chat moderation',
        'Toxicity detection in voice-to-text',
        'Player behavior tracking',
        'Reduced player churn from toxic behavior'
      ],
      color: 'purple'
    },
    {
      iconName: 'book',
      title: 'Educational Platforms',
      description: 'Ensure safe student discussions and protect minors from inappropriate content.',
      benefits: [
        'Child-safe content filtering',
        'Bullying detection and prevention',
        'Teacher alert system',
        'COPPA compliance support'
      ],
      color: 'yellow'
    },
    {
      iconName: 'shield',
      title: 'Enterprise Compliance',
      description: 'Monitor internal communications for policy violations and compliance risks.',
      benefits: [
        'Workplace harassment detection',
        'Compliance monitoring',
        'Data leak prevention',
        'Audit trail and reporting'
      ],
      color: 'red'
    },
    {
      iconName: 'briefcase',
      title: 'Customer Support',
      description: 'Analyze customer feedback and support tickets for sentiment and escalation risks.',
      benefits: [
        'Sentiment analysis on tickets',
        'Priority escalation for angry customers',
        'Agent performance insights',
        'Customer satisfaction improvement'
      ],
      color: 'indigo'
    }
  ];

  const getIcon = (iconName: string) => {
    const icons: any = {
      message: <FiMessageSquare className="w-12 h-12" />,
      users: <FiUsers className="w-12 h-12" />,
      gamepad: <FiGamepad className="w-12 h-12" />,
      book: <FiBook className="w-12 h-12" />,
      shield: <FiShield className="w-12 h-12" />,
      briefcase: <FiBriefcase className="w-12 h-12" />
    };
    return icons[iconName];
  };

  const getColorClasses = (color: string) => {
    const colors: any = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-500' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-500' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-500' },
      red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-500' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-500' }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Use Cases
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cyber Guard AI powers content moderation across diverse industries and platforms. Discover how we can help your organization.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {useCases.map((useCase, index) => {
            const colors = getColorClasses(useCase.color);
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${colors.bg} rounded-xl ${colors.text} mb-6`}>
                  {getIcon(useCase.iconName)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{useCase.title}</h3>
                <p className="text-gray-600 mb-6">{useCase.description}</p>
                <div className="space-y-3">
                  {useCase.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`w-2 h-2 ${colors.bg} rounded-full mt-2`}></div>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            See how Cyber Guard AI can transform your content moderation strategy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/analyze"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Try Live Demo
            </Link>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-blue-500 text-white rounded-lg font-semibold text-lg hover:bg-blue-400 transition-colors border-2 border-white"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
