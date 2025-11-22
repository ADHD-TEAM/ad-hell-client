// src/stores/boardStore.js
import { ref, reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import { fetchBoards, fetchBoardDetail } from '@/api/boardApi';

/*
  useBoardStore: 게시판 전용 전역 상태 모듈
  - boards: 게시글 목록 배열
  - total: 전체 게시글 수
  - loading: 목록/상세 로딩 상태
  - page, size: 현재 페이지 / 페이지 크기
  - searchForm: 제목, 작성자, 기간 검색 폼
*/
export const useBoardStore = defineStore('board', () => {
    // 1) state
    const boards = ref([]);      // [{ id, title, writer, createdAt, viewCount }, ...]
    const total = ref(0);        // 전체 건수
    const loading = ref(false);  // 로딩 상태
    const boardDetail = ref(null); // 게시글 상세

    const page = ref(1);         // 현재 페이지
    const size = ref(10);        // 페이지 당 개수

    // 검색 폼 (제목, 작성자, 작성일 from ~ to)
    const searchForm = reactive({
        title: '',
        writer: '',
        fromDate: null,
        toDate: null,
    });

    // 2) getters
    const totalPages = computed(() => {
        if (!total.value || !size.value) return 1;
        return Math.max(1, Math.ceil(total.value / size.value));
    });

    // 3) 내부 유틸 함수
    /*
      buildQuery:
      - 현재 page, size, searchForm 값을 기반으로
        fetchBoards 에 넘겨줄 쿼리 객체를 만든다.
    */
    const buildQuery = () => ({
        page: page.value,
        size: size.value,
        title: searchForm.title || undefined,
        writer: searchForm.writer || undefined,
        fromDate: searchForm.fromDate || undefined,
        toDate: searchForm.toDate || undefined,
    });

    // 4) actions

    /*
      loadBoards:
      - /api/boards (query controller) 호출해서 목록 데이터를 가져온다.
      - 성공 시 boards, total 을 갱신한다.

      ⚠️ fetchBoards 는 이미 res.data.data 만 반환하므로
         여기서는 data = { items, totalCount } 형태라고 가정한다.
    */
    const loadBoards = async () => {
        loading.value = true;
        try {
            const params = buildQuery();

            // fetchBoards 가 반환하는 값: res.data.data
            const data = await fetchBoards(params);
            // 예) data = { items: [...], totalCount: 123 }

            boards.value = data.items ?? data.boards ?? [];
            total.value = data.totalCount ?? data.total ?? 0;
        } catch (e) {
            console.error('loadBoards error:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    /*
      loadBoardDetail:
      - /api/boards/{id} 호출해서 상세 내용을 가져온다.
    */
    const loadBoardDetail = async (id) => {
        loading.value = true;
        try {
            const data = await fetchBoardDetail(id);
            boardDetail.value = data;
        } catch (e) {
            console.error('loadBoardDetail error:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    /*
      search:
      - 검색 버튼 눌렀을 때 호출.
      - 페이지를 1로 초기화하고 loadBoards 재호출.
    */
    const search = async () => {
        page.value = 1;
        await loadBoards();
    };

    /*
      changePage:
      - 페이지네이션 클릭 시 호출.
      - page 값을 바꾸고 loadBoards 재호출.
    */
    const changePage = async (newPage) => {
        page.value = newPage;
        await loadBoards();
    };

    /*
      reset:
      - 검색 조건 리셋하고 1페이지부터 다시 조회.
    */
    const reset = async () => {
        searchForm.title = '';
        searchForm.writer = '';
        searchForm.fromDate = null;
        searchForm.toDate = null;
        page.value = 1;
        await loadBoards();
    };

    // 5) 외부로 공개
    return {
        // state
        boards,
        total,
        loading,
        boardDetail,
        page,
        size,
        searchForm,

        // getters
        totalPages,

        // actions
        loadBoards,
        loadBoardDetail,
        search,
        changePage,
        reset,
    };
});
