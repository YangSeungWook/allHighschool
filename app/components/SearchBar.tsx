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
    <div ref={ref} className="relative">
      <div className="relative">
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          placeholder="학교명, 주소 검색"
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-5 text-[12px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#2DB400] focus:bg-white focus:ring-1 focus:ring-[#2DB400]"
          onChange={(e) => {
            setQuery(e.target.value);
            search(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
      {open && results.length > 0 && (
        <ul className="sidebar-scroll absolute z-50 mt-1 max-h-80 w-full overflow-y-auto rounded-md border border-gray-100 bg-white shadow-lg">
          {results.map((school) => (
            <li
              key={school.id}
              className="cursor-pointer border-b border-gray-50 px-4 py-3.5 transition-colors hover:bg-gray-50"
              onClick={() => {
                onSelect(school);
                setQuery(school.name);
                setOpen(false);
              }}
            >
              <p className="text-[14px] font-medium text-gray-900">
                {school.name}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-gray-500">
                {school.address}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
