'use client';

import { useState } from 'react';

interface Coach {
  id: string;
  name: string;
  roleTitle: string;
  photo?: string;
  education: string[];
  experiences: string[];
  certifications: string[];
  specialties: string[];
}

export default function CoachCard({ coach }: { coach: Coach }) {
  const [imageError, setImageError] = useState(false);

  return (
    <article
      className="flex-shrink-0 w-[320px] sm:w-[360px] bg-white rounded-2xl overflow-hidden shadow-lg border border-navy-700/15 snap-start"
    >
      {/* Photo */}
      <div className="h-56 sm:h-64 bg-gradient-to-br from-navy-700 to-navy-700/80 flex items-center justify-center relative overflow-hidden">
        {coach.photo && !imageError ? (
          <img
            src={coach.photo}
            alt={`${coach.name} 教練`}
            className="w-full h-full object-cover object-top"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="font-serif text-6xl sm:text-7xl font-black text-white/25 absolute">
            {coach.name.charAt(0)}
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-navy-700/80 to-transparent" />
        {/* Name overlay on photo */}
        <div className="absolute bottom-3 left-4 right-4">
          <div className="font-serif text-xl font-bold text-white">{coach.name} 教練</div>
          <div className="text-sm text-orange-300 font-medium">{coach.roleTitle}</div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* 學歷 */}
        {coach.education && coach.education.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-navy-700 mb-1.5">
              <svg className="w-4 h-4 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              學歷
            </div>
            <ul className="text-sm text-ink/70 space-y-0.5">
              {coach.education.map((edu, i) => (
                <li key={i} className="leading-relaxed">{edu}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 經歷 */}
        {coach.experiences && coach.experiences.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-navy-700 mb-1.5">
              <svg className="w-4 h-4 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              經歷
            </div>
            <ul className="text-sm text-ink/70 space-y-0.5">
              {coach.experiences.map((exp, i) => (
                <li key={i} className="leading-relaxed">{exp}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 證照與研習 */}
        {coach.certifications && coach.certifications.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-navy-700 mb-1.5">
              <svg className="w-4 h-4 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              證照與研習
            </div>
            <div className="flex flex-wrap gap-1.5">
              {coach.certifications.map((cert, i) => (
                <span key={i} className="text-xs text-navy-700 bg-navy-700/[0.06] px-2 py-0.5 rounded">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 專長 */}
        {coach.specialties && coach.specialties.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-navy-700 mb-1.5">
              <svg className="w-4 h-4 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              專長
            </div>
            <div className="flex flex-wrap gap-1.5">
              {coach.specialties.map((spec, i) => (
                <span key={i} className="text-xs font-medium text-white bg-orange px-2.5 py-1 rounded-full">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
