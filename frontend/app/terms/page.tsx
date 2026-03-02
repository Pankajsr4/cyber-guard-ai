'use client';

import { FiFileText } from 'react-icons/fi';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-blue-100 px-6 py-3 rounded-full mb-6">
            <FiFileText className="w-6 h-6 text-blue-600" />
            <span className="text-blue-600 font-semibold">Terms of Service</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">Last updated: February 28, 2026</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Cyber Guard AI services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use of Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You agree to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Use the service only for lawful purposes</li>
              <li>Not misuse the platform or attempt unauthorized access</li>
              <li>Not attempt to reverse engineer the system</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Maintain the security of your API keys and credentials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. API Usage</h2>
            <p className="text-gray-700 leading-relaxed">
              API usage is subject to rate limits based on your subscription plan. Exceeding these limits may result in temporary service suspension or additional charges. You are responsible for all activity under your API keys.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Content Responsibility</h2>
            <p className="text-gray-700 leading-relaxed">
              You retain all rights to content you submit for analysis. Cyber Guard AI does not claim ownership of your content. However, you grant us a limited license to process and analyze submitted content to provide our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Service Availability</h2>
            <p className="text-gray-700 leading-relaxed">
              While we strive for 99.9% uptime, we do not guarantee uninterrupted service. Scheduled maintenance will be announced in advance. We are not liable for service interruptions beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Prohibited Activities</h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
              <p className="text-gray-700 mb-3 font-semibold">The following activities are strictly prohibited:</p>
              <ul className="space-y-2 text-gray-700">
                <li>• Attempting to bypass rate limits or security measures</li>
                <li>• Using the service to harm, harass, or violate others' rights</li>
                <li>• Sharing API keys or account credentials</li>
                <li>• Automated scraping or data mining</li>
                <li>• Reselling or redistributing our services without permission</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Payment Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              Paid subscriptions are billed monthly or annually. Payments are non-refundable except as required by law or our refund policy. We reserve the right to change pricing with 30 days notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate these terms. You may cancel your subscription at any time. Upon termination, your access to the service will cease, and your data will be deleted according to our retention policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              Cyber Guard AI is provided "as is" without warranties. We are not liable for indirect, incidental, or consequential damages arising from use of our services. Our total liability is limited to the amount paid for services in the past 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these terms periodically. Significant changes will be communicated via email. Continued use of services after changes constitutes acceptance of new terms.
            </p>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these terms, contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-900 font-semibold">legal@cyberguardai.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
