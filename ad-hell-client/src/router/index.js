// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import {useAuthStore} from "@/stores/authStore.js";


const routes = [


    {path: '/login' , name : 'UserLoginView' , component: () => import('@/pages/account/LoginView.vue') , meta: { layout: 'none' } },
    {path: '/admin/login' , name : 'AdminLoginView' , component: () => import('@/pages/account/LoginView.vue'), meta: { layout: 'none' } },
    {path: '/signUp' , name : 'SignUpView' , component: () => import('@/pages/account/SignUpView.vue'), meta: { layout: 'none' } },
    {path: '/find/id' , name : 'FindIdView' , component: () => import('@/pages/account/FindAccountView.vue'), meta: { layout: 'none' } },
    {path: '/find/password' , name : 'FindPasswordView' , component: () => import('@/pages/account/FindAccountView.vue'), meta: { layout: 'none' } },
    {path: '/lookup/id' , name : 'LookupIdView' , component: () => import('@/pages/account/LookupAccountView.vue'), meta: { layout: 'none' } },
    {path: '/lookup/password' , name : 'LookupPasswordView' , component: () => import('@/pages/account/LookupAccountView.vue'), meta: { layout: 'none' } },

    // 유저 영역 (UserSidebar)
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
            {
                path: 'boards/create',
                name: 'boardCreate',
                component: () => import('@/pages/board/user/BoardCreate.vue'),
            },
            {
                path: 'boards/:id/edit',
                name: 'boardEdit',
                component: () => import('@/pages/board/user/BoardEdit.vue'),
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
            {
                path: 'announcements',
            name: 'AnnouncementList',
            component: () => import('@/pages/announcement/user/AnnouncementList.vue'),
            },
            {
                path: 'announcements/:id',
                name: 'AnnouncementDetail',
                component: () => import('@/pages/announcement/user/AnnouncementDetail.vue'),
                props: true,
            },

            // 어드민 광고 등록 페이지
            {
                path: 'admanageview',
                name: 'AdManageView',
                component: () => import('@/pages/advertise/AdManageView.vue'),
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
