import type { ReactNode, SVGProps } from 'react';

type P = { size?: number } & Omit<SVGProps<SVGSVGElement>, 'width' | 'height'>;

const S = ({ size = 20, children, ...rest }: P & { children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
    {children}
  </svg>
);

const mk = (d: ReactNode) => (p: P) => <S {...p}>{d}</S>;

export const ArrowIcon = mk(<path d="M5 12h14M13 6l6 6-6 6" />);
export const ArrowUpRightIcon = mk(<path d="M7 17 17 7M8 7h9v9" />);
export const CheckIcon = mk(<path d="M5 12.5l4.5 4.5L19 7.5" />);
export const PlusIcon = mk(<path d="M12 5v14M5 12h14" />);
export const MinusIcon = mk(<path d="M5 12h14" />);
export const CloseIcon = mk(<path d="M6 6l12 12M18 6 6 18" />);
export const TrashIcon = mk(<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />);
export const ChevronIcon = mk(<path d="M6 9l6 6 6-6" />);
export const FilterIcon = mk(<path d="M4 6h16M7 12h10M10 18h4" />);
export const ReturnIcon = mk(<path d="M4 12a8 8 0 1 0 3-6.2M4 4v4h4" />);
export const HomeIcon = mk(<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />);
export const LinkIcon = mk(<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />);
export const MailIcon = mk(<path d="M3 6h18v12H3zM3 7l9 7 9-7" />);
export const PhoneIcon = mk(<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />);
export const ClockIcon = mk(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>);
export const PinIcon = mk(<><path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>);
export const SearchIcon = mk(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>);
export const TruckIcon = mk(<><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></>);
export const ShieldIcon = mk(<><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="m9 12 2 2 4-4" /></>);
export const AwardIcon = mk(<><circle cx="12" cy="9" r="5.5" /><path d="M8.5 14 7 21l5-3 5 3-1.5-7" /></>);
export const HangerIcon = mk(<><path d="M12 7a2 2 0 1 1 2 2c-1 .5-2 1-2 2v1" /><path d="M12 12 3.5 17.5A1.4 1.4 0 0 0 4.3 20h15.4a1.4 1.4 0 0 0 .8-2.5z" /></>);
export const BagIcon = mk(<><path d="M6 7h12l1 13H5z" /><path d="M9 7a3 3 0 0 1 6 0" /></>);
export const BagPlusIcon = mk(<><path d="M6 7h12l1 13H5z" /><path d="M9 7a3 3 0 0 1 6 0M12 11v6M9 14h6" /></>);
export const EyeIcon = ({ off, ...p }: P & { off?: boolean }) => (
  <S {...p}>
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M4 4l16 16" />}
  </S>
);
export const HeartIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <S {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M20.8 5.6a5.2 5.2 0 0 0-7.4 0L12 7l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4L12 21.8l8.8-8.8a5.2 5.2 0 0 0 0-7.4z" />
  </S>
);
export const StarIcon = ({ filled = true, ...p }: P & { filled?: boolean }) => (
  <S {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 2.6l2.9 6.3 6.7.7-5 4.6 1.4 6.7-6-3.4-6 3.4 1.4-6.7-5-4.6 6.7-.7z" />
  </S>
);
