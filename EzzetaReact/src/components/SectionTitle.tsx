type SectionTitleProps = {
  eyebrow: string;
  title: string;
  align?: 'left' | 'center';
  className?: string;
};

export const SectionTitle = ({ eyebrow, title, align = 'left', className = '' }: SectionTitleProps) => {
  return (
    <div className={`${align === 'center' ? 'text-center' : 'text-left'} ${className}`}>
      <p className="text-sm uppercase tracking-[0.3em] text-black/60">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold uppercase tracking-[0.2em] text-black">{title}</h2>
    </div>
  );
};
