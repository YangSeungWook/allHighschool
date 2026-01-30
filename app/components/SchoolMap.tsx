"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Map, MapMarker, MarkerClusterer, ZoomControl, CustomOverlayMap, Roadview, RoadviewMarker } from "react-kakao-maps-sdk";
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
  const [roadviewActive, setRoadviewActive] = useState(false);
  const [roadviewPosition, setRoadviewPosition] = useState<{ lat: number; lng: number }>(KOREA_CENTER);
  const [roadviewError, setRoadviewError] = useState(false);
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
    if (roadviewActive) {
      setRoadviewPosition({ lat: school.latitude, lng: school.longitude });
      setRoadviewError(false);
    }
  }, [mapInstance, roadviewActive]);

  const toggleRoadview = useCallback(() => {
    setRoadviewActive((prev) => {
      const next = !prev;
      if (next && mapInstance) {
        const center = mapInstance.getCenter();
        setRoadviewPosition({ lat: center.getLat(), lng: center.getLng() });
        setRoadviewError(false);
      }
      if (mapInstance) {
        setTimeout(() => mapInstance.relayout(), 320);
      }
      return next;
    });
  }, [mapInstance]);

  const handleMapClickForRoadview = useCallback((_: kakao.maps.Map, mouseEvent: kakao.maps.event.MouseEvent) => {
    if (roadviewActive && mouseEvent.latLng) {
      setRoadviewPosition({
        lat: mouseEvent.latLng.getLat(),
        lng: mouseEvent.latLng.getLng(),
      });
      setRoadviewError(false);
    }
  }, [roadviewActive]);

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
        style={{ width: "280px" }}
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
        className={`absolute top-1/2 z-20 -translate-y-1/2 flex h-12 w-5 cursor-pointer items-center justify-center rounded-r-md bg-gray-500 shadow-[2px_0_6px_rgba(0,0,0,0.1)] transition-all duration-300  ${
          sidebarOpen ? "left-[280px]" : "left-0"
        }`}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.5"
          className={`transition-transform ${sidebarOpen ? "" : "rotate-180"}`}
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* 지도 + 로드뷰 영역 */}
      <div className="flex h-full w-full">
        {/* 카카오 지도 */}
        <div className={`relative transition-all duration-300 ${roadviewActive ? "w-1/2" : "w-full"}`}>
          <Map
            center={KOREA_CENTER}
            level={level}
            style={{ width: "100%", height: "100%" }}
            onCreate={setMapInstance}
            onZoomChanged={(map) => setLevel(map.getLevel())}
            onClick={(map, mouseEvent) => {
              setSelectedSchool(null);
              handleMapClickForRoadview(map, mouseEvent);
            }}
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

            {roadviewActive && (
              <MapMarker
                position={roadviewPosition}
                image={{
                  src: "https://t1.daumcdn.net/localimg/localimages/07/2018/pc/roadview_minimap_wk_2018.png",
                  size: { width: 26, height: 46 },
                  options: {
                    spriteSize: { width: 1666, height: 168 },
                    spriteOrigin: { x: 705, y: 114 },
                    offset: { x: 13, y: 46 },
                  },
                }}
                draggable
                onDragEnd={(marker) => {
                  const pos = marker.getPosition();
                  setRoadviewPosition({ lat: pos.getLat(), lng: pos.getLng() });
                  setRoadviewError(false);
                }}
              />
            )}
          </Map>

          {/* 로드뷰 토글 버튼 */}
          <button
            onClick={toggleRoadview}
            className={`absolute bottom-8 right-3 z-10 flex h-9 items-center gap-1.5 rounded-md px-3 shadow-[0_1px_4px_rgba(0,0,0,0.15)] transition-colors ${
              roadviewActive
                ? "bg-[#2DB400] text-white hover:bg-[#249900]"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
            </svg>
            <span className="text-[13px] font-medium">로드뷰</span>
          </button>
        </div>

        {/* 로드뷰 */}
        {roadviewActive && (
          <div className="relative w-1/2 border-l border-gray-300">
            {roadviewError ? (
              <div className="flex h-full flex-col items-center justify-center bg-gray-50">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="mt-3 text-[14px] text-gray-500">
                  이 위치의 로드뷰를 사용할 수 없습니다.
                </p>
                <p className="mt-1 text-[12px] text-gray-400">
                  지도를 클릭하거나 마커를 드래그하여 위치를 변경해보세요.
                </p>
              </div>
            ) : (
              <Roadview
                position={{
                  lat: roadviewPosition.lat,
                  lng: roadviewPosition.lng,
                  radius: 50,
                }}
                style={{ width: "100%", height: "100%" }}
                onPositionChanged={(rv) => {
                  const pos = rv.getPosition();
                  setRoadviewPosition({ lat: pos.getLat(), lng: pos.getLng() });
                }}
                onErrorGetNearestPanoId={() => setRoadviewError(true)}
              >
                <RoadviewMarker position={roadviewPosition} />
              </Roadview>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
