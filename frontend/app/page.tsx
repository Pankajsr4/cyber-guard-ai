'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiShield, FiZap, FiGlobe, FiLock, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [router]);

  const features = [
    {
      icon: <FiShield className="w-8 h-8" />,
      title: 'Multi-Category Detection',
      description: 'Detect hate speech, harassment, violence, and more with AI precision',
    },
    {
      icon: <FiZap className="w-8 h-8" />,
      title: 'Fast Analysis',
      description: 'Get results in under 1 minute for instant content moderation',
    },
    {
      icon: <FiGlobe className="w-8 h-8" />,
      title: 'Multi-Language Support',
      description: 'Multilingual support with automatic language detection',
    },
    {
      icon: <FiLock className="w-8 h-8" />,
      title: 'Privacy First',
      description: 'GDPR compliant with PII redaction and data encryption',
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: 'Risk Scoring',
      description: 'Multi-level risk assessment with explainable AI',
    },
    {
      icon: <FiCheckCircle className="w-8 h-8" />,
      title: 'AI Assistance',
      description: 'Auto-rewrite suggestions and tone adjustment tools',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-block mb-6">
            <div className="flex items-center gap-3 bg-blue-500/20 px-6 py-3 rounded-full border border-blue-500/50">
              <FiShield className="w-6 h-6 text-blue-400" />
              <span className="text-blue-400 font-semibold">AI-Powered Content Moderation</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
            Cyber-Guard AI
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Protect your digital spaces with intelligent, explainable, and privacy-conscious content moderation
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/analyze"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Analyze Now
            </Link>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold text-lg transition-all border border-white/20"
            >
              View Documentation
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16">
            {[
              { value: 'Multi', label: 'Harm Categories' },
              { value: '<1 min', label: 'Response Time' },
              { value: 'Multi', label: 'Languages' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
              >
                <div className="text-3xl font-bold text-blue-400 mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need for comprehensive content moderation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/20"
            >
              <div className="text-blue-400 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Start moderating content with AI-powered intelligence today
          </p>
          <Link
            href="/analyze"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Start Analyzing
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-12">

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="text-blue-400">🔹</span> PRODUCT
              </h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link href="/features" className="hover:text-blue-400 transition-colors">Features</Link></li>
                <li><a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Documentation</a></li>
                <li><a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">API Reference</a></li>
                <li><Link href="/use-cases" className="hover:text-blue-400 transition-colors">Use Cases</Link></li>
                <li><Link href="/analyze" className="hover:text-blue-400 transition-colors">Live Demo</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="text-blue-400">🔹</span> COMPANY
              </h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-blue-400 transition-colors">About</Link></li>
                <li><Link href="/mission" className="hover:text-blue-400 transition-colors">Mission</Link></li>
                <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="text-blue-400">🔹</span> LEGAL
              </h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom Footer */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <FiShield className="w-6 h-6 text-blue-400" />
                <span className="text-white font-semibold">Cyber Guard AI</span>
              </div>
              <p className="text-gray-400 text-sm text-center">
                © 2026 Cyber Guard AI. All rights reserved. Empowering Safer Digital Communities Through Intelligent Moderation.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
