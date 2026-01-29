"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Map, MapMarker, MarkerClusterer, ZoomControl, CustomOverlayMap } from "react-kakao-maps-sdk";
import { School } from "@/app/types";
import SearchBar from "./SearchBar";
import FilterPanel, { Filters } from "./FilterPanel";
import SchoolCard from "./SchoolCard";

const KOREA_CENTER = { lat: 37.5174083, lng: 126.9754667 };
const DEFAULT_LEVEL = 10;

export default function SchoolMap() {
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [center, setCenter] = useState(KOREA_CENTER);
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
    setCenter({ lat: school.latitude, lng: school.longitude });
    setLevel(4);
  }, []);

  const clusterStyles = [
    {
      width: "40px",
      height: "40px",
      background: "rgba(59, 130, 246, 0.8)",
      borderRadius: "20px",
      color: "#fff",
      textAlign: "center" as const,
      fontWeight: "bold",
      lineHeight: "40px",
      fontSize: "13px",
    },
    {
      width: "50px",
      height: "50px",
      background: "rgba(37, 99, 235, 0.8)",
      borderRadius: "25px",
      color: "#fff",
      textAlign: "center" as const,
      fontWeight: "bold",
      lineHeight: "50px",
      fontSize: "14px",
    },
    {
      width: "60px",
      height: "60px",
      background: "rgba(29, 78, 216, 0.85)",
      borderRadius: "30px",
      color: "#fff",
      textAlign: "center" as const,
      fontWeight: "bold",
      lineHeight: "60px",
      fontSize: "15px",
    },
  ];

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* 사이드바 */}
      <div
        className={`absolute left-0 top-0 z-10 h-full bg-white shadow-xl transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "320px" }}
      >
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <h1 className="mb-3 text-lg font-bold text-gray-900">
              HiMap
            </h1>
            <SearchBar schools={schools} onSelect={handleSelectSchool} />
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <FilterPanel
              filters={filters}
              regions={regions}
              onChange={setFilters}
            />
            <div className="mt-4 rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">
                표시 학교:{" "}
                <span className="font-semibold text-gray-900">
                  {filteredSchools.length}
                </span>
                개
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 사이드바 토글 버튼 */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`absolute top-4 z-20 rounded-r-lg bg-white px-2 py-3 shadow-md transition-all duration-300 ${
          sidebarOpen ? "left-[320px]" : "left-0"
        }`}
      >
        <span className="text-sm text-gray-600">
          {sidebarOpen ? "◀" : "▶"}
        </span>
      </button>

      {/* 카카오 지도 */}
      <Map
        center={center}
        isPanto
        level={level}
        style={{ width: "100%", height: "100%" }}
        onZoomChanged={(map) => setLevel(map.getLevel())}
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
            yAnchor={1.3}
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
