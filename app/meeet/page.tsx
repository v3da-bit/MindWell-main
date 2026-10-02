"use client";

import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ParallaxOrbs from "@/app/components/ParallaxOrbs";
import { Icon } from "@iconify/react";

const profile = {
  name: "Meet Khamar",
  title: "Freelancing Web-Developer || Professional Cyber Security Analyst",
  bio: "I help companies to create websites && find and fix critical vulnerabilities before they’re exploited.",
  email: "meetkhamar3501@gmail.com",
  phone: "+",
  location: "Gujarat, India",
  links: {
    linkedin: "https://www.linkedin.com/in/meet-khamar-a8527330b/",
    github: "https://github.com/MeetKhamar",
    portfolio: "https://meetk-portfolio.vercel.app/",
  },
  highlights: [
    "Added AI integration.",
    "Secure website against common vulnerabilities.",
    "Main web lead of this project",
  ],
  skills: [
    "React/Js",
    "Cyber Security",
    "Python",
    "C",
    "Database",
  ],
  experience: [
    {
      role: "Web Developer & Cyber Security Analyst",
      company: "Freelance",
      period: "2025 - Present",
      summary: "I help companies find and fix critical vulnerabilities before they’re exploited.",
    },
    {
      role: "Core Team - Head Web Developer",
      company: "Bsides Vadodara",
      period: "2025 - present",
      summary: "I create and Manage whole website and manage whole core works of the community.",
    },
  ],
  education: [
    {
      school: "Parul University",
      degree: "B.Tech CSE CyberSecurity",
      period: "2024 - 2028",
    },
  ],
};

export default function MeetPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900">
      {/* Background gradient */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient( circle farthest-corner at 10% 20%, rgba(83,113,245,0.5) 0%, rgba(107,228,184,0.35) 72.3% )",
        }}
      />
      <ParallaxOrbs />
      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <section className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 sm:p-10">
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              <div className="flex-1 space-y-4">
                <p className="uppercase text-xs tracking-[0.2em] text-emerald-600 font-semibold">Meet</p>
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-poppins">
                    {profile.name}
                  </h1>
                  <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-emerald-500 shadow-lg">
                    <Image
                      src="/dev.png"
                      alt={profile.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <p className="text-lg text-emerald-700 font-medium">{profile.title}</p>
                <p className="text-slate-700 leading-relaxed">{profile.bio}</p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-colors"
                  >
                    <Icon icon="mdi:email" className="text-lg" />
                    {profile.email}
                  </a>
                  <a
                    href={`tel:${profile.phone}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-800 border border-emerald-200 shadow hover:border-emerald-400 transition-colors"
                  >
                    <Icon icon="mdi:phone" className="text-lg text-emerald-600" />
                    {profile.phone}
                  </a>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-700 border border-slate-200">
                    <Icon icon="mdi:map-marker" className="text-lg text-emerald-600" />
                    {profile.location}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 pt-3">
                  {profile.links.portfolio && (
                    <a
                      href={profile.links.portfolio}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon icon="mdi:web" className="text-lg" />
                      Portfolio
                    </a>
                  )}
                  {profile.links.linkedin && (
                    <a
                      href={profile.links.linkedin}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon icon="mdi:linkedin" className="text-lg" />
                      LinkedIn
                    </a>
                  )}
                  {profile.links.github && (
                    <a
                      href={profile.links.github}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon icon="mdi:github" className="text-lg" />
                      GitHub
                    </a>
                  )}
                </div>
              </div>

              <div className="w-full md:w-64 bg-white border border-emerald-100 rounded-2xl shadow-lg p-5 space-y-4">
                <h3 className="font-semibold text-slate-900">Highlights</h3>
                <ul className="space-y-3 text-slate-700">
                  {profile.highlights.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1 w-2 h-2 rounded-full bg-emerald-500" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2">
                <Icon icon="mdi:briefcase-outline" className="text-emerald-600 text-xl" />
                <h2 className="text-xl font-semibold text-slate-900">Experience</h2>
              </div>
              <div className="space-y-5">
                {profile.experience.map((job, index) => (
                  <div key={index} className="border border-slate-100 rounded-2xl p-4 bg-white/70 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{job.role}</p>
                        <p className="text-sm text-emerald-700 font-medium">{job.company}</p>
                      </div>
                      <span className="text-sm text-slate-600">{job.period}</span>
                    </div>
                    <p className="text-slate-700 mt-2 leading-relaxed">{job.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2">
                <Icon icon="mdi:star-outline" className="text-emerald-600 text-xl" />
                <h2 className="text-xl font-semibold text-slate-900">Skills</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-4">
                <Icon icon="mdi:school-outline" className="text-emerald-600 text-xl" />
                <h2 className="text-xl font-semibold text-slate-900">Education</h2>
              </div>
              <div className="space-y-4">
                {profile.education.map((edu, index) => (
                  <div key={index} className="border border-slate-100 rounded-2xl p-4 bg-white/70 shadow-sm">
                    <p className="text-lg font-semibold text-slate-900">{edu.school}</p>
                    <p className="text-sm text-emerald-700 font-medium">{edu.degree}</p>
                    <p className="text-sm text-slate-600">{edu.period}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
