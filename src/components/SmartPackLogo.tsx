import React from 'react';

interface Props {
  className?: string;
  variant?: 'full' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  alt?: string;
}

const LOGO_SRC = '/assets/aistudio/logo-smartpack_40451c04.svg';

export const SmartPackLogo: React.FC<Props> = ({
  className = '',
  variant = 'full',
  size = 'md',
  alt = 'SmartPack',
}) => {
  if (variant === 'icon-only') {
    return (
      <div
        className={`w-11 h-8 overflow-hidden inline-flex items-center shrink-0 ${className}`}
      >
        <img
          src={LOGO_SRC}
          alt={alt}
          className="h-20 w-auto max-w-none -ml-[15px] select-none"
          loading="eager"
        />
      </div>
    );
  }

  const sizeConfig = {
    sm: {
      container: 'h-7',
      img: 'h-14 -ml-2',
    },
    md: {
      container: 'h-8',
      img: 'h-15 -ml-2',
    },
    lg: {
      container: 'h-10 md:h-11',
      img: 'h-20 md:h-24 -ml-3',
    },
  }[size];

  return (
    <div
      className={`${sizeConfig.container} overflow-hidden inline-flex items-center shrink-0 ${className}`}
    >
      <img
        src={LOGO_SRC}
        alt={alt}
        className={`${sizeConfig.img} w-auto max-w-none select-none`}
        loading="eager"
      />
    </div>
  );
};
