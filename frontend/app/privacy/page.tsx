'use client';

import { FiShield, FiLock, FiEye, FiDatabase } from 'react-icons/fi';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-blue-100 px-6 py-3 rounded-full mb-6">
            <FiShield className="w-6 h-6 text-blue-600" />
            <span className="text-blue-600 font-semibold">Privacy Policy</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Your Privacy Matters
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: February 28, 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              At Cyber Guard AI, we take your privacy seriously. We collect minimal user data strictly for analysis purposes and are committed to protecting your information with industry-leading security practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <FiDatabase className="text-blue-600" />
              Data Collection
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect only the data necessary to provide our content moderation services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Content submitted for analysis (text, images, audio)</li>
              <li>API usage metrics and request logs</li>
              <li>Account information (email, organization name)</li>
              <li>Technical data (IP address, browser type, timestamps)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <FiLock className="text-blue-600" />
              What We Don't Do
            </h2>
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>We do NOT sell user data to third parties</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>We do NOT share sensitive information without consent</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>We do NOT store analyzed content beyond necessary processing time</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>We do NOT use your data to train models without permission</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <FiEye className="text-blue-600" />
              Data Usage
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your data is used exclusively for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Providing content moderation analysis</li>
              <li>Improving service quality and accuracy</li>
              <li>Generating anonymized usage statistics</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All data is encrypted using secure protocols:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">In Transit</h3>
                <p className="text-sm text-gray-600">TLS 1.3 encryption for all API communications</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">At Rest</h3>
                <p className="text-sm text-gray-600">AES-256 encryption for stored data</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              Content submitted for analysis is retained only as long as necessary for processing and quality assurance. By default:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-4">
              <li>Free tier: 7 days</li>
              <li>Pro tier: 30 days</li>
              <li>Enterprise: Custom retention policies available</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Access your personal data</li>
              <li>Request data deletion</li>
              <li>Opt-out of data collection</li>
              <li>Export your data</li>
              <li>Update or correct your information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Compliance</h2>
            <p className="text-gray-700 leading-relaxed">
              Cyber Guard AI is compliant with major data protection regulations including GDPR, CCPA, and other applicable privacy laws. We conduct regular security audits and maintain SOC 2 Type II certification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              For privacy-related questions or to exercise your rights, contact our Data Protection Officer at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-900 font-semibold">Email: privacy@cyberguardai.com</p>
            </div>
          </section>

          <section className="border-t pt-8">
            <p className="text-sm text-gray-600">
              This privacy policy may be updated periodically. We will notify users of significant changes via email or platform notifications.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
