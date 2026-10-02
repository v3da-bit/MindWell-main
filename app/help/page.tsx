export default function HelpPage() {
  return (
    <div
      role="document"
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #0b1220 60%, #1a237e 100%)',
        boxShadow: '0 4px 24px 0 rgba(11,18,32,0.25), 0 1.5px 6px 0 rgba(26,35,126,0.15)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <main
        className="mx-auto max-w-3xl px-4 py-10"
        style={{
          background: 'rgba(20, 30, 60, 0.88)',
          borderRadius: '1rem',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(6px)',
        }}
        aria-labelledby="help-heading"
      >
        <h1 id="help-heading" className="text-3xl font-semibold tracking-tight text-white">
          Help & Support
        </h1>
        <p className="mt-3 text-white/80">
          We&apos;re here to help. Reach out anytime for counseling, peer support, or account assistance.
        </p>

        {/* Emergency */}
        <section className="mt-8 rounded-lg p-5" aria-labelledby="emergency-heading" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 id="emergency-heading" className="text-xl font-semibold text-white">Emergency</h2>
          <p className="mt-2 text-white/90">
            If you or someone else is in immediate danger, call your local emergency number right away.
          </p>
          <ul className="mt-3 list-disc pl-5 text-white/90">
            <li>US/Canada: 911</li>
            <li>UK: 999 or 112</li>
            <li>EU: 112</li>
            <li>India: 112</li>
          </ul>
          <p className="mt-3 text-sm text-white/70">
            Crisis resources may vary by region—use local services where available.
          </p>
        </section>

        {/* Contact options */}
        <section className="mt-8 grid gap-6 md:grid-cols-2" aria-label="Contact options">
          <div className="rounded-lg p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-lg font-semibold text-white">Counseling Services</h3>
            <p className="mt-1 text-white/80">Confidential appointments with licensed counselors.</p>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="font-medium text-white">Email: </span>
                <a className="text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline" href="mailto:counseling@example.edu">
                  counseling@example.edu
                </a>
              </li>
              <li>
                <span className="font-medium text-white">Phone: </span>
                <a className="text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline" href="tel:+15551234567">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="text-white/70">Hours: Mon–Fri, 9am–5pm (local time)</li>
            </ul>
          </div>

          <div className="rounded-lg p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-lg font-semibold text-white">Immediate Support Line</h3>
            <p className="mt-1 text-white/80">Urgent, confidential support when needing to talk now.</p>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="font-medium text-white">Phone: </span>
                <a className="text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline" href="tel:+15557654321">
                  +1 (555) 765-4321
                </a>
              </li>
              <li className="text-sm text-white/70">
                For emergencies, use your local emergency number instead of this line.
              </li>
            </ul>
          </div>

          <div className="rounded-lg p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-lg font-semibold text-white">Peer Support</h3>
            <p className="mt-1 text-white/80">Student-led, non-clinical support and community.</p>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="font-medium text-white">Email: </span>
                <a className="text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline" href="mailto:peers@example.edu">
                  peers@example.edu
                </a>
              </li>
              <li className="text-white/80">Community groups and events</li>
            </ul>
          </div>

          <div className="rounded-lg p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-lg font-semibold text-white">App & Account Support</h3>
            <p className="mt-1 text-white/80">Help with login, bookings, or technical issues.</p>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="font-medium text-white">Email: </span>
                <a className="text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline" href="mailto:support@mindwell.app">
                  support@mindwell.app
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* Booking help */}
        <section className="mt-8 rounded-lg p-5" aria-labelledby="bookings-heading" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 id="bookings-heading" className="text-xl font-semibold text-white">Bookings</h2>
          <ul className="mt-3 list-disc pl-5 text-white/90">
            <li>To change or cancel a booking, reply to the confirmation email or contact counseling services.</li>
            <li>Please include name, appointment time, and preferred new time if rescheduling.</li>
            <li>Same-day changes may be limited during peak hours.</li>
          </ul>
        </section>

        {/* Privacy and safety */}
        <section className="mt-8 rounded-lg p-5" aria-labelledby="privacy-heading" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 id="privacy-heading" className="text-xl font-semibold text-white">Privacy & Safety</h2>
          <ul className="mt-3 list-disc pl-5 text-white/90">
            <li>Your AI chats are private and not shared with counseling staff unless explicit permission is given or required by law for safety concerns.</li>
            <li>For safety concerns or imminent risk, seek immediate help through emergency services or the immediate support line.</li>
            <li>We protect personal data using industry-standard security controls and strict access policies.</li>
          </ul>
          <details className="mt-3">
            <summary className="cursor-pointer font-medium text-white">Is my data private?</summary>
            <p className="mt-2 text-white/80">
                We’re here to help. Reach out anytime for counseling, peer support, or account assistance.
            </p>
          </details>
        </section>

        {/* FAQs */}
        <section className="mt-8 rounded-lg p-5" aria-labelledby="faqs-heading" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 id="faqs-heading" className="text-xl font-semibold text-white">FAQs</h2>
          <div className="mt-3 space-y-4">
            <div>
              <h4 className="font-medium text-white">Who sees my messages?</h4>
              <p className="text-white/80">
                AI chats are private by default and not visible to counselors or peers, except when sharing is requested or required to address safety risks.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white">How quickly will someone respond?</h4>
              <p className="text-white/80">
                Counseling responses are during business hours; urgent support is available via the Immediate Support Line listed above.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white">What should I include when asking for help?</h4>
              <p className="text-white/80">
                A brief description of the issue, relevant screenshots if applicable, and contact information help resolve requests faster.
              </p>
            </div>
          </div>
        </section>

        {/* Footer note */}
        <p className="mt-8 text-sm text-white/70">
          This page is for information only and is not a substitute for professional or emergency care.
        </p>
      </main>
    </div>
  );
}
