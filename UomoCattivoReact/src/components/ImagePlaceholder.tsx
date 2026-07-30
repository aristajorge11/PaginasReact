import { useState } from 'react';

type ImagePlaceholderProps = {
  label: string;
  className?: string;
};

export const ImagePlaceholder = ({ label, className = '' }: ImagePlaceholderProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-[1.2rem] border border-black/10 bg-[#F7F3EC] ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-black/5" />
      <div
        className={`absolute inset-0 transition-all duration-300 ${isHovered ? 'scale-105 bg-[#EDE3D7]' : 'bg-[#F7F3EC]'}`}
      />
      <div className="relative flex h-full items-center justify-center p-6">
        <div className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-black/70">
          {isHovered ? 'Vista previa' : label}
        </div>
      </div>
    </div>
  );
};
