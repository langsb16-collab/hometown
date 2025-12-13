# 🚀 RuralBase Cloudflare Pages 배포 가이드

## ⚠️ 현재 상황
API 토큰에 `Account Settings > Read` 권한이 없어서 자동 배포가 실패했습니다.

---

## ✅ 해결 방법 (3가지 중 선택)

### **방법 1: Cloudflare Dashboard에서 GitHub 직접 연결 (가장 간단 - 추천)**

1. **Cloudflare Dashboard** 접속: https://dash.cloudflare.com
2. 좌측 메뉴에서 **Workers & Pages** 클릭
3. **Create application** 버튼 클릭
4. **Pages** 탭 선택
5. **Connect to Git** 클릭
6. GitHub 계정 연결 승인
7. 저장소 선택: `langsb16-collab/hometown`
8. 빌드 설정:
   ```
   Framework preset: None
   Build command: npm run build
   Build output directory: dist
   Root directory: (비워두기)
   ```
9. **Environment variables** (나중에 추가 가능):
   ```
   NODE_VERSION = 18
   ```
10. **Save and Deploy** 클릭

✅ **완료!** Cloudflare가 자동으로 빌드하고 배포합니다.

11. 배포 완료 후 **Custom domains** 탭에서:
    - **Set up a custom domain** 클릭
    - `feezone.info` 입력 후 추가
    - `www.feezone.info` 입력 후 추가
    - Cloudflare가 자동으로 DNS 설정

---

### **방법 2: API 토큰에 권한 추가 후 재배포**

1. Cloudflare Dashboard → Profile → API Tokens
2. 기존 토큰 **Edit** 클릭
3. 권한 추가:
   - **Account > Account Settings > Read** ✅ 추가
4. **Continue to summary** → **Update Token**
5. 터미널에서 재배포:
   ```bash
   export CLOUDFLARE_API_TOKEN="dn1Kh_NjsDR4d_lxJsgkxRSjsZ9AyvkpygSt1e5-"
   cd /home/user/webapp
   npx wrangler pages deploy dist --project-name=ruralbase
   ```

---

### **방법 3: 새 토큰 생성 (완전한 권한)**

1. Cloudflare Dashboard → Profile → API Tokens
2. **Create Token** 클릭
3. **Edit Cloudflare Workers** 템플릿 사용
4. 권한 자동 설정됨:
   - Account > Cloudflare Pages > Edit
   - Account > Account Settings > Read
5. 새 토큰으로 배포:
   ```bash
   export CLOUDFLARE_API_TOKEN="새_토큰"
   cd /home/user/webapp
   npx wrangler pages deploy dist --project-name=ruralbase
   ```

---

## 📋 현재 준비된 것들

✅ **프로젝트 빌드 완료**: `dist/` 디렉토리
✅ **GitHub 저장소**: https://github.com/langsb16-collab/hometown
✅ **DNS 설정 완료**: feezone.info → hometown.pages.dev
✅ **API 토큰**: `dn1Kh_NjsDR4d_lxJsgkxRSjsZ9AyvkpygSt1e5-`

---

## 🎯 추천 방법

**방법 1 (Cloudflare Dashboard)** 을 사용하세요!
- 가장 간단하고 확실합니다
- GitHub와 자동 연동됩니다
- 푸시할 때마다 자동 배포됩니다
- 5분이면 완료됩니다

---

## 🌐 배포 후 URL

배포가 완료되면 다음 URL로 접속 가능합니다:

- **Cloudflare Pages**: https://ruralbase.pages.dev
- **커스텀 도메인**: https://feezone.info
- **www 도메인**: https://www.feezone.info

---

## 📞 문의

배포 중 문제가 발생하면 스크린샷과 함께 알려주세요!
