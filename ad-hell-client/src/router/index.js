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


            //  문의
            {
                path: 'inquiries/:id',
                name: 'InquiryDetail',
                component: () => import('@/pages/inquiry/user/InquiryDetail.vue'),
                props: true,
            },

            //  공지사항
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
            {
                path: 'mypage',
                name: 'Mypage',
                component: () => import('@/pages/mypage/Mypage.vue'),
                props: true,
                children: [
                    {
                        path: 'profile/update',
                        name: 'MyProfileUpdate',
                        component: () => import('@/pages/mypage/MyProfileUpdate.vue'),
                        props: true,
                    },
                    {
                        path: 'password/update',
                        name: 'MyPasswordUpdate',
                        component: () => import('@/pages/mypage/PasswordUpdate.vue'),
                        props: true,
                    },
                    {
                        path: 'account/delete',
                        name: 'AccountDelete',
                        component: () => import('@/pages/mypage/AccountDelete.vue'),
                        props: true,
                    },
                    {
                        path: 'inquiries',
                        name: 'MyInquiryList',
                        component: () => import('@/pages/mypage/MyInquiryList.vue'),
                    },
                    {
                        path: 'boards',
                        name: 'MyBoardList',
                        component: () => import('@/pages/mypage/MyBoardList.vue'),
                    },
                      path: '/mypage/points',
                      name: 'MyPointHistory',
                      component: () => import('@/pages/mypage/MyPointHistory.vue'),
                    },
                ]
            },
            /* 회원 경품 */
            {
              path: 'rewards',
              name: 'RewardList',
              component: () => import('@/pages/reward/user/RewardList.vue'),
            },

            {
              path: 'rewards/:id',
              name: 'RewardDetail',
              component: () => import('@/pages/reward/user/RewardDetail.vue'),
            },

            // 광고 페이지
            {
                path: 'adManageView',
                name: 'AdManageView',
                component: () => import('@/pages/advertise/AdManageView.vue'),
            },
            {
                path: 'adCreate',
                name: 'AdCreate',
                component: () => import('@/pages/advertise/AdCreate.vue'),
            },
            {
                path: 'adDetail/:id',
                name: 'AdDetail',
                component: () => import('@/pages/advertise/AdDetail.vue'),
            },
            {
                path: 'adMain/:id',
                name: 'AdMain',
                component: () => import('@/pages/advertise/AdMain.vue'),
            },

            {
                path: 'admin/home',
                name: 'AdminHome',
                component: () => import('@/pages/admin/Home.vue'),
            },

            // 어드민 신고 목록 페이지
            {
                path: 'admin/reports',
                name: 'ReportList',
                component: () => import('@/pages/report/ReportList.vue'),
                meta: { role: 'admin' }
            },

            /* 관리자 카테고리 관리 */
            {
              path: 'admin/categories',
              name: 'AdminCategoryList',
              component: () => import('@/pages/category/CategoryList.vue'),
              meta: { role: 'admin' }
            },
            {
              path: 'admin/categories/create',
              name: 'AdminCategoryCreate',
              component: () => import('@/pages/category/CategoryCreate.vue'),
              meta: { role: 'admin' }
            },
            {
              path: 'admin/categories/:id/edit',
              name: 'AdminCategoryEdit',
              component: () => import('@/pages/category/CategoryEdit.vue'),
              meta: { role: 'admin' }
            },

            /* 관리자 경품 관리 */
            {
              path: 'admin/rewards',
              name: 'AdminRewardList',
              component: () => import('@/pages/reward/AdminRewardList.vue'),
            },
            {
              path: 'admin/rewards/create',
              name: 'AdminRewardCreate',
              component: () => import('@/pages/reward/AdminRewardCreate.vue'),
              meta: { role: 'admin' }
            },
            {
              path: 'admin/rewards/:id/edit',
              name: 'AdminRewardEdit',
              component: () => import('@/pages/reward/AdminRewardEdit.vue'),
              meta: { role: 'admin' }
            },
            {
              path: 'admin/rewards/:id/stock',
              name: 'AdminRewardStockCreate',
              component: () => import('@/pages/reward/RewardStockCreate.vue'),
              meta: { role: 'admin' }
            },

            /* 관리자 신고 관리 */
            {
              path: 'admin/reports',
              name: 'AdminReportList',
              component: () => import('@/pages/report/ReportList.vue'),
              meta: { role: 'admin' }
            },
            // 관리자 문의
            {
                path: 'admin/inquiries',
                name: 'AdminInquiryList',
                component: () => import('@/pages/inquiry/admin/AdminInquiryList.vue'),
                meta: { requiresAuth: true, role: 'admin' },
            },
            {
                path: 'admin/inquiries/:id',
                name: 'AdminInquiryDetail',
                component: () => import('@/pages/inquiry/admin/AdminInquiryDetail.vue'),
                props: true,
                meta: { requiresAuth: true, role: 'admin' },
            },

            //관리자 공지사항
            {
                path: 'admin/announcements',
                name: 'AdminAnnouncementList',
                component: () => import('@/pages/announcement/admin/AdminAnnouncementList.vue'),
                meta: { requiresAuth: true, role: 'admin' },
            },
            {
                path: 'admin/announcements/create',
                name: 'AdminAnnouncementCreate',
                component: () => import('@/pages/announcement/admin/AdminAnnouncementCreate.vue'),
                meta: { requiresAuth: true, role: 'admin' },
            },
            {
                path: 'admin/announcements/:id',
                name: 'AdminAnnouncementDetail',
                component: () => import('@/pages/announcement/admin/AdminAnnouncementDetail.vue'),
                props: true,
                meta: { requiresAuth: true, role: 'admin' },
            },
            {
                path: 'admin/announcements/:id/edit',
                name: 'AdminAnnouncementEdit',
                component: () => import('@/pages/announcement/admin/AdminAnnouncementEdit.vue'),
                props: true,
                meta: { requiresAuth: true, role: 'admin' },
            },
            {
                path: 'admin/boards',
                name: 'AdminBoardList',
                component: () => import('@/pages/board/user/BoardList.vue'),
                meta: { requiresAuth: true, role: 'admin' },
            },

            { // 어드민 회원관리
                path: 'admin/user/managements',
                name: 'UserManagementList',
                component: () => import('@/pages/admin/UserManagementList.vue'),
            },
            { // 어드민 회원관리 상세
                path: 'admin/user/management',
                name: 'UserManagementDetail',
                component: () => import('@/pages/admin/UserManagementDetail.vue'),
                children: [
                    {
                        path: 'detail/:id',
                        name: 'UserDetailUpdate',
                        component: () => import('@/pages/admin/UserDetailUpdate.vue'),
                        props: true,
                    },
                    {
                        path: 'point/:id',
                        name: 'UserPointManagement',
                        component: () => import('@/pages/admin/UserPointManagement.vue'),
                        props: true,
                    },

                ]
            },
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

            // 템플릿 수정 페이지
            {
                path: 'alarms/:templateId/edit',
                name: 'AdminAlarmTemplateEdit',
                component: () => import('@/pages/notification/admin/AlarmTemplateEdit.vue'),
            },

            //  템플릿 상세 조회 페이지
            {
                path: 'alarms/:templateId',
                name: 'AdminAlarmTemplateDetail',
                component: () => import('@/pages/notification/admin/AlarmTemplateDetail.vue'),
            },

            //  발송 알림 조회 페이지
            {
                path: 'alarms/send',
                name: 'AdminAlarmSendList',
                component: () => import ('@/pages/notification/admin/AlarmSendList.vue')
            },

            // 알림 발송 생성 페이지
            {
                path: '/admin/alarms/send/create',
                name: 'AdminAlarmSendCreate',
                component: () => import('@/pages/notification/admin/AlarmSendCreate.vue'),
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
