"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { School } from "@/app/types";

interface SearchBarProps {
  schools: School[];
  onSelect: (school: School) => void;
}

export default function SearchBar({ schools, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<School[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const search = useCallback(
    (q: string) => {
      if (q.length === 0) {
        setResults([]);
        return;
      }
      const lower = q.toLowerCase();
      const matched = schools
        .filter(
          (s) =>
            s.name.toLowerCase().includes(lower) ||
            s.address.toLowerCase().includes(lower) ||
            s.region.toLowerCase().includes(lower),
        )
        .slice(0, 20);
      setResults(matched);
    },
    [schools],
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <input
        type="text"
        value={query}
        placeholder="학교명 또는 지역으로 검색..."
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        onChange={(e) => {
          setQuery(e.target.value);
          search(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (results.length > 0) setOpen(true);
        }}
      />
      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {results.map((school) => (
            <li
              key={school.id}
              className="cursor-pointer px-4 py-2.5 text-sm hover:bg-blue-50"
              onClick={() => {
                onSelect(school);
                setQuery(school.name);
                setOpen(false);
              }}
            >
              <p className="font-medium text-gray-900">{school.name}</p>
              <p className="text-xs text-gray-500">
                {school.address} · {school.type}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
