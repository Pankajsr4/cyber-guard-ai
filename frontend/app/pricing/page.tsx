'use client';

import { FiCheck, FiMail } from 'react-icons/fi';
import Link from 'next/link';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for testing and small projects',
      features: [
        '1,000 API requests/month',
        'Basic moderation analysis',
        'Email support',
        'Community access',
        'API documentation',
        '7-day data retention'
      ],
      cta: 'Get Started',
      highlighted: false
    },
    {
      name: 'Pro',
      price: '₹999',
      period: '/month',
      description: 'For growing businesses and applications',
      features: [
        '50,000 API requests/month',
        'Advanced risk scoring',
        'Dashboard analytics',
        'Priority support',
        'Custom webhooks',
        '30-day data retention',
        'Multi-language support',
        'Batch processing'
      ],
      cta: 'Start Pro Trial',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For large-scale deployments',
      features: [
        'Unlimited API requests',
        'Dedicated infrastructure',
        'Custom AI tuning',
        'SLA & compliance support',
        'Dedicated account manager',
        'Custom data retention',
        'On-premise deployment option',
        'Advanced security features',
        '24/7 phone support'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Flexible Pricing for Every Scale
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our core AI moderation features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.highlighted ? 'ring-4 ring-blue-600 transform scale-105' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="bg-blue-600 text-white text-center py-2 font-semibold">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <Link
                  href={plan.name === 'Enterprise' ? '/contact' : '/signup'}
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors mb-8 ${
                    plan.highlighted
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <FiCheck className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise Contact */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-12 text-center text-white">
          <FiMail className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Need Enterprise Integration?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Contact us for custom pricing, dedicated infrastructure, and enterprise-grade support.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Contact Sales Team
          </Link>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                q: 'Can I upgrade or downgrade my plan?',
                a: 'Yes, you can change your plan at any time. Changes take effect immediately.'
              },
              {
                q: 'What happens if I exceed my API limit?',
                a: 'You can purchase additional requests or upgrade to a higher tier. We will notify you before any overage charges.'
              },
              {
                q: 'Is there a free trial for Pro plan?',
                a: 'Yes, we offer a 14-day free trial for the Pro plan with full feature access.'
              },
              {
                q: 'Do you offer refunds?',
                a: 'Yes, we offer a 30-day money-back guarantee for all paid plans.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
