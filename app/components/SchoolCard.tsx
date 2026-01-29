"use client";

import { School } from "@/app/types";

interface SchoolCardProps {
  school: School;
  onClose: () => void;
}

const typeColor: Record<string, string> = {
  일반고: "bg-blue-100 text-blue-800",
  특성화고: "bg-green-100 text-green-800",
  특목고: "bg-purple-100 text-purple-800",
  자율고: "bg-orange-100 text-orange-800",
};

const coedLabel: Record<string, string> = {
  남여공학: "공학",
  남: "남학교",
  여: "여학교",
};

export default function SchoolCard({ school, onClose }: SchoolCardProps) {
  return (
    <div className="w-72 rounded-lg bg-white p-4 shadow-lg">
      <div className="mb-2 flex items-start justify-between">
        <h3 className="text-base font-semibold text-gray-900">{school.name}</h3>
        <button
          onClick={onClose}
          className="ml-2 shrink-0 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        <span
          className={`rounded px-2 py-0.5 text-xs font-medium ${typeColor[school.type] ?? "bg-gray-100 text-gray-800"}`}
        >
          {school.type}
        </span>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
          {school.establishment}
        </span>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
          {coedLabel[school.coed] ?? school.coed}
        </span>
      </div>
      <p className="mb-1 text-xs text-gray-500">{school.address}</p>
      <p className="mb-3 text-xs text-gray-500">{school.phone}</p>
      {school.website && (
        <a
          href={school.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline"
        >
          홈페이지 방문 →
        </a>
      )}
    </div>
  );
}
