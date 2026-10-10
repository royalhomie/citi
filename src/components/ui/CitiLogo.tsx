interface CitiLogoProps {
  size?: number;
  className?: string;
  variant?: 'light' | 'dark';
}

export default function CitiLogo({ size = 40, className = '', variant = 'dark' }: CitiLogoProps) {
  const textColor = variant === 'light' ? '#fff' : '#06122e';
  const arcColor = '#ff6a00';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" rx="22" fill={variant === 'light' ? '#06122e' : '#fff'} />
      {/* Citi arc — the signature orange arc over the letter */}
      <path
        d="M30 32 Q50 16 70 32"
        stroke={arcColor}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Stylized "C" */}
      <text
        x="50"
        y="72"
        textAnchor="middle"
        fontSize="44"
        fontWeight="800"
        fontFamily="Inter, Arial, sans-serif"
        fill={textColor}
      >
        C
      </text>
    </svg>
  );
}
