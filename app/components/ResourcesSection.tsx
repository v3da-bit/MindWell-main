'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

type LanguageId = 'english' | 'hindi' | 'tamil' | 'bengali' | 'marathi';
type CategoryId = 'relaxation' | 'meditation' | 'study' | 'coping';

type ResourceItem = {
  type: 'video' | 'audio' | 'guide';
  title: string;
  duration: string;
  thumbnail: 'video' | 'audio' | 'guide';
  videoUrl: string;
  thumbnailUrl: string;
};

type CategoryMap = Record<CategoryId, ResourceItem[]>;
type ResourcesMap = Record<LanguageId, CategoryMap>;

export default function ResourcesSection() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('relaxation');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId>('english');

  const categories: Array<{ id: CategoryId; name: string; icon: string; color: keyof typeof colorClasses }> = [
    { id: 'relaxation', name: 'Relaxation', icon: 'material-symbols:spa', color: 'emerald' },
    { id: 'meditation', name: 'Meditation', icon: 'material-symbols:self-care', color: 'blue' },
    { id: 'study', name: 'Study Tips', icon: 'material-symbols:school', color: 'purple' },
    { id: 'coping', name: 'Coping Strategies', icon: 'material-symbols:psychology', color: 'orange' },
  ];

  const languages: Array<{ id: LanguageId; name: string; flag: string }> = [
    { id: 'english', name: 'English', flag: '🇺🇸' },
    { id: 'hindi', name: 'हिन्दी', flag: '🇮🇳' },
    { id: 'tamil', name: 'தமிழ்', flag: '🇮🇳' },
    { id: 'bengali', name: 'বাংলা', flag: '🇮🇳' },
    { id: 'marathi', name: 'मराठी', flag: '🇮🇳' },
  ];

  // One source of truth: resources per language
  const resourcesByLanguage: ResourcesMap = {
    english: {
      relaxation: [
        { type: 'video', title: 'Progressive Muscle Relaxation', duration: '15 min', thumbnail: 'video', videoUrl: 'https://www.youtube.com/watch?v=1nZEdqcGVzo', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'audio', title: 'Ocean Sounds for Calm', duration: '30 min', thumbnail: 'audio', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'guide', title: 'Quick Relaxation Techniques', duration: '5 min read', thumbnail: 'guide', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
      ],
      meditation: [
        { type: 'video', title: 'Mindfulness for Students', duration: '20 min', thumbnail: 'video', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'audio', title: 'Breathing Meditation', duration: '10 min', thumbnail: 'audio', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'guide', title: 'Daily Meditation Practice', duration: '8 min read', thumbnail: 'guide', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
      ],
      study: [
        { type: 'video', title: 'Effective Study Methods', duration: '25 min', thumbnail: 'video', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'guide', title: 'Managing Study Stress', duration: '12 min read', thumbnail: 'guide', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'audio', title: 'Focus Enhancement Sounds', duration: '45 min', thumbnail: 'audio', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
      ],
      coping: [
        { type: 'video', title: 'Dealing with Anxiety', duration: '18 min', thumbnail: 'video', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'guide', title: 'Healthy Coping Mechanisms', duration: '10 min read', thumbnail: 'guide', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'audio', title: 'Stress Relief Meditation', duration: '20 min', thumbnail: 'audio', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
      ],
    },
    hindi: {
      relaxation: [
        { type: 'video', title: 'Progressive Muscle Relaxation', duration: '15 min', thumbnail: 'video', videoUrl: 'https://www.youtube.com/watch?v=ihO02wUzgkc', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'audio', title: 'Ocean Sounds for Calm', duration: '30 min', thumbnail: 'audio', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'guide', title: 'Quick Relaxation Techniques', duration: '5 min read', thumbnail: 'guide', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
      ],
      meditation: [
        { type: 'video', title: 'Mindfulness for Students', duration: '20 min', thumbnail: 'video', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'audio', title: 'Breathing Meditation', duration: '10 min', thumbnail: 'audio', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'guide', title: 'Daily Meditation Practice', duration: '8 min read', thumbnail: 'guide', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
      ],
      study: [
        { type: 'video', title: 'Effective Study Methods', duration: '25 min', thumbnail: 'video', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'guide', title: 'Managing Study Stress', duration: '12 min read', thumbnail: 'guide', videoUrl: 'https://www.youtube.com/watch?v=kfIK3LY7OYA', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'audio', title: 'Focus Enhancement Sounds', duration: '45 min', thumbnail: 'audio', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
      ],
      coping: [
        { type: 'video', title: 'Dealing with Anxiety', duration: '18 min', thumbnail: 'video', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'guide', title: 'Healthy Coping Mechanisms', duration: '10 min read', thumbnail: 'guide', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'audio', title: 'Stress Relief Meditation', duration: '20 min', thumbnail: 'audio', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
      ],
    },
    tamil: {
      relaxation: [
        { type: 'video', title: 'Progressive Muscle Relaxation', duration: '15 min', thumbnail: 'video', videoUrl: 'https://www.youtube.com/watch?v=ihO02wUzgkc', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'audio', title: 'Ocean Sounds for Calm', duration: '30 min', thumbnail: 'audio', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'guide', title: 'Quick Relaxation Techniques', duration: '5 min read', thumbnail: 'guide', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
      ],
      meditation: [
        { type: 'video', title: 'Mindfulness for Students', duration: '20 min', thumbnail: 'video', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'audio', title: 'Breathing Meditation', duration: '10 min', thumbnail: 'audio', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'guide', title: 'Daily Meditation Practice', duration: '8 min read', thumbnail: 'guide', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
      ],
      study: [
        { type: 'video', title: 'Effective Study Methods', duration: '25 min', thumbnail: 'video', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'guide', title: 'Managing Study Stress', duration: '12 min read', thumbnail: 'guide', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'audio', title: 'Focus Enhancement Sounds', duration: '45 min', thumbnail: 'audio', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
      ],
      coping: [
        { type: 'video', title: 'Dealing with Anxiety', duration: '18 min', thumbnail: 'video', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'guide', title: 'Healthy Coping Mechanisms', duration: '10 min read', thumbnail: 'guide', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'audio', title: 'Stress Relief Meditation', duration: '20 min', thumbnail: 'audio', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
      ],
    },
    bengali: {
      relaxation: [
        { type: 'video', title: 'Progressive Muscle Relaxation', duration: '15 min', thumbnail: 'video', videoUrl: 'https://www.youtube.com/watch?v=ihO02wUzgkc', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'audio', title: 'Ocean Sounds for Calm', duration: '30 min', thumbnail: 'audio', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'guide', title: 'Quick Relaxation Techniques', duration: '5 min read', thumbnail: 'guide', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
      ],
      meditation: [
        { type: 'video', title: 'Mindfulness for Students', duration: '20 min', thumbnail: 'video', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'audio', title: 'Breathing Meditation', duration: '10 min', thumbnail: 'audio', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'guide', title: 'Daily Meditation Practice', duration: '8 min read', thumbnail: 'guide', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
      ],
      study: [
        { type: 'video', title: 'Effective Study Methods', duration: '25 min', thumbnail: 'video', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'guide', title: 'Managing Study Stress', duration: '12 min read', thumbnail: 'guide', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'audio', title: 'Focus Enhancement Sounds', duration: '45 min', thumbnail: 'audio', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
      ],
      coping: [
        { type: 'video', title: 'Dealing with Anxiety', duration: '18 min', thumbnail: 'video', videoUrl: 'https://www.youtube.com/watch?v=kfIK3LY7OYA', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'guide', title: 'Healthy Coping Mechanisms', duration: '10 min read', thumbnail: 'guide', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'audio', title: 'Stress Relief Meditation', duration: '20 min', thumbnail: 'audio', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
      ],
    },
    marathi: {
      relaxation: [
        { type: 'video', title: 'Progressive Muscle Relaxation', duration: '15 min', thumbnail: 'video', videoUrl: 'https://www.youtube.com/watch?v=ihO02wUzgkc', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'audio', title: 'Ocean Sounds for Calm', duration: '30 min', thumbnail: 'audio', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'guide', title: 'Quick Relaxation Techniques', duration: '5 min read', thumbnail: 'guide', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
      ],
      meditation: [
        { type: 'video', title: 'Mindfulness for Students', duration: '20 min', thumbnail: 'video', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'audio', title: 'Breathing Meditation', duration: '10 min', thumbnail: 'audio', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'guide', title: 'Daily Meditation Practice', duration: '8 min read', thumbnail: 'guide', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
      ],
      study: [
        { type: 'video', title: 'Effective Study Methods', duration: '25 min', thumbnail: 'video', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'guide', title: 'Managing Study Stress', duration: '12 min read', thumbnail: 'guide', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'audio', title: 'Focus Enhancement Sounds', duration: '45 min', thumbnail: 'audio', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
      ],
      coping: [
        { type: 'video', title: 'Dealing with Anxiety', duration: '18 min', thumbnail: 'video', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'guide', title: 'Healthy Coping Mechanisms', duration: '10 min read', thumbnail: 'guide', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
        { type: 'audio', title: 'Stress Relief Meditation', duration: '20 min', thumbnail: 'audio', videoUrl: 'https://www.youtube.com/watch?v=abcd1234', thumbnailUrl: 'https://img.youtube.com/vi/abcd1234/hqdefault.jpg' },
      ],
    },
  };

  const getIconForType = (type: ResourceItem['type']) => {
    switch (type) {
      case 'video':
        return 'mdi:play-circle';
      case 'audio':
        return 'mdi:headphones';
      case 'guide':
        return 'mdi:book-open-variant';
      default:
        return 'mdi:file';
    }
  };

  const colorClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50',
    blue: 'bg-blue-500/10 text-blue-600 border-blue-200/50',
    purple: 'bg-purple-500/10 text-purple-600 border-purple-200/50',
    orange: 'bg-orange-500/10 text-orange-600 border-orange-200/50',
  };

  // Safely get resources for current language and category
  const visibleResources = resourcesByLanguage[selectedLanguage][selectedCategory];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" id="resources">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-purple-100/50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Icon icon="material-symbols:book-outline-rounded" />
            Psychoeducational Resources
          </div>
          <h2 className="font-poppins font-medium text-4xl text-slate-800 mb-4">Learn, Practice, and Grow</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Access comprehensive mental wellness resources including videos, guided audio sessions, and educational
            materials available in multiple regional languages.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Controls */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Language Selector */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 border border-white/30">
              <h3 className="font-medium text-slate-800 mb-3">Language</h3>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
                      selectedLanguage === lang.id ? 'bg-blue-500/20 text-blue-800 border border-blue-300/50' : 'hover:bg-white/20 text-slate-700'
                    }`}
                    suppressHydrationWarning={true}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selector */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 border border-white/30">
              <h3 className="font-medium text-slate-800 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      selectedCategory === category.id ? `${colorClasses[category.color]} border` : 'hover:bg-white/20 text-slate-700'
                    }`}
                    suppressHydrationWarning={true}
                  >
                    <Icon icon={category.icon} />
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Resources Grid */}
          <div className="lg:col-span-3">
            <motion.div
              key={`${selectedLanguage}-${selectedCategory}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {visibleResources.map((resource, index) => (
                <motion.div
                  key={`${resource.title}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group bg-white/20 backdrop-blur-lg rounded-2xl p-4 border border-white/30 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-slate-200/50 to-slate-300/50 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                    <Icon icon={getIconForType(resource.type)} className="text-4xl text-slate-600 group-hover:scale-110 transition-transform" />
                    {/* Play overlay for videos */}
                    {resource.type === 'video' && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/90 rounded-full p-3">
                          <Icon icon="mdi:play" className="text-2xl text-slate-800" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          resource.type === 'video'
                            ? 'bg-red-100 text-red-700'
                            : resource.type === 'audio'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {resource.type}
                      </span>
                      <span className="text-xs text-slate-500">{resource.duration}</span>
                    </div>

                    <h4 className="font-medium text-slate-800 group-hover:text-slate-900 transition-colors">{resource.title}</h4>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-2 pt-2">
                      <div className="flex-1 bg-slate-200/50 rounded-full h-1">
                        <div className="bg-emerald-500 h-1 rounded-full w-0 group-hover:w-full transition-all duration-1000 delay-200"></div>
                      </div>
                      <Icon icon="mdi:download" className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Load More Button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <button
                className="bg-white/20 backdrop-blur-lg text-slate-700 px-6 py-3 rounded-xl font-medium border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center gap-2 mx-auto"
                suppressHydrationWarning={true}
              >
                <Icon icon="mdi:plus" />
                Load More Resources
              </button>
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/30"
        >
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-poppins font-medium text-slate-800 mb-2">100+</div>
              <div className="text-slate-600">Video Resources</div>
            </div>
            <div>
              <div className="text-3xl font-poppins font-medium text-slate-800 mb-2">50+</div>
              <div className="text-slate-600">Audio Sessions</div>
            </div>
            <div>
              <div className="text-3xl font-poppins font-medium text-slate-800 mb-2">200+</div>
              <div className="text-slate-600">Written Guides</div>
            </div>
            <div>
              <div className="text-3xl font-poppins font-medium text-slate-800 mb-2">5</div>
              <div className="text-slate-600">Languages</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
