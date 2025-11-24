// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useAuthStore } from '@/stores/authStore'

const routes = [

    // 유저 영역 (UserSidebar)
    {path: '/login' , name : 'UserLoginView' , component: () => import('@/pages/account/LoginView.vue') , meta: { layout: 'none' } },
    {path: '/admin/login' , name : 'AdminLoginView' , component: () => import('@/pages/account/LoginView.vue'), meta: { layout: 'none' } },
    {path: '/signUp' , name : 'SignUpView' , component: () => import('@/pages/account/SignUpView.vue'), meta: { layout: 'none' } },
    {path: '/find' , name : 'RecoverAccountView' , component: () => import('@/pages/account/RecoverAccountView.vue'), meta: { layout: 'none' } },
    /**
     * 유저 영역 (UserSidebar)
     */
    {
        path: '/',
        component: DefaultLayout,
        children: [
            {
                path: '',
                name: 'MainPage',
                component: () => import('@/pages/MainPage.vue'),
            },

            {
                path: 'categories',
                name: 'CategoryList',
                component: () => import('@/pages/CategoryList.vue'),
            },

            // 게시판
            {
                path: 'boards',
                name: 'BoardList',
                component: () => import('@/pages/board/user/BoardList.vue'),
            },
            {
                path: 'boards/:id',
                name: 'BoardDetail',
                component: () => import('@/pages/board/user/BoardDetail.vue'),
                props: true,
            },

            //  문의 (유저)
            {
                path: 'inquiries',
                name: 'InquiryList',
                component: () => import('@/pages/inquiry/user/InquiryList.vue'),
            },
            {
                path: 'inquiries/:id',
                name: 'InquiryDetail',
                component: () => import('@/pages/inquiry/user/InquiryDetail.vue'),
                props: true,
            },

            //  공지사항 (유저)
            // {
            //     path: 'announcements',
            //     name: 'AnnouncementList',
            //     component: () => import('@/pages/announcement/user/AnnouncementList.vue'),
            // },
            // {
            //     path: 'announcements/:id',
            //     name: 'AnnouncementDetail',
            //     component: () => import('@/pages/announcement/user/AnnouncementDetail.vue'),
            //     props: true,
            // },

        ],
    },

    /**
     * 관리자 영역 (AdminSidebar)
     */
    {
        path: '/admin',
        component: DefaultLayout,
        meta: { role: 'admin' },
        children: [
            //  템플릿 목록 조회 페이지
            {
                path: 'alarms',
                name: 'AdminAlarmTemplates',
                component: () => import('@/pages/notification/admin/AlarmTemplateList.vue'),
            },

            //  템플릿 생성 페이지
            {
                path: 'alarms/new',
                name: 'AdminAlarmTemplateCreate',
                component: () => import('@/pages/notification/admin/AlarmTemplateCreate.vue'),
            },

            //  템플릿 상세 조회 페이지
            {
                path: 'alarms/:templateId',
                name: 'AdminAlarmTemplateDetail',
                component: () => import('@/pages/notification/admin/AlarmTemplateDetail.vue'),
            },
        ],
    },



]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from) => {
    const authStore = useAuthStore();

}) ;

export default router
