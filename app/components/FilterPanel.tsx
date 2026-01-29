"use client";

export interface Filters {
  types: string[];
  coed: string[];
  establishment: string[];
  region: string;
}

interface FilterPanelProps {
  filters: Filters;
  regions: string[];
  onChange: (filters: Filters) => void;
}

const SCHOOL_TYPES = ["일반고", "특성화고", "특목고", "자율고"];
const COED_OPTIONS = ["남여공학", "남", "여"];
const ESTABLISHMENT_OPTIONS = ["공립", "사립"];

function ToggleChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-blue-500 bg-blue-500 text-white"
          : "border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}

export default function FilterPanel({
  filters,
  regions,
  onChange,
}: FilterPanelProps) {
  const toggle = (key: "types" | "coed" | "establishment", value: string) => {
    const current = filters[key];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="mb-1.5 text-xs font-semibold text-gray-500">학교 유형</p>
        <div className="flex flex-wrap gap-1.5">
          {SCHOOL_TYPES.map((t) => (
            <ToggleChip
              key={t}
              label={t}
              active={filters.types.includes(t)}
              onClick={() => toggle("types", t)}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-xs font-semibold text-gray-500">
          남녀공학 구분
        </p>
        <div className="flex flex-wrap gap-1.5">
          {COED_OPTIONS.map((c) => (
            <ToggleChip
              key={c}
              label={c === "남여공학" ? "공학" : c === "남" ? "남학교" : "여학교"}
              active={filters.coed.includes(c)}
              onClick={() => toggle("coed", c)}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-xs font-semibold text-gray-500">설립 구분</p>
        <div className="flex flex-wrap gap-1.5">
          {ESTABLISHMENT_OPTIONS.map((e) => (
            <ToggleChip
              key={e}
              label={e}
              active={filters.establishment.includes(e)}
              onClick={() => toggle("establishment", e)}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-xs font-semibold text-gray-500">지역</p>
        <select
          value={filters.region}
          onChange={(e) => onChange({ ...filters, region: e.target.value })}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
        >
          <option value="">전체 지역</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
