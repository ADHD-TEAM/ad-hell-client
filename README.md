# 📦 ad-hell-client

`ad-hell` 프로젝트의 클라이언트 레포지토리입니다.  
Vue 3 + Vite + Element Plus

---

# 🚀 기술 스택

- Vue 3 (Composition API)
- Vite
- Pinia (전역 상태)
- Vue Router
- Element Plus (UI Framework)
- Axios
- ESLint + Prettier

---

# 📁 프로젝트 구조
```
src/
 ├─ layouts/
 │    ├─ DefaultLayout.vue
 │    ├─ Header.vue
 │    ├─ Sidebar.vue
 │    └─ Footer.vue
 │
 ├─ pages/                      # 라우트와 1:1 매핑되는 페이지
 │    ├─ UserList.vue
 │    └─ UserDetail.vue
 │
 │
 ├─ components/                 # 재사용 가능한 UI 컴포넌트
 │    ├─ common/                # Element Plus 기반 커스텀 공통 UI
 │    │    ├─ CommonSearchForm.vue
 │    │    ├─ CommonModal.vue
 │    │    └─ CommonPagination.vue
 │    │
 │    └─ features/              # 도메인 전용 UI 조각
 │         ├─ user/
 │         │    ├─ UserCard.vue
 │         │    └─ UserForm.vue
 │         └─ board/
 │              ├─ BoardCard.vue
 │              └─ BoardForm.vue
 │
 ├─ composables/                # 재사용 로직(API + 상태 + composable 훅)
 │    ├─ useFetch.js
 │    ├─ usePagination.js
 │    └─ useForm.js
 │
 ├─ api/                   # API 호출 계층
 │    ├─ userApi.js
 │    ├─ boardApi.js
 │    └─ authApi.js
 │
 ├─ router/
 │    └─ index.js
 │
 ├─ store/                      # Pinia 전역 상태
 │    └─ userStore.js
 │
 ├─ utils/                      # 공통 유틸 함수
 │    └─ format.js
 │
 ├─ styles/                     # 전역 스타일 & Element Plus 커스터마이징
 │    ├─ variables.scss
 │    └─ overrides.scss
 │
 └─ assets/                     # 이미지 / 폰트 / 정적 리소스
```

---


