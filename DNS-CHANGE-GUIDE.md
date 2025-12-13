# feezone.info DNS 설정 변경 가이드

## 1단계: Cloudflare Dashboard 접속
https://dash.cloudflare.com

## 2단계: feezone.info 선택
대시보드에서 "feezone.info" 도메인을 클릭하세요

## 3단계: DNS 메뉴로 이동
왼쪽 메뉴에서 "DNS" → "Records" 클릭

## 4단계: CNAME 레코드 2개 찾기
다음 2개의 레코드를 찾으세요:

레코드 1:
- Type: CNAME
- Name: @ (또는 feezone.info)
- Content: hometown.pages.dev  ← 이것을 바꿔야 함

레코드 2:
- Type: CNAME  
- Name: www
- Content: hometown.pages.dev  ← 이것을 바꿔야 함

## 5단계: Content 필드 수정
각 레코드의 "Edit" 버튼을 클릭하고:

**hometown.pages.dev** → **ruralbase.pages.dev** 로 변경

## 6단계: 저장
"Save" 버튼 클릭

## 7단계: 확인 (5분 후)
- https://feezone.info
- https://www.feezone.info

---

## 요약
변경할 내용:
❌ hometown.pages.dev (잘못됨)
✅ ruralbase.pages.dev (올바름)

2개 레코드 모두 변경하세요!
