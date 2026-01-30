"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Map, MapMarker, MarkerClusterer, ZoomControl, CustomOverlayMap } from "react-kakao-maps-sdk";
import { School } from "@/app/types";
import SearchBar from "./SearchBar";
import FilterPanel, { Filters } from "./FilterPanel";
import SchoolCard from "./SchoolCard";

const KOREA_CENTER = { lat: 37.5174083, lng: 126.9754667 };
const DEFAULT_LEVEL = 5;

export default function SchoolMap() {
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);
  const [level, setLevel] = useState(DEFAULT_LEVEL);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    types: [],
    coed: [],
    establishment: [],
    region: "",
  });

  useEffect(() => {
    fetch("/api/schools")
      .then((res) => res.json())
      .then(setSchools);
  }, []);

  const regions = useMemo(() => {
    const set = new Set(schools.map((s) => s.region));
    return Array.from(set).sort();
  }, [schools]);

  const filteredSchools = useMemo(() => {
    return schools.filter((s) => {
      if (filters.types.length > 0 && !filters.types.includes(s.type))
        return false;
      if (filters.coed.length > 0 && !filters.coed.includes(s.coed))
        return false;
      if (
        filters.establishment.length > 0 &&
        !filters.establishment.includes(s.establishment)
      )
        return false;
      if (filters.region && s.region !== filters.region) return false;
      return true;
    });
  }, [schools, filters]);

  const handleSelectSchool = useCallback((school: School) => {
    setSelectedSchool(school);
    if (mapInstance) {
      mapInstance.setLevel(4);
      mapInstance.panTo(new kakao.maps.LatLng(school.latitude, school.longitude));
    }
  }, [mapInstance]);

  const clusterStyles = [
    {
      width: "36px",
      height: "36px",
      background: "rgba(46, 125, 50, 0.85)",
      borderRadius: "18px",
      color: "#fff",
      textAlign: "center" as const,
      fontWeight: "600",
      lineHeight: "36px",
      fontSize: "12px",
    },
    {
      width: "44px",
      height: "44px",
      background: "rgba(27, 94, 32, 0.85)",
      borderRadius: "22px",
      color: "#fff",
      textAlign: "center" as const,
      fontWeight: "600",
      lineHeight: "44px",
      fontSize: "13px",
    },
    {
      width: "52px",
      height: "52px",
      background: "rgba(21, 67, 23, 0.9)",
      borderRadius: "26px",
      color: "#fff",
      textAlign: "center" as const,
      fontWeight: "700",
      lineHeight: "52px",
      fontSize: "14px",
    },
  ];

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* 사이드바 */}
      <div
        className={`absolute left-0 top-0 z-10 flex h-full flex-col border-r border-gray-200 bg-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "340px" }}
      >
        {/* 로고 + 검색 영역 */}
        <div className="shrink-0 px-3 pt-3 pb-2">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2DB400]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h1 className="text-[17px] font-bold text-gray-900">HiMap</h1>
            <span className="text-[11px] text-gray-400">전국 고등학교 지도</span>
          </div>
          <SearchBar schools={schools} onSelect={handleSelectSchool} />
        </div>

        {/* 구분선 */}
        <div className="mx-6 border-t border-gray-100" />

        {/* 필터 영역 */}
        <div className="sidebar-scroll flex-1 overflow-y-auto px-3 py-2">
          <FilterPanel
            filters={filters}
            regions={regions}
            onChange={setFilters}
          />
        </div>

        {/* 하단 요약 */}
        <div className="shrink-0 border-t border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-gray-500">
              검색 결과
            </span>
            <span className="text-[14px] font-bold text-[#2DB400]">
              {filteredSchools.length}
              <span className="ml-0.5 font-normal text-gray-500">개교</span>
            </span>
          </div>
        </div>
      </div>

      {/* 사이드바 토글 버튼 */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`absolute top-1/2 z-20 -translate-y-1/2 flex h-12 w-5 items-center justify-center rounded-r-md bg-white shadow-[2px_0_6px_rgba(0,0,0,0.1)] transition-all duration-300 hover:bg-gray-50 ${
          sidebarOpen ? "left-[340px]" : "left-0"
        }`}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#666"
          strokeWidth="2.5"
          className={`transition-transform ${sidebarOpen ? "" : "rotate-180"}`}
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* 카카오 지도 */}
      <Map
        center={KOREA_CENTER}
        level={level}
        style={{ width: "100%", height: "100%" }}
        onCreate={setMapInstance}
        onZoomChanged={(map) => setLevel(map.getLevel())}
        onClick={() => setSelectedSchool(null)}
      >
        <ZoomControl position="RIGHT" />
        <MarkerClusterer
          averageCenter
          minLevel={10}
          gridSize={80}
          styles={clusterStyles}
          calculator={[10, 50, 100]}
        >
          {filteredSchools.map((school) => (
            <MapMarker
              key={school.id}
              position={{ lat: school.latitude, lng: school.longitude }}
              onClick={() => handleSelectSchool(school)}
            />
          ))}
        </MarkerClusterer>

        {selectedSchool && (
          <CustomOverlayMap
            position={{
              lat: selectedSchool.latitude,
              lng: selectedSchool.longitude,
            }}
            yAnchor={1.4}
          >
            <SchoolCard
              school={selectedSchool}
              onClose={() => setSelectedSchool(null)}
            />
          </CustomOverlayMap>
        )}
      </Map>
    </div>
  );
}
