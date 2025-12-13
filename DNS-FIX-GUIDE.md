# 🔧 feezone.info DNS 수정 가이드 (Error 1014 해결)

## ❌ 현재 문제
- **CNAME Cross-User Banned** 오류 발생
- DNS가 잘못된 도메인을 가리킴: `hometown.pages.dev` (❌)
- 올바른 도메인: `ruralbase.pages.dev` (✅)

---

## ✅ 해결 방법 (3단계, 5분 소요)

### 1️⃣ Cloudflare Dashboard 접속
1. https://dash.cloudflare.com 접속
2. 로그인
3. **feezone.info** 도메인 클릭

### 2️⃣ DNS 레코드 수정
1. 왼쪽 메뉴에서 **DNS > Records** 클릭
2. 다음 2개 레코드를 찾아서 수정:

#### 레코드 1: 루트 도메인 (@)
```
Type: CNAME
Name: @ (또는 feezone.info)
Target: hometown.pages.dev  →  ruralbase.pages.dev 로 변경
Proxy status: Proxied (주황색 구름 아이콘)
TTL: Auto
```

#### 레코드 2: www 서브도메인
```
Type: CNAME
Name: www
Target: hometown.pages.dev  →  ruralbase.pages.dev 로 변경
Proxy status: Proxied (주황색 구름 아이콘)
TTL: Auto
```

### 3️⃣ 저장 및 확인
1. 각 레코드의 **Save** 버튼 클릭
2. 5-10분 대기 (DNS 전파 시간)
3. 다음 URL로 접속 테스트:
   - https://feezone.info
   - https://www.feezone.info

---

## 📸 스크린샷 예시

### 수정 전 (잘못된 설정)
```
@ → hometown.pages.dev  ❌
www → hometown.pages.dev  ❌
```

### 수정 후 (올바른 설정)
```
@ → ruralbase.pages.dev  ✅
www → ruralbase.pages.dev  ✅
```

---

## 🔍 핵심 포인트

| 항목 | 잘못된 값 | 올바른 값 |
|------|-----------|-----------|
| CNAME Target | `hometown.pages.dev` | `ruralbase.pages.dev` |
| Proxy Status | DNS only (회색) | **Proxied (주황색)** |
| 적용 시간 | - | **5-10분** |

---

## ✅ 완료 후 확인사항

1. **Error 1014 해결됨**: CNAME Cross-User Banned 오류 사라짐
2. **HTTPS 자동 적용**: Cloudflare SSL 인증서 자동 발급
3. **접속 가능**: https://feezone.info 정상 동작

---

## 🆘 문제 발생 시

만약 수정 후에도 오류가 계속되면:
1. 브라우저 캐시 삭제 (Ctrl+F5)
2. DNS 캐시 초기화: `ipconfig /flushdns` (Windows) 또는 `sudo dscacheutil -flushcache` (Mac)
3. 10분 더 대기 (DNS 전파는 최대 24시간까지 소요될 수 있음)

---

## 📌 요약

**변경해야 할 것:**
- `hometown.pages.dev` → `ruralbase.pages.dev`

**변경 위치:**
- Cloudflare Dashboard → DNS → Records

**소요 시간:**
- 설정 변경: 2분
- DNS 전파: 5-10분

**최종 확인:**
- https://feezone.info 접속 테스트
