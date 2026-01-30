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

const coedLabel: Record<string, string> = {
  남여공학: "공학",
  남: "남학교",
  여: "여학교",
};

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
      className={`rounded-[5px] border px-3.5 py-[7px] text-[13px] font-medium transition-all ${
        active
          ? "border-[#2DB400] bg-[#2DB400] text-white"
          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
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

  const hasActiveFilters =
    filters.types.length > 0 ||
    filters.coed.length > 0 ||
    filters.establishment.length > 0 ||
    filters.region !== "";

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="mb-2.5 text-[12px] font-semibold tracking-wide text-gray-400">
          학교 유형
        </p>
        <div className="flex flex-wrap gap-2">
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

      <div className="border-t border-gray-100 pt-5">
        <p className="mb-2.5 text-[12px] font-semibold tracking-wide text-gray-400">
          남녀 구분
        </p>
        <div className="flex flex-wrap gap-2">
          {COED_OPTIONS.map((c) => (
            <ToggleChip
              key={c}
              label={coedLabel[c]}
              active={filters.coed.includes(c)}
              onClick={() => toggle("coed", c)}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-5">
        <p className="mb-2.5 text-[12px] font-semibold tracking-wide text-gray-400">
          설립 구분
        </p>
        <div className="flex flex-wrap gap-2">
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

      <div className="border-t border-gray-100 pt-5">
        <p className="mb-2.5 text-[12px] font-semibold tracking-wide text-gray-400">
          지역
        </p>
        <select
          value={filters.region}
          onChange={(e) => onChange({ ...filters, region: e.target.value })}
          className="w-full appearance-none rounded-[5px] border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] text-gray-700 outline-none transition-colors focus:border-[#2DB400]"
        >
          <option value="">전체 지역</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          onClick={() =>
            onChange({ types: [], coed: [], establishment: [], region: "" })
          }
          className="mt-2 text-[13px] text-gray-400 underline underline-offset-2 transition-colors hover:text-gray-600"
        >
          필터 초기화
        </button>
      )}
    </div>
  );
}
