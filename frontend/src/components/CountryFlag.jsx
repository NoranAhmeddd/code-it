import React from 'react';
import { getCountryCode } from '../data/countries';

export default function CountryFlag({ country, className = 'w-5 h-3.5' }) {
  const code = getCountryCode(country);

  if (!code || code === 'intl') {
    return (
      <span className="inline-flex items-center justify-center text-sm leading-none shrink-0" title={country || 'International'}>
        🌐
      </span>
    );
  }

  return (
    <span className="inline-flex items-center shrink-0 align-middle">
      <img
        src={`https://flagcdn.com/w40/${code}.png`}
        srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
        alt={country || 'flag'}
        className={`${className} object-cover rounded-xs shadow-xs border border-slate-700/60 inline-block align-middle`}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </span>
  );
}

export { CountryFlag };
