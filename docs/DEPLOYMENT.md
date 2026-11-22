# 배포 및 운영 가이드

> 이 문서는 RIDE DNA 저장소 운영자를 위한 개발 문서입니다. 사이트 소개는 [README](../README.md)를 참고하세요.

## GitHub Pages에 배포

1. 전체 배포 ZIP을 압축 해제하고 내부 파일을 저장소 `1m58ine/Ride-DNA` 루트에 업로드합니다.
2. `index.html`, `app.js`, `styles.css`, `config.js`, `about.html`, `about.css`, `assets/`, `docs/` 등 변경된 항목을 교체한 뒤 커밋합니다.
3. GitHub **Settings → Pages**에서 브랜치 `main`, 경로 `/(root)`가 설정되어 있는지 확인합니다.
4. 주소는 `https://1m58ine.github.io/Ride-DNA/`입니다. 대소문자를 확인하세요.
5. 배포 후 강력 새로고침하고 Android Chrome, 삼성 인터넷, iPhone Safari, PC Chrome에서 검사·PNG·공유 동작을 최종 확인하세요.

## 카카오톡 공유(선택)

카카오 Developers에서 앱을 만든 뒤 **JavaScript 키만** `config.js`의 `kakaoJavaScriptKey`에 넣어 주세요. SDK 허용 도메인과 공유 링크 도메인을 모두 등록해야 합니다. REST API 키나 Admin 키는 정적 저장소에 넣지 마세요. 미등록 시에도 링크 복사·기기 공유·PNG 저장은 동작합니다.

## 데이터와 모델 버전

- 빠른 검사 **16문항**, 심화 검사 **40문항(16+24)**, 적응형 추가 질문 **0~8문항**을 유지합니다.
- 채점 모델은 v1.5.0과 동일하며 저장 키는 `ridedna-v1.5.0`으로 유지합니다.
- 16유형·8장르와 검사 채점 구조를 유지하며 **별도 MBTI 질문·입력 UI는 제거**했습니다.
- 공유 URL에 전체 답변은 포함하지 않습니다. v1.8.0부터 MBTI 정보는 공유하지 않으며, 기존 공유 URL의 `e`/`s` 매개변수는 무시합니다.
- 검사 기록은 브라우저 저장소에 남을 수 있습니다. 공용 기기에서는 사이트 데이터 삭제를 안내해 주세요.

## QA 및 보안

`node --check app.js`를 실행하고, [SECURITY_REVIEW.md](../SECURITY_REVIEW.md)에 기록한 테스트 한계를 확인하세요. CSP와 공유 데이터 검증은 방어 수단이지 안전을 보장하지 않습니다. 정적 사이트에는 SQL 실행이나 서버 측 상태 변경 로직이 없으므로 SQL Injection, 서버 측 CSRF의 직접 공격 표면이 없지만 브라우저 XSS·외부 SDK·공유 URL은 계속 검토해야 합니다.

## 성능

16개 유형의 벡터 엠블럼과 인터랙티브 메인 그래픽은 CSS·SVG·Canvas를 사용하며 대형 애니메이션 프레임워크는 사용하지 않습니다. 실제 기기의 FPS·INP 수치는 아직 계측하지 않았으므로 성능 향상 배율을 주장하지 않습니다. `prefers-reduced-motion` 및 화면의 연출 끄기 설정을 제공하며, 공유 카드 Canvas는 사용자가 요청했을 때만 생성합니다.

## v1.9 카드 렌더러

신규 `card-renderer.js`를 `app.js`와 같은 경로에 반드시 업로드하세요. `index.html`에서 `config.js` → `card-renderer.js` → `app.js` 순서로 로드합니다. 이전 버전의 캐시가 남는다면 강력 새로고침 후 확인하세요. 카카오 JavaScript 키를 사용 중인 경우 `config.js`의 기존 설정을 보존하세요.
