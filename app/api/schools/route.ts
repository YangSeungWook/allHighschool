import { NextResponse } from "next/server";
import { School, SchoolRaw } from "@/app/types";
import data from "@/data.json";

function toSchool(raw: SchoolRaw): School | null {
  if (!raw.Latitude || !raw.Longitude) return null;
  const lat = parseFloat(raw.Latitude);
  const lng = parseFloat(raw.Longitude);
  if (isNaN(lat) || isNaN(lng)) return null;

  return {
    id: raw.행정표준코드,
    name: raw.학교명,
    englishName: raw.영문학교명,
    type: raw.고등학교구분명,
    establishment: raw.설립명 ?? "기타",
    address: raw.도로명주소,
    addressDetail: raw.도로명상세주소,
    latitude: lat,
    longitude: lng,
    phone: raw.전화번호,
    fax: raw.팩스번호,
    website: raw.홈페이지주소,
    coed: raw.남녀공학구분명,
    region: raw.시도명,
    admissionTiming: raw.입시전후기구분명,
    dayNight: raw.주야구분명,
    foundedDate: raw.설립일자,
  };
}

export async function GET() {
  const schools = (data as SchoolRaw[])
    .map(toSchool)
    .filter((s): s is School => s !== null);

  return NextResponse.json(schools);
}
