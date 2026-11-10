import React, { useState } from 'react';

interface Props {
  className?: string;
  variant?: 'full' | 'icon-only';
  alt?: string;
}

export const SmartPackLogo: React.FC<Props> = ({
  className = 'h-8 w-auto object-contain',
  variant = 'full',
  alt = 'SmartPack Manager Logo',
}) => {
  const [hasError, setHasError] = useState(false);
  const primaryUrl =
    'https://lh3.googleusercontent.com/aida/ALJJyrAl7Gi6UBkTcvCxcrVQQItYL3IIWvWKzEv3D9AvBsRYHltZRxP9G2N424f4D0O7JdZioBYexQ2YpG_Z1chnZHpZEWFO0G109t8gUJB68-qnSFFexP40kGgpIMQ9NsVpQcbnPxMTSNHO7z3Un-4PxAtS2c4Fi-3vmBtfwZdtbPebGyAPXZc2dUFatJieCi4ixG2pcERwb6iVLbwq7Cl-zWVzgvJKT-wU5kBY7clpFQQ';

  if (hasError) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#006a61] text-white flex items-center justify-center font-bold text-sm shadow-sm">
          <span className="material-symbols-outlined text-[20px]">package_2</span>
        </div>
        {variant === 'full' && (
          <div className="flex flex-col">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0b1c30] leading-none tracking-tight">
              SmartPack
            </span>
            <span className="font-['Inter'] font-semibold text-[10px] text-[#45464d] uppercase tracking-wider">
              Manager IoT
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <img
      alt={alt}
      className={className}
      src={primaryUrl}
      onError={() => setHasError(true)}
      loading="eager"
    />
  );
};
