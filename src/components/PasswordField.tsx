import { useState } from 'react';
import { EyeIcon } from './Icons';

type Props = { id: string; label: string; value: string; onChange: (v: string) => void; error?: string; autoComplete?: string; placeholder?: string };

export default function PasswordField({ id, label, value, onChange, error, autoComplete, placeholder }: Props) {
  const [show, setShow] = useState(false);
  return (
    <div className={`st-field${error ? ' err' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <div className="st-pw">
        <input id={id} className="st-input" type={show ? 'text' : 'password'} value={value} autoComplete={autoComplete} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
          <EyeIcon size={18} off={show} />
        </button>
      </div>
      {error && <small className="st-err">{error}</small>}
    </div>
  );
}
