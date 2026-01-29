export interface SchoolRaw {
  시도교육청코드: string;
  시도교육청명: string;
  행정표준코드: string;
  학교명: string;
  영문학교명: string;
  학교종류명: string;
  시도명: string;
  관할조직명: string;
  설립명?: string;
  도로명우편번호: string;
  도로명주소: string;
  Latitude?: string;
  Longitude?: string;
  도로명상세주소: string;
  전화번호: string;
  홈페이지주소: string;
  남녀공학구분명: string;
  팩스번호: string;
  고등학교구분명: string;
  산업체특별학급존재여부: string;
  고등학교일반전문구분명: string;
  입시전후기구분명: string;
  주야구분명: string;
  설립일자: string;
  개교기념일: string;
  수정일자: string;
}

export interface School {
  id: string;
  name: string;
  englishName: string;
  type: string;
  establishment: string;
  address: string;
  addressDetail: string;
  latitude: number;
  longitude: number;
  phone: string;
  fax: string;
  website: string;
  coed: string;
  region: string;
  admissionTiming: string;
  dayNight: string;
  foundedDate: string;
}
