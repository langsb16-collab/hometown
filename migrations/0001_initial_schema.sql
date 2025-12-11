-- 지역 정보 테이블
CREATE TABLE IF NOT EXISTS regions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  population_risk_level INTEGER DEFAULT 0, -- 0: 정상, 1: 주의, 2: 위험, 3: 소멸위기
  elderly_rate REAL DEFAULT 0.0,
  empty_house_rate REAL DEFAULT 0.0,
  lat REAL,
  lng REAL,
  support_budget INTEGER DEFAULT 0,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 빈집 정보 테이블
CREATE TABLE IF NOT EXISTS empty_houses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  region_id INTEGER NOT NULL,
  address TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  house_type TEXT, -- 단독주택, 다가구주택, 농가주택
  area REAL, -- 면적 (평)
  price INTEGER, -- 가격 (만원)
  rental_type TEXT, -- 매매, 전세, 월세
  monthly_rent INTEGER, -- 월세 (만원)
  deposit INTEGER, -- 보증금 (만원)
  status TEXT DEFAULT 'available', -- available, pending, sold
  facilities TEXT, -- JSON: 상수도, 하수도, 전기, 가스
  images TEXT, -- JSON: 이미지 URL 배열
  contact TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES regions(id)
);

-- 스마트팜 정보 테이블
CREATE TABLE IF NOT EXISTS smart_farms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  region_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  farm_type TEXT, -- 체험형, 교육형, 실습형, 창업형
  crop_type TEXT, -- 딸기, 토마토, 파프리카, 버섯 등
  area REAL, -- 면적 (평)
  capacity INTEGER, -- 수용 인원
  facilities TEXT, -- JSON: 자동 관수, 온습도 제어, 센서, 원격 모니터링
  education_available INTEGER DEFAULT 0, -- 0: 불가능, 1: 가능
  rental_available INTEGER DEFAULT 0, -- 0: 불가능, 1: 가능
  rental_price INTEGER, -- 임대료 (만원/월)
  images TEXT, -- JSON: 이미지 URL 배열
  contact TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES regions(id)
);

-- 농지 정보 테이블
CREATE TABLE IF NOT EXISTS farmlands (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  region_id INTEGER NOT NULL,
  address TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  land_type TEXT, -- 전답, 과수원, 임야
  area REAL NOT NULL, -- 면적 (평)
  price INTEGER, -- 가격 (만원)
  rental_type TEXT, -- 매매, 임대
  monthly_rent INTEGER, -- 월세 (만원)
  deposit INTEGER, -- 보증금 (만원)
  soil_type TEXT, -- 토양 종류
  water_access INTEGER DEFAULT 0, -- 0: 없음, 1: 있음
  road_access INTEGER DEFAULT 0, -- 0: 없음, 1: 있음
  status TEXT DEFAULT 'available', -- available, pending, sold
  images TEXT, -- JSON: 이미지 URL 배열
  contact TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES regions(id)
);

-- 교육 프로그램 테이블
CREATE TABLE IF NOT EXISTS education_programs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  region_id INTEGER,
  title TEXT NOT NULL,
  category TEXT, -- 농기술 기초, 스마트팜, 창업, 정착지원
  duration INTEGER, -- 교육 기간 (일)
  capacity INTEGER, -- 정원
  price INTEGER DEFAULT 0, -- 교육비 (만원)
  schedule TEXT, -- 교육 일정
  location TEXT,
  online_available INTEGER DEFAULT 0, -- 0: 오프라인, 1: 온라인, 2: 병행
  instructor TEXT,
  description TEXT,
  syllabus TEXT, -- JSON: 교육 커리큘럼
  images TEXT, -- JSON: 이미지 URL 배열
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES regions(id)
);

-- 정착 패키지 테이블
CREATE TABLE IF NOT EXISTS settlement_packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  region_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  target_group TEXT, -- 청년, 은퇴자, 가족
  housing_support INTEGER DEFAULT 0, -- 주거 지원금 (만원)
  education_support INTEGER DEFAULT 0, -- 교육 지원금 (만원)
  startup_support INTEGER DEFAULT 0, -- 창업 지원금 (만원)
  farmland_support INTEGER DEFAULT 0, -- 농지 지원금 (만원)
  duration INTEGER, -- 지원 기간 (개월)
  requirements TEXT, -- 지원 요건
  benefits TEXT, -- JSON: 지원 혜택 상세
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES regions(id)
);

-- 성공 사례 테이블
CREATE TABLE IF NOT EXISTS success_stories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  region_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  age_group TEXT, -- 20대, 30대, 40대, 50대, 60대 이상
  previous_job TEXT,
  settlement_year INTEGER,
  business_type TEXT, -- 농업, 체험농장, 가공업, 판매업
  annual_revenue INTEGER, -- 연 매출 (만원)
  content TEXT,
  images TEXT, -- JSON: 이미지 URL 배열
  video_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES regions(id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_regions_risk_level ON regions(population_risk_level);
CREATE INDEX IF NOT EXISTS idx_empty_houses_region ON empty_houses(region_id);
CREATE INDEX IF NOT EXISTS idx_empty_houses_status ON empty_houses(status);
CREATE INDEX IF NOT EXISTS idx_smart_farms_region ON smart_farms(region_id);
CREATE INDEX IF NOT EXISTS idx_farmlands_region ON farmlands(region_id);
CREATE INDEX IF NOT EXISTS idx_farmlands_status ON farmlands(status);
CREATE INDEX IF NOT EXISTS idx_education_programs_region ON education_programs(region_id);
CREATE INDEX IF NOT EXISTS idx_settlement_packages_region ON settlement_packages(region_id);
CREATE INDEX IF NOT EXISTS idx_success_stories_region ON success_stories(region_id);
