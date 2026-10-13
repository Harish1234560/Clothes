import { useState, type FormEvent } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import Field, { isEmail } from '../components/Field';
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from '../components/Icons';
import PageShell from '../components/PageShell';

export default function ContactPage() {
  const [f, setF] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (f.name.trim().length < 2) er.name = 'Enter your name';
    if (!isEmail(f.email)) er.email = 'Enter a valid email';
    if (f.subject.trim().length < 3) er.subject = 'Enter a subject';
    if (f.message.trim().length < 10) er.message = 'Write at least 10 characters';
    setErrors(er);
    if (Object.keys(er).length) return;
    setSent(true);
    setF({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <PageShell
      title="Contact Us | Customer Care | STORE Menswear"
      description="Have questions about orders, sizing, delivery, or returns? Contact the STORE team. We usually reply within one business day."
    >
      <div className="st-wrap">
        <Breadcrumbs items={[{ label: 'Contact' }]} />
        <h1 className="st-title">Get in touch<small>Questions about an order, a fit or a product? We usually reply within one business day.</small></h1>
        <div className="st-contact">
          <form className="st-form st-box" onSubmit={submit} noValidate>
            {sent && <div className="st-alert good" role="status">Thanks, your message has been sent. We will reply soon.</div>}
            {Object.keys(errors).length > 0 && !sent && (
              <div className="st-alert bad" role="alert">Please resolve the highlighted fields before sending your message.</div>
            )}
            <div className="st-two">
              <Field id="cname" label="Name" value={f.name} onChange={set('name')} error={errors.name} autoComplete="name" />
              <Field id="cemail" label="Email" type="email" value={f.email} onChange={set('email')} error={errors.email} autoComplete="email" />
            </div>
            <Field id="csubject" label="Subject" value={f.subject} onChange={set('subject')} error={errors.subject} />
            <Field id="cmessage" label="Message" textarea value={f.message} onChange={set('message')} error={errors.message} />
            <button type="submit" className="st-btn primary">Send message</button>
          </form>
          <aside className="st-box st-info">
            <div>
              <MailIcon size={22} />
              <p style={{ margin: 0 }}>
                <strong>Email</strong>
                <a href="mailto:support@store.com" style={{ color: 'var(--st-accent)', textDecoration: 'none' }}>
                  support@store.com
                </a>
              </p>
            </div>
            <div>
              <PhoneIcon size={22} />
              <p style={{ margin: 0 }}>
                <strong>Phone</strong>
                <a href="tel:+18005550199" style={{ color: 'var(--st-accent)', textDecoration: 'none' }}>
                  +1 (800) 555-0199
                </a>
              </p>
            </div>
            <div>
              <PinIcon size={22} />
              <p style={{ margin: 0 }}>
                <strong>Showroom & Flagship</strong>
                <span>42 Connaught Place, New Delhi, 110001</span>
              </p>
            </div>
            <div>
              <ClockIcon size={22} />
              <p style={{ margin: 0 }}>
                <strong>Hours</strong>
                <span>Mon–Fri, 9am–6pm IST</span>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
