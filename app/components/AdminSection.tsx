'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminSection() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const stressLevelData = [
    { month: 'Jan', stress: 65, anxiety: 45, counseling: 23 },
    { month: 'Feb', stress: 72, anxiety: 52, counseling: 31 },
    { month: 'Mar', stress: 88, anxiety: 78, counseling: 45 }, // Exam period spike
    { month: 'Apr', stress: 91, anxiety: 82, counseling: 52 }, // Peak exam stress
    { month: 'May', stress: 58, anxiety: 41, counseling: 28 }, // Post-exam relief
    { month: 'Jun', stress: 45, anxiety: 32, counseling: 18 },
  ];

  const supportTypeData = [
    { name: 'AI Chat Support', value: 45, color: '#10B981' },
    { name: 'Counselor Sessions', value: 30, color: '#3B82F6' },
    { name: 'Peer Community', value: 15, color: '#F59E0B' },
    { name: 'Resources Used', value: 10, color: '#8B5CF6' },
  ];

  const peakHoursData = [
    { hour: '6am', usage: 12 },
    { hour: '9am', usage: 45 },
    { hour: '12pm', usage: 78 },
    { hour: '3pm', usage: 89 },
    { hour: '6pm', usage: 156 },
    { hour: '9pm', usage: 201 },
    { hour: '12am', usage: 98 },
  ];

  const keyInsights = [
    {
      title: "Exam Period Stress Spike",
      description: "40% increase in support requests during March-April exam period",
      recommendation: "Schedule additional counseling sessions during exam months",
      icon: "mdi:trending-up",
      color: "red"
    },
    {
      title: "Evening Peak Usage",
      description: "60% of AI chat interactions occur between 6-11 PM",
      recommendation: "Ensure adequate AI response capacity during evening hours",
      icon: "mdi:clock-outline",
      color: "blue"
    },
    {
      title: "Peer Support Growth",
      description: "Community forum engagement increased by 25% this semester",
      recommendation: "Add more trained peer moderators to handle growing community",
      icon: "material-symbols:group",
      color: "green"
    },
  ];

  const quickActions = [
    { name: "Schedule Workshop", icon: "material-symbols:event", color: "blue" },
    { name: "Add Counselor Slots", icon: "mdi:calendar-plus", color: "green" },
    { name: "Send Wellness Alert", icon: "mdi:bell-alert", color: "orange" },
    { name: "Export Analytics", icon: "mdi:download", color: "purple" },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" id="admin">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-100/50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Icon icon="material-symbols:dashboard" />
            Admin Analytics Dashboard
          </div>
          <h2 className="font-poppins font-medium text-4xl text-slate-800 mb-4">
            Data-Driven Mental Health Insights
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Anonymous analytics help institutions recognize patterns, plan interventions, 
            and improve student mental health support services.
          </p>
        </motion.div>

        {/* Demo Login */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/30 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Icon icon="material-symbols:admin-panel-settings" className="text-2xl text-indigo-600" />
              <h3 className="font-poppins font-medium text-xl text-slate-800">Institution Dashboard</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live Data
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/20 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Icon icon="material-symbols:group" className="text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">1,247</div>
                  <div className="text-sm text-slate-600">Active Students</div>
                </div>
              </div>
            </div>

            <div className="bg-white/20 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Icon icon="material-symbols:psychology" className="text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">3,456</div>
                  <div className="text-sm text-slate-600">AI Interactions</div>
                </div>
              </div>
            </div>

            <div className="bg-white/20 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Icon icon="mdi:calendar-check" className="text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">234</div>
                  <div className="text-sm text-slate-600">Sessions Booked</div>
                </div>
              </div>
            </div>

            <div className="bg-white/20 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Icon icon="mdi:trending-down" className="text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">-12%</div>
                  <div className="text-sm text-slate-600">Crisis Reports</div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Stress Level Trends */}
            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-slate-800">Mental Health Trends</h4>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded-lg px-3 py-1 text-sm text-slate-700"
                  suppressHydrationWarning={true}
                >
                  <option value="month">6 Months</option>
                  <option value="year">1 Year</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={stressLevelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Area type="monotone" dataKey="stress" stackId="1" stroke="#ef4444" fill="#ef444420" />
                  <Area type="monotone" dataKey="anxiety" stackId="1" stroke="#f59e0b" fill="#f59e0b20" />
                  <Area type="monotone" dataKey="counseling" stackId="1" stroke="#10b981" fill="#10b98120" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Support Type Distribution */}
            <div className="bg-white/10 rounded-xl p-4">
              <h4 className="font-medium text-slate-800 mb-4">Support Channel Usage</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={supportTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {supportTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {supportTypeData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Peak Hours Chart */}
          <div className="bg-white/10 rounded-xl p-4 mb-6">
            <h4 className="font-medium text-slate-800 mb-4">Daily Usage Patterns</h4>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Bar dataKey="usage" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Insights & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Key Insights */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="font-poppins font-medium text-xl text-slate-800 mb-6">AI-Generated Insights</h3>
            <div className="space-y-4">
              {keyInsights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/30"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      insight.color === 'red' ? 'bg-red-100' :
                      insight.color === 'blue' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      <Icon icon={insight.icon} className={`${
                        insight.color === 'red' ? 'text-red-600' :
                        insight.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-800 mb-1">{insight.title}</h4>
                      <p className="text-sm text-slate-600 mb-2">{insight.description}</p>
                      <p className="text-sm text-indigo-700 font-medium">{insight.recommendation}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="font-poppins font-medium text-xl text-slate-800 mb-6">Quick Actions</h3>
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      action.color === 'blue' ? 'border-blue-200/50 bg-blue-50/20 hover:bg-blue-50/40' :
                      action.color === 'green' ? 'border-green-200/50 bg-green-50/20 hover:bg-green-50/40' :
                      action.color === 'orange' ? 'border-orange-200/50 bg-orange-50/20 hover:bg-orange-50/40' :
                      'border-purple-200/50 bg-purple-50/20 hover:bg-purple-50/40'
                    }`}
                    suppressHydrationWarning={true}
                  >
                    <Icon icon={action.icon} className={`text-xl ${
                      action.color === 'blue' ? 'text-blue-600' :
                      action.color === 'green' ? 'text-green-600' :
                      action.color === 'orange' ? 'text-orange-600' :
                      'text-purple-600'
                    }`} />
                    <span className="font-medium text-slate-800">{action.name}</span>
                  </motion.button>
                ))}
              </div>

              {/* Privacy Notice */}
              <div className="bg-green-100/20 rounded-lg p-4 border border-green-200/30">
                <div className="flex items-start gap-2">
                  <Icon icon="mdi:shield-check" className="text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-800 mb-1">Privacy Protected</h4>
                    <p className="text-sm text-slate-600">
                      All analytics are completely anonymous. No personal identifiers or individual conversations 
                      are stored or accessible by administrators.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}