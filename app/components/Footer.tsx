'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export default function Footer() {
  const emergencyContacts = [
    { name: "National Crisis Helpline", number: "1800-599-0019", available: "24/7" },
    { name: "Student Support Helpline", number: "1800-123-4567", available: "Mon-Fri, 9AM-9PM" },
    { name: "Campus Emergency", number: "1800-911-HELP", available: "24/7" },
  ];

  const quickLinks = [
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Mental Health Resources", href: "/resources" },
    { name: "Crisis Support", href: "/emergency" },
    { name: "Contact Us", href: "#contact" },
    { name: "Accessibility", href: "#accessibility" },
  ];

  const features = [
    { name: "AI Support Chat", href: "/ai-support" },
    { name: "Book Counseling", href: "/book" },
    { name: "Resource Library", href: "/resources" },
    { name: "Peer Community", href: "/community" },
    { name: "Admin Dashboard", href: "#admin" },
  ];

  const languages = [
    "English", "हिन्दी", "বাংলা", "தமிழ்", "मराठी"
  ];

  return (
    <footer className="relative py-16 px-4 sm:px-6 lg:px-8 mt-24">
      {/* Background overlay for footer */}
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Emergency Contacts - Prominent Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-red-50/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-red-200/50 mb-12"
        >
          <div className="text-center mb-6">
            <Icon icon="mdi:phone-alert" className="text-3xl text-red-600 mx-auto mb-2" />
            <h3 className="font-poppins font-semibold text-xl text-slate-800">Crisis Support Available 24/7</h3>
            <p className="text-slate-600 mt-2">If you&apos;re in immediate danger, call emergency services or use these helplines</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {emergencyContacts.map((contact, index) => (
              <motion.a
                key={index}
                href={`tel:${contact.number}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/30 backdrop-blur-sm rounded-xl p-4 text-center border border-red-200/30 hover:bg-white/40 transition-all duration-300 group"
              >
                <div className="font-semibold text-slate-800 group-hover:text-red-700 transition-colors">
                  {contact.name}
                </div>
                <div className="text-2xl font-bold text-red-600 my-2">{contact.number}</div>
                <div className="text-sm text-slate-600">{contact.available}</div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-2 mb-4">
              <Icon icon="line-md:heart-filled" className="text-2xl text-emerald-400" />
              <span className="font-poppins font-semibold text-xl text-slate-800">MindWell</span>
            </div>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Supporting student mental health with compassionate AI, professional counseling, 
              and peer community support. Your wellbeing matters.
            </p>
            
            {/* Available Languages */}
            <div className="mb-4">
              <h4 className="font-medium text-slate-800 mb-2">Available in:</h4>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang, index) => (
                  <span key={index} className="bg-white/20 text-slate-700 px-2 py-1 rounded text-xs">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Features Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-poppins font-medium text-lg text-slate-800 mb-4">Platform Features</h4>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index}>
                  <a 
                    href={feature.href}
                    className="text-slate-600 hover:text-emerald-600 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <Icon icon="mdi:chevron-right" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {feature.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support & Legal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="font-poppins font-medium text-lg text-slate-800 mb-4">Support & Legal</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-slate-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <Icon icon="mdi:chevron-right" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Social */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <h4 className="font-poppins font-medium text-lg text-slate-800 mb-4">Connect With Us</h4>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Icon icon="mdi:email-outline" className="text-slate-600" />
                <a href="mailto:support@mindwell.edu" className="text-slate-600 hover:text-blue-600 transition-colors">
                  support@mindwell.edu
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Icon icon="mdi:phone-outline" className="text-slate-600" />
                <a href="tel:1800-MINDWELL" className="text-slate-600 hover:text-blue-600 transition-colors">
                  1800-MINDWELL
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a 
                href="#"
                className="bg-white/20 p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-white/30 transition-all duration-300"
                aria-label="Follow us on Twitter"
              >
                <Icon icon="mdi:twitter" className="text-xl" />
              </a>
              <a 
                href="#"
                className="bg-white/20 p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-white/30 transition-all duration-300"
                aria-label="Follow us on LinkedIn"
              >
                <Icon icon="mdi:linkedin" className="text-xl" />
              </a>
              <a 
                href="#"
                className="bg-white/20 p-2 rounded-lg text-slate-600 hover:text-green-600 hover:bg-white/30 transition-all duration-300"
                aria-label="Contact us on WhatsApp"
              >
                <Icon icon="mdi:whatsapp" className="text-xl" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-white/20 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <p>&copy; 2024 MindWell. All rights reserved.</p>
              <div className="flex items-center gap-2">
                <Icon icon="mdi:shield-check" className="text-green-600" />
                <span>HIPAA Compliant</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="mdi:heart" className="text-red-500" />
                <span>Made with care for students</span>
              </div>
            </div>
          </div>

          {/* Special Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
              If you&apos;re experiencing a mental health emergency, please contact your local emergency services immediately.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}