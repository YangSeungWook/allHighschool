"use client";

import { School } from "@/app/types";

interface SchoolCardProps {
  school: School;
  onClose: () => void;
}

const typeStyle: Record<string, string> = {
  일반고: "bg-[#E8F5E9] text-[#2E7D32]",
  특성화고: "bg-[#FFF3E0] text-[#E65100]",
  특목고: "bg-[#E3F2FD] text-[#1565C0]",
  자율고: "bg-[#F3E5F5] text-[#7B1FA2]",
};

const coedLabel: Record<string, string> = {
  남여공학: "공학",
  남: "남학교",
  여: "여학교",
};

export default function SchoolCard({ school, onClose }: SchoolCardProps) {
  return (
    <div
      className="popup-arrow w-[300px] overflow-hidden rounded-lg bg-white shadow-[0_2px_12px_rgba(0,0,0,0.12)]"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
        <h3 className="text-[15px] font-bold text-gray-900">{school.name}</h3>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* 본문 */}
      <div className="px-5 py-4">
        {/* 태그 */}
        <div className="mb-3.5 flex flex-wrap gap-1.5">
          <span
            className={`rounded-[3px] px-2 py-[3px] text-[12px] font-semibold ${typeStyle[school.type] ?? "bg-gray-100 text-gray-700"}`}
          >
            {school.type}
          </span>
          <span className="rounded-[3px] bg-gray-100 px-2 py-[3px] text-[12px] font-medium text-gray-600">
            {school.establishment}
          </span>
          <span className="rounded-[3px] bg-gray-100 px-2 py-[3px] text-[12px] font-medium text-gray-600">
            {coedLabel[school.coed] ?? school.coed}
          </span>
        </div>

        {/* 주소 */}
        <div className="mb-2 flex items-start gap-2">
          <svg className="mt-0.5 shrink-0 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <p className="text-[13px] leading-[1.5] text-gray-600">{school.address}</p>
        </div>

        {/* 전화 */}
        <div className="mb-3.5 flex items-center gap-2">
          <svg className="shrink-0 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <p className="text-[13px] text-gray-600">{school.phone}</p>
        </div>

        {/* 홈페이지 링크 */}
        {school.website && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              window.open(school.website, "_blank", "noopener,noreferrer");
            }}
            className="inline-flex cursor-pointer items-center gap-1.5 border-none bg-transparent p-0 text-[13px] font-medium text-[#2DB400] transition-colors hover:text-[#249900]"
          >
            홈페이지
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
