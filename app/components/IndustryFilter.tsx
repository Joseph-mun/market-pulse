'use client';

import { INDUSTRIES } from '@/data/industry-map';

interface Props {
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export default function IndustryFilter({ selected, onSelect }: Props) {
  return (
    <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect(null)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            selected === null
              ? 'bg-[var(--accent-cyan)] text-black'
              : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border)]'
          }`}
        >
          전체
        </button>
        {INDUSTRIES.map((industry) => (
          <button
            key={industry.id}
            onClick={() => onSelect(industry.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              selected === industry.id
                ? 'bg-[var(--accent-cyan)] text-black'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border)]'
            }`}
          >
            {industry.icon} {industry.name}
          </button>
        ))}
      </div>
    </div>
  );
}
