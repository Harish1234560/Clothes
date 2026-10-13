export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  textarea?: boolean;
};

export default function Field({ id, label, value, onChange, error, type = 'text', placeholder, autoComplete, textarea }: Props) {
  return (
    <div className={`st-field${error ? ' err' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {textarea ? (
        <textarea id={id} className="st-input" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} className="st-input" type={type} value={value} placeholder={placeholder} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} />
      )}
      {error && <small className="st-err">{error}</small>}
    </div>
  );
}
