// ResourceRecommendations Next.js page
'use client';
import React from 'react';

export default function ResourceRecommendations() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h2 className="text-white font-medium mb-3">Resource Recommendations</h2>
      <p className="text-white/80 mb-2">Curated mental health resources for you:</p>
      <ul className="list-disc pl-5 text-white/70">
        <li><a href="https://www.mind.org.uk/" target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:underline">Mind UK</a></li>
        <li><a href="https://www.nimh.nih.gov/" target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:underline">NIMH</a></li>
        <li><a href="https://www.samaritans.org/" target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:underline">Samaritans</a></li>
        <li><a href="https://www.headspace.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:underline">Headspace</a></li>
      </ul>
    </div>
  );
}
