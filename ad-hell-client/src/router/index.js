// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const routes = [
    /**
     * ✅ 유저 영역 (UserSidebar)
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

            // 📌 게시판 (유저)
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

            // 📌 문의 (유저)
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

            // 📌 공지사항 (유저)
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


         /*관리자 영역 (AdminSidebar)*/
    {
        path: '/admin',
        component: DefaultLayout,
        meta: { role: 'admin' },
        children: [
            // 📌 문의 관리 (목록 / 상세)
            {
                path: 'inquiries',
                name: 'AdminInquiryList',
                component: () => import('@/pages/inquiry/admin/AdminInquiryList.vue'),
                meta: { role: 'admin' },
            },
            {
                path: 'inquiries/:id',
                name: 'AdminInquiryDetail',
                component: () => import('@/pages/inquiry/admin/AdminInquiryDetail.vue'),
                props: true,
                meta: { role: 'admin' },
            },

            // 📌 (나중에) 공지사항 관리, 게시판 관리 등 추가
            // {
            //   path: 'announcements',
            //   name: 'AdminAnnouncementList',
            //   component: () => import('@/pages/announcement/admin/AdminAnnouncementList.vue'),
            //   meta: { role: 'admin' },
            // },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
