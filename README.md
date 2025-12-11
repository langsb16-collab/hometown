# RuralBase - 귀농·귀촌 인큐베이터 플랫폼

## 프로젝트 개요
**RuralBase**는 인구 소멸 위기 지역을 중심으로 귀농·귀촌을 희망하는 사람들과 지자체를 연결하는 종합 디지털 플랫폼입니다.

### 주요 목표
- 인구 소멸 위기 지역의 활성화
- 귀농·귀촌 희망자의 안정적인 정착 지원
- 빈집 및 유휴 농지 활용
- 스마트팜 기술 교육 및 체험 제공

### 핵심 기능
1. **지역 찾기** - 인구 소멸 위험도별 지역 검색 및 상세 정보
2. **빈집 매칭** - 저렴한 주거 공간 검색 및 매칭
3. **스마트팜 센터** - 첨단 농업 기술 체험 및 교육 시설 안내
4. **정착 지원 패키지** - 지자체별 지원금 및 혜택 정보
5. **교육 프로그램** - 농업 기술 교육 과정 안내
6. **성공 사례** - 실제 귀농·귀촌 성공 사례 공유

## 현재 구현된 기능

### ✅ 백엔드 (Hono Framework)
- **지역 API** (`/api/regions`)
  - 전체 지역 조회
  - 인구 소멸 위험도별 필터링
  - 지역 상세 정보 조회
  
- **빈집 API** (`/api/empty-houses`)
  - 빈집 목록 조회 (상태, 지역별 필터)
  - 빈집 상세 정보
  - 지도 마커용 위치 데이터

- **스마트팜 API** (`/api/smart-farms`)
  - 스마트팜 목록 조회 (유형, 지역별 필터)
  - 스마트팜 상세 정보
  - 지도 마커용 위치 데이터

### ✅ 프론트엔드
- 반응형 UI (TailwindCSS)
- 인구 소멸 위험 지역 시각화
- 빈집/스마트팜 카드 리스트
- 지역별 필터링
- 지도 API 통합 준비 (Google Maps / Naver Maps)

### ✅ 데이터베이스 (Cloudflare D1)
- 7개 테이블 구조
  - regions (지역 정보)
  - empty_houses (빈집 정보)
  - smart_farms (스마트팜 정보)
  - farmlands (농지 정보)
  - education_programs (교육 프로그램)
  - settlement_packages (정착 패키지)
  - success_stories (성공 사례)
- 샘플 데이터 포함 (5개 지역, 5개 빈집, 5개 스마트팜 등)

## URLs

### 개발 환경
- **로컬**: http://localhost:3000
- **샌드박스**: https://3000-iqstbi87gl2prw0g5ohdy-d0b9e1e2.sandbox.novita.ai

### API 엔드포인트
- `GET /api/regions` - 전체 지역 목록
- `GET /api/regions/:id` - 특정 지역 상세
- `GET /api/regions/risk/:level` - 위험도별 지역
- `GET /api/empty-houses` - 빈집 목록
- `GET /api/empty-houses/:id` - 빈집 상세
- `GET /api/empty-houses/map/markers` - 지도 마커용 데이터
- `GET /api/smart-farms` - 스마트팜 목록
- `GET /api/smart-farms/:id` - 스마트팜 상세
- `GET /api/smart-farms/map/markers` - 지도 마커용 데이터

## 데이터 아키텍처

### 데이터 모델
```
regions (지역)
├── empty_houses (빈집)
├── smart_farms (스마트팜)
├── farmlands (농지)
├── education_programs (교육 프로그램)
├── settlement_packages (정착 패키지)
└── success_stories (성공 사례)
```

### 저장 서비스
- **Cloudflare D1 Database** - 모든 관계형 데이터 저장
- **로컬 개발** - `--local` 플래그로 로컬 SQLite 사용
- **프로덕션** - Cloudflare D1 글로벌 분산 데이터베이스

### 샘플 지역 데이터
1. **경상북도 의성군** - 인구 소멸 3단계, 고령화율 42.5%, 지원 예산 5000만원
2. **경상북도 청송군** - 인구 소멸 3단계, 고령화율 40.2%, 지원 예산 4500만원
3. **전라남도 고흥군** - 인구 소멸 3단계, 고령화율 39.8%, 지원 예산 4800만원
4. **강원도 영월군** - 인구 소멸 2단계, 고령화율 35.4%, 지원 예산 3500만원
5. **전라북도 무주군** - 인구 소멸 3단계, 고령화율 38.9%, 지원 예산 4200만원

## 사용자 가이드

### 지역 찾기
1. 메인 페이지에서 "지역 찾기" 버튼 클릭
2. 인구 소멸 위험도별 지역 확인
3. 지역별 지원 예산, 고령화율, 빈집률 비교
4. 관심 지역 선택 후 상세 정보 확인

### 빈집 검색
1. "빈집 보기" 버튼 클릭
2. 지역 필터 선택
3. 가격, 면적, 주택 유형 확인
4. 연락처를 통해 문의

### 스마트팜 찾기
1. "스마트팜 보기" 버튼 클릭
2. 교육형, 체험형, 실습형, 창업형 필터
3. 시설 정보 및 재배 작물 확인
4. 교육 가능 여부 확인

### 지도 활용 (API 키 설정 후)
1. Google Maps 또는 Naver Maps 선택
2. 빈집 및 스마트팜 위치 마커 확인
3. 클릭하여 상세 정보 팝업 확인

## 기술 스택

### 백엔드
- **Hono** - 경량 웹 프레임워크
- **Cloudflare Workers** - 엣지 런타임
- **TypeScript** - 타입 안전성

### 프론트엔드
- **TailwindCSS** - 유틸리티 우선 CSS
- **Font Awesome** - 아이콘 라이브러리
- **Axios** - HTTP 클라이언트

### 데이터베이스
- **Cloudflare D1** - 글로벌 분산 SQLite 데이터베이스

### 개발 도구
- **Vite** - 빌드 도구
- **Wrangler** - Cloudflare 개발 CLI
- **PM2** - 프로세스 매니저

## 아직 구현되지 않은 기능

### 🚧 진행 예정
1. **지도 API 통합**
   - Google Maps JavaScript API 연동
   - Naver Maps JavaScript API 연동
   - 실시간 마커 표시 및 클러스터링

2. **농지 검색 기능**
   - 농지 목록 페이지
   - 토양 종류, 면적별 필터
   - 농지 상세 정보 페이지

3. **교육 프로그램 페이지**
   - 교육 과정 목록
   - 온라인/오프라인 필터
   - 신청 기능

4. **정착 패키지 추천 시스템**
   - 사용자 프로필 기반 추천
   - 나이, 가족 구성, 희망 농업 유형 입력
   - AI 기반 최적 지역 추천

5. **성공 사례 페이지**
   - 사례 목록 및 상세 보기
   - 연령대, 업종별 필터
   - 동영상 재생 기능

6. **커뮤니티 기능**
   - Q&A 게시판
   - 지역별 멘토 매칭
   - 실시간 채팅

7. **사용자 인증**
   - 회원 가입/로그인
   - 관심 지역 저장
   - 빈집/스마트팜 찜하기

8. **관리자 기능**
   - 데이터 관리 대시보드
   - 빈집/스마트팜 등록/수정/삭제
   - 통계 및 분석

## 추천 개발 순서

### 1단계: 지도 API 통합 (우선순위: 높음)
- Google Maps API 키 발급 및 설정
- Naver Maps API 키 발급 및 설정
- 마커 표시 및 클러스터링 구현
- 정보창(InfoWindow) 구현

### 2단계: 상세 페이지 구현
- 빈집 상세 페이지
- 스마트팜 상세 페이지
- 지역 상세 페이지
- 이미지 갤러리 및 연락 기능

### 3단계: 필터 및 검색 고도화
- 가격대, 면적, 시설별 상세 필터
- 검색 기능 추가
- 정렬 기능 (가격순, 최신순 등)

### 4단계: 교육 및 지원 정보
- 교육 프로그램 페이지
- 정착 패키지 상세 페이지
- 지원금 신청 안내

### 5단계: 커뮤니티 및 사용자 기능
- 회원 인증 시스템
- 게시판 및 Q&A
- 찜하기 및 알림 기능

### 6단계: 관리자 대시보드
- 데이터 관리 인터페이스
- 통계 및 분석 기능
- 사용자 관리

## 로컬 개발 가이드

### 설치 및 시작
```bash
# 의존성 설치
npm install

# 데이터베이스 마이그레이션
npm run db:migrate:local

# Seed 데이터 로드
npm run db:seed

# 빌드
npm run build

# 개발 서버 시작 (PM2)
pm2 start ecosystem.config.cjs

# 테스트
curl http://localhost:3000
```

### 유용한 명령어
```bash
# 데이터베이스 리셋
npm run db:reset

# 포트 정리
npm run clean-port

# PM2 로그 확인
pm2 logs webapp --nostream

# PM2 서비스 재시작
fuser -k 3000/tcp && pm2 restart webapp
```

## 배포 상태
- **플랫폼**: Cloudflare Pages (예정)
- **상태**: 🚧 개발 중
- **마지막 업데이트**: 2024-12-11

## 프로젝트 구조
```
webapp/
├── src/
│   ├── index.tsx              # 메인 애플리케이션
│   ├── renderer.tsx           # JSX 렌더러
│   ├── types/
│   │   └── database.ts        # 데이터베이스 타입 정의
│   └── routes/
│       ├── regions.ts         # 지역 API
│       ├── empty-houses.ts    # 빈집 API
│       └── smart-farms.ts     # 스마트팜 API
├── migrations/
│   └── 0001_initial_schema.sql # 데이터베이스 스키마
├── public/
│   └── static/                # 정적 파일
├── seed.sql                   # 샘플 데이터
├── ecosystem.config.cjs       # PM2 설정
├── wrangler.jsonc            # Cloudflare 설정
├── package.json              # 의존성 관리
└── README.md                 # 프로젝트 문서

```

## 라이선스
MIT License

## 문의
- 이메일: info@ruralbase.kr
- 전화: 1588-1234

---

**RuralBase** - 농촌의 미래와 귀농인의 꿈을 한곳에서 🌾
