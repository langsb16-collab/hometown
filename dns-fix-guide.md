# feezone.info DNS 설정 수정 가이드

## 현재 문제
- CNAME 레코드가 `hometown.pages.dev`를 가리킴
- Cloudflare Pages 프로젝트명은 `ruralbase`
- CNAME Cross-User Banned 오류 발생

## 해결 방법

### 1단계: Cloudflare DNS 설정 변경
1. https://dash.cloudflare.com 접속
2. `feezone.info` 도메인 선택
3. **DNS > Records** 메뉴로 이동
4. 기존 CNAME 레코드 2개 삭제:
   - `@` → `hometown.pages.dev` (삭제)
   - `www` → `hometown.pages.dev` (삭제)

### 2단계: 새 CNAME 레코드 추가
**레코드 1:**
- Type: `CNAME`
- Name: `@`
- Target: `ruralbase.pages.dev`
- Proxy status: `Proxied` (주황색 구름)
- TTL: `Auto`

**레코드 2:**
- Type: `CNAME`
- Name: `www`
- Target: `ruralbase.pages.dev`
- Proxy status: `Proxied` (주황색 구름)
- TTL: `Auto`

### 3단계: Cloudflare Pages에서 도메인 재연결
이미 `feezone.info`와 `www.feezone.info`가 `ruralbase` 프로젝트에 연결되어 있으므로 추가 작업 불필요.

### 4단계: 확인 (5분 후)
- https://feezone.info
- https://www.feezone.info

## 중요 포인트
✅ `hometown.pages.dev` → `ruralbase.pages.dev`로 변경
✅ Proxy status는 반드시 `Proxied` (주황색 구름)
✅ DNS 전파 시간: 5-10분
