# Cloudflare Pages 배포 가이드

## ✅ 완료된 작업

1. ✅ 프로젝트 빌드 완료 (`dist/` 디렉토리 생성됨)
2. ✅ GitHub에 코드 푸시 완료
3. ✅ DNS 설정 완료 (feezone.info)
4. ✅ Cloudflare API 토큰 생성 완료

---

## 🚀 Cloudflare Pages 배포 방법

### 방법 1: Cloudflare Dashboard를 통한 배포 (권장)

#### Step 1: Cloudflare Dashboard 접속
1. https://dash.cloudflare.com 접속
2. 로그인 (langsb16@gmail.com)

#### Step 2: Pages 프로젝트 생성
1. 좌측 메뉴에서 **Workers & Pages** 클릭
2. **Create application** 버튼 클릭
3. **Pages** 탭 선택
4. **Connect to Git** 클릭

#### Step 3: GitHub 저장소 연결
1. **GitHub** 선택
2. 저장소 선택: `langsb16-collab/hometown`
3. **Begin setup** 클릭

#### Step 4: 빌드 설정
```
Project name: ruralbase
Production branch: main
Framework preset: None

Build settings:
  Build command: npm run build
  Build output directory: dist
  Root directory: (leave empty)

Environment variables:
  NODE_VERSION = 18
```

#### Step 5: 배포 시작
1. **Save and Deploy** 버튼 클릭
2. 배포 진행 상황 확인 (약 2-3분 소요)
3. 배포 완료 후 URL 확인: `https://ruralbase.pages.dev`

#### Step 6: 커스텀 도메인 추가
1. 프로젝트 페이지에서 **Custom domains** 탭 클릭
2. **Set up a custom domain** 클릭
3. 도메인 입력: `feezone.info`
4. **Continue** 클릭
5. Cloudflare가 자동으로 DNS 레코드 생성
6. **Activate domain** 클릭
7. `www.feezone.info`도 동일하게 추가

---

### 방법 2: Wrangler CLI를 통한 배포 (토큰 권한 부족으로 현재 불가)

현재 생성된 API 토큰에는 다음 권한이 누락되어 있어 CLI 배포가 불가능합니다:
- Account Settings > Read
- User > User Details > Read

**권한 추가 방법:**
1. Cloudflare Dashboard > Profile > API Tokens
2. 생성한 토큰 옆의 **Edit** 클릭
3. 다음 권한 추가:
   - Account > Account Settings > Read
   - User > User Details > Read
4. **Continue to summary** > **Save** 클릭

권한 추가 후:
```bash
export CLOUDFLARE_API_TOKEN="dn1Kh_NjsDR4d_lxJsgkxRSjsZ9AyvkpygSt1e5-"
cd /home/user/webapp
npx wrangler pages deploy dist --project-name=ruralbase --branch=main
```

---

## 📋 배포 후 확인사항

### 1. 배포 URL 확인
- Production: `https://ruralbase.pages.dev`
- Custom domain: `https://feezone.info`
- Custom domain: `https://www.feezone.info`

### 2. SSL/TLS 인증서
Cloudflare가 자동으로 SSL 인증서를 발급합니다 (약 5-10분 소요)

### 3. DNS 전파
DNS 설정이 전파되는 데 최대 24시간이 걸릴 수 있습니다 (보통 5-10분 이내)

---

## 🔧 D1 데이터베이스 설정 (프로덕션)

현재는 로컬 D1 데이터베이스를 사용 중입니다. 프로덕션 배포 시 실제 D1 데이터베이스를 생성해야 합니다.

### D1 데이터베이스 생성

```bash
# 1. 프로덕션 D1 데이터베이스 생성
export CLOUDFLARE_API_TOKEN="dn1Kh_NjsDR4d_lxJsgkxRSjsZ9AyvkpygSt1e5-"
npx wrangler d1 create webapp-production

# 출력 예시:
# ✅ Successfully created DB 'webapp-production'!
# Database ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# 2. wrangler.jsonc 업데이트
# "database_id": "위에서 받은 Database ID로 변경"

# 3. 마이그레이션 실행
npx wrangler d1 migrations apply webapp-production --remote

# 4. Seed 데이터 로드
npx wrangler d1 execute webapp-production --remote --file=./seed.sql
```

### Cloudflare Dashboard에서 D1 바인딩 추가

1. Workers & Pages > ruralbase > Settings 클릭
2. **Bindings** 섹션에서 **Add** 클릭
3. Variable type: **D1 Database** 선택
4. Variable name: `DB`
5. D1 database: `webapp-production` 선택
6. **Save** 클릭
7. 프로젝트 재배포

---

## ✅ 현재 상태

- ✅ 코드: GitHub에 푸시됨 (https://github.com/langsb16-collab/hometown)
- ✅ 빌드: 로컬에서 빌드 완료 (`dist/` 생성됨)
- ✅ DNS: feezone.info → hometown.pages.dev (CNAME 설정됨)
- ⏳ Cloudflare Pages: Dashboard에서 수동 배포 필요
- ⏳ D1 Database: 프로덕션 데이터베이스 생성 필요

---

## 🎯 다음 단계

1. **Cloudflare Dashboard에서 Pages 프로젝트 생성** (위 Step 1-6 참조)
2. **커스텀 도메인 추가** (feezone.info, www.feezone.info)
3. **D1 데이터베이스 생성 및 연결** (선택사항, 프로덕션 데이터 필요 시)
4. **배포 확인**: https://feezone.info 접속

---

## 📞 문제 해결

### 배포 실패 시
- 빌드 로그 확인
- `npm run build`가 로컬에서 정상 작동하는지 확인
- Node 버전 확인 (18 이상)

### DNS 연결 안 됨
- DNS 전파 시간 대기 (최대 24시간)
- `nslookup feezone.info` 명령으로 확인
- Cloudflare Dashboard에서 DNS 설정 재확인

### SSL 인증서 오류
- 5-10분 대기 후 재시도
- Cloudflare Dashboard > SSL/TLS > Overview에서 설정 확인
- SSL/TLS encryption mode: **Full (strict)** 권장

---

## 📚 참고 자료

- Cloudflare Pages 문서: https://developers.cloudflare.com/pages/
- D1 Database 문서: https://developers.cloudflare.com/d1/
- Wrangler CLI 문서: https://developers.cloudflare.com/workers/wrangler/
- Hono 프레임워크: https://hono.dev/

---

**배포가 완료되면 https://feezone.info에서 RuralBase 플랫폼을 사용하실 수 있습니다!** 🎉
