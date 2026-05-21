'use client';

import { useState } from 'react';
import { moderationAPI } from '@/lib/api';
import { FiRefreshCw, FiShield, FiEdit3 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AssistantPage() {
  const [content, setContent] = useState('');
  const [rewrittenContent, setRewrittenContent] = useState('');
  const [tone, setTone] = useState<'professional' | 'neutral' | 'softened'>('professional');
  const [loading, setLoading] = useState(false);
  const [redactedContent, setRedactedContent] = useState('');

  const handleRewrite = async () => {
    if (!content.trim()) {
      toast.error('Please enter content to rewrite');
      return;
    }

    setLoading(true);
    try {
      const result = await moderationAPI.rewrite({
        content,
        tone,
        preserve_meaning: true
      });
      setRewrittenContent(result.rewritten_content);
      toast.success('Content rewritten successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Rewrite failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRedactPII = async () => {
    if (!content.trim()) {
      toast.error('Please enter content to redact');
      return;
    }

    setLoading(true);
    try {
      const result = await moderationAPI.redactPII({ content });
      setRedactedContent(result.redacted_content);
      toast.success('PII redacted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Redaction failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Assistant</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Original Content</h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter content to improve, rewrite, or redact PII..."
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-sm text-gray-500 mt-2">{content.length} characters</p>

            {/* Tone Selection */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rewrite Tone
              </label>
              <div className="flex space-x-3">
                <button
                  onClick={() => setTone('professional')}
                  className={`flex-1 px-4 py-2 rounded-lg ${
                    tone === 'professional'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Professional
                </button>
                <button
                  onClick={() => setTone('neutral')}
                  className={`flex-1 px-4 py-2 rounded-lg ${
                    tone === 'neutral'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Neutral
                </button>
                <button
                  onClick={() => setTone('softened')}
                  className={`flex-1 px-4 py-2 rounded-lg ${
                    tone === 'softened'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Softened
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleRewrite}
                disabled={loading || !content.trim()}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                <span>{loading ? 'Rewriting...' : 'Rewrite Content'}</span>
              </button>

              <button
                onClick={handleRedactPII}
                disabled={loading || !content.trim()}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <FiShield />
                <span>{loading ? 'Redacting...' : 'Redact PII'}</span>
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {/* Rewritten Content */}
            {rewrittenContent && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Rewritten Content</h2>
                  <button
                    onClick={() => copyToClipboard(rewrittenContent)}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                  >
                    Copy
                  </button>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{rewrittenContent}</p>
                </div>
              </div>
            )}

            {/* Redacted Content */}
            {redactedContent && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Redacted Content</h2>
                  <button
                    onClick={() => copyToClipboard(redactedContent)}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                  >
                    Copy
                  </button>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{redactedContent}</p>
                </div>
              </div>
            )}

            {/* Info Card */}
            {!rewrittenContent && !redactedContent && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">AI Assistant Features</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FiEdit3 className="text-blue-600 text-xl mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">Content Rewriting</h3>
                      <p className="text-sm text-gray-600">
                        Transform toxic or inappropriate content into safe, professional alternatives
                        while preserving the original meaning.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FiShield className="text-green-600 text-xl mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">PII Redaction</h3>
                      <p className="text-sm text-gray-600">
                        Automatically detect and redact personally identifiable information including
                        emails, phone numbers, SSNs, and credit card numbers.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FiRefreshCw className="text-purple-600 text-xl mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">Tone Adjustment</h3>
                      <p className="text-sm text-gray-600">
                        Choose from professional, neutral, or softened tones to match your
                        communication needs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Examples */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Example Use Cases</h2>
          <p className="text-sm text-gray-500 mb-4">Click any example to load it into the editor above.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            <button
              onClick={() => setContent("You are absolutely useless! I can't believe how stupid you are. This is the worst service I've ever experienced!")}
              className="p-4 bg-red-50 border border-red-200 rounded-lg text-left hover:bg-red-100 transition-colors"
            >
              <h3 className="font-medium text-red-800 mb-1">😠 Angry Customer Message</h3>
              <p className="text-xs text-red-600 italic">"You are absolutely useless! I can't believe how stupid you are..."</p>
              <p className="text-xs text-gray-500 mt-2">→ Rewrite to professional tone</p>
            </button>

            <button
              onClick={() => setContent("My name is John Smith, my email is john.smith@gmail.com, phone is 9876543210, and my credit card number is 4111-1111-1111-1111.")}
              className="p-4 bg-green-50 border border-green-200 rounded-lg text-left hover:bg-green-100 transition-colors"
            >
              <h3 className="font-medium text-green-800 mb-1">🔒 PII Data Example</h3>
              <p className="text-xs text-green-600 italic">"My name is John Smith, email is john.smith@gmail.com..."</p>
              <p className="text-xs text-gray-500 mt-2">→ Redact PII to protect privacy</p>
            </button>

            <button
              onClick={() => setContent("I hate this product so much. It's garbage and whoever made it is an idiot. Total waste of money!")}
              className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-left hover:bg-orange-100 transition-colors"
            >
              <h3 className="font-medium text-orange-800 mb-1">⭐ Toxic Review</h3>
              <p className="text-xs text-orange-600 italic">"I hate this product so much. It's garbage..."</p>
              <p className="text-xs text-gray-500 mt-2">→ Rewrite to neutral feedback</p>
            </button>

            <button
              onClick={() => setContent("This is the worst company ever. Your employees are incompetent fools who don't know what they're doing. I will never use your service again!")}
              className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-left hover:bg-purple-100 transition-colors"
            >
              <h3 className="font-medium text-purple-800 mb-1">📢 Hostile Complaint</h3>
              <p className="text-xs text-purple-600 italic">"This is the worst company ever. Your employees are incompetent..."</p>
              <p className="text-xs text-gray-500 mt-2">→ Rewrite to constructive feedback</p>
            </button>

            <button
              onClick={() => setContent("Contact me at rahul.kumar@company.in or call +91-9876543210. My Aadhaar is 1234-5678-9012 and PAN is ABCDE1234F.")}
              className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left hover:bg-blue-100 transition-colors"
            >
              <h3 className="font-medium text-blue-800 mb-1">🇮🇳 Indian PII Example</h3>
              <p className="text-xs text-blue-600 italic">"Contact me at rahul.kumar@company.in, Aadhaar: 1234-5678-9012..."</p>
              <p className="text-xs text-gray-500 mt-2">→ Redact Indian PII data</p>
            </button>

            <button
              onClick={() => setContent("You're such a pathetic loser. Nobody likes you and you should just disappear. You're worthless and everyone knows it.")}
              className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left hover:bg-yellow-100 transition-colors"
            >
              <h3 className="font-medium text-yellow-800 mb-1">🚫 Harassment Message</h3>
              <p className="text-xs text-yellow-600 italic">"You're such a pathetic loser. Nobody likes you..."</p>
              <p className="text-xs text-gray-500 mt-2">→ Rewrite to softened tone</p>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
