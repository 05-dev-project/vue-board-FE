# vue-board (Frontend)

Vue 3 + TypeScript + Vite 기반의 게시판 프론트엔드입니다.  
백엔드(Spring Boot)는 `../board` 프로젝트를 함께 실행해야 합니다.

## 요구사항

- Node.js 18+ (LTS 권장)
- npm 9+ (또는 pnpm/yarn, 문서에서는 npm 기준)
- 백엔드 서버: `http://localhost:8080`

## 실행 방법

```bash
# 의존성 설치
npm install

# 로컬 개발 서버 (기본 http://localhost:5173)
npm run dev

# 타입체크 + 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 프로젝트 구조와 역할

```
src/
  api/axios.ts          # 전역 axios 인스턴스, 요청/응답 인터셉터
  composables/auth.ts   # 인증 상태 관리: accessToken 메모리 저장, refresh, logout, userId 디코딩
  router/index.ts       # 라우팅 설정 (목록/상세/작성/수정, 로그인/회원가입)
  views/                # 페이지 단위 컴포넌트
    LoginView.vue       # 로그인 (form-url-encoded)
    SignupView.vue      # 회원가입
    BoardListView.vue   # 목록 + 페이지네이션
    BoardDetailView.vue # 상세, 본인 글이면 수정/삭제 버튼 노출
    BoardWriteView.vue  # 작성
    BoardEditView.vue   # 수정
  components/
    AppHeader.vue       # 상단 헤더, 로그인/로그아웃 버튼
  App.vue               # 루트, 공통 레이아웃 + 초기 refresh 시도
  main.ts               # Vue 앱 부트스트랩
```

## 주요 기능

- 회원가입 / 로그인 / 로그아웃
- 게시글 목록 조회 (페이지네이션)
- 게시글 상세 조회
- 게시글 작성 / 수정 / 삭제 (작성자만)
- 본인 글 여부 확인 후 수정·삭제 버튼 노출
- accessToken 만료 시 refreshToken으로 자동 재발급 후 원래 요청 재시도

## 인증/토큰 동작

- accessToken: 메모리에만 저장 (XSS 대비, 새로고침 시 휘발)
- refreshToken: 백엔드가 HttpOnly Secure 쿠키로 관리
- 자동 재발급: axios 응답 인터셉터에서 401이면 `/api/auth/refresh` 호출 → 성공 시 원 요청 재시도
- 로그아웃: `/api/auth/logout` 호출 → 서버에서 refresh 쿠키 삭제, 클라이언트는 메모리 토큰 클리어
- 페이지 새로고침: `App.vue`에서 로그인/회원가입 페이지가 아닐 때 `/api/auth/refresh` 한 번 시도하여 세션 복구
- userId 확인: `auth.ts`의 `getUserId()`가 JWT payload 디코딩해 본인 글 여부 판단에 사용

## 백엔드 연동 (요약)

- 경로: `../board`
- Spring Boot + JPA, JWT 인증, Soft Delete 적용
- 주요 엔드포인트
  - `POST /api/auth/signup` 회원가입
  - `POST /login` 로그인 (폼 파라미터: username, password)
  - `POST /api/auth/refresh` 토큰 재발급 (refresh 쿠키 필요)
  - `POST /api/auth/logout` 로그아웃 (인증 필요)
  - `GET /api/board` 목록 (page, size)
  - `POST /api/board` 작성 (인증 필요)
  - `GET /api/board/{id}` 상세
  - `PUT /api/board/{id}` 수정 (작성자 본인)
  - `DELETE /api/board/{id}` 삭제 (작성자 본인)

## 폴더 구조 (주요)

```
src/
  api/axios.ts         # axios 인스턴스 + 인터셉터
  composables/auth.ts  # 토큰 관리, refresh, logout, userId 디코딩
  router/index.ts      # 라우트 정의
  views/               # 페이지 컴포넌트 (Login, Signup, Board*)
  components/          # 공용 컴포넌트 (헤더 등)
```

## 개발 시 참고

- baseURL은 `src/api/axios.ts`에서 `http://localhost:8080`으로 고정되어 있습니다.
- HTTPS 환경에서 refresh 쿠키 삭제가 잘 되지 않는다면 백엔드 쿠키 설정(`secure`)을 확인하세요.
- accessToken을 메모리에 두므로 새로고침 시 `/api/auth/refresh`를 통해 자동 복구합니다.

## 앞으로 확장 시 참고

- 검색/정렬/조회수/댓글/파일 첨부/좋아요 등은 아직 미구현
- 공용 상태 관리(Pinia)는 현재 사용하지 않았으며, 필요 시 `composables`로 확장 가능
