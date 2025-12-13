# 🔑 새 API 토큰 필수 권한 (DNS 자동 수정용)

## ⚠️ 현재 상황
- 기존 토큰: **Cloudflare Pages만** 접근 가능
- DNS 수정 불가: **Zone 권한 없음**

---

## ✅ 필요한 권한 (4개)

### 1️⃣ Account > Cloudflare Pages > Edit
- 이미 있음 ✅

### 2️⃣ Account > Account Settings > Read
- 이미 있음 ✅

### 3️⃣ User > User Details > Read
- 이미 있음 ✅

### 4️⃣ **Zone > DNS > Edit** ⭐ (NEW - 필수!)
- **없음 ❌ - 추가 필요**

---

## 🎯 토큰 생성 방법

### 1단계: API 토큰 페이지
https://dash.cloudflare.com/profile/api-tokens

### 2단계: "Create Token" 클릭

### 3단계: "Custom token" 선택

### 4단계: 권한 설정
```
Permissions:
✅ Account > Cloudflare Pages > Edit
✅ Account > Account Settings > Read  
✅ User > User Details > Read
✅ Zone > DNS > Edit  ⭐ (이것만 추가!)
```

### 5단계: Zone Resources 설정
```
Zone Resources:
- Include > Specific zone > feezone.info
```

### 6단계: Account Resources 설정
```
Account Resources:
- Include > Langsb16@gmail.com's Account
```

### 7단계: TTL 설정
```
TTL: Never expire (또는 최소 1년)
```

### 8단계: "Continue to summary" → "Create Token"

### 9단계: 토큰 복사하여 제공

---

## 📋 체크리스트

제공할 토큰이 다음을 모두 포함하는지 확인:
- [ ] Account > Cloudflare Pages > Edit
- [ ] Account > Account Settings > Read
- [ ] User > User Details > Read
- [ ] **Zone > DNS > Edit** ⭐
- [ ] Zone Resources: feezone.info
- [ ] Account Resources: Langsb16@gmail.com's Account

---

## 🚀 토큰 제공 후 자동 처리 항목

새 토큰을 주시면 제가 자동으로:
1. ✅ Zone ID 조회
2. ✅ 기존 DNS 레코드 찾기
3. ✅ `hometown.pages.dev` → `ruralbase.pages.dev` 변경
4. ✅ Proxy 상태 확인 및 수정
5. ✅ 5분 후 접속 테스트

**100% 자동으로 처리합니다. 추가 작업 없습니다!**
