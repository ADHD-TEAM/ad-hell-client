
// mypage nav
export const mypageNav = [
    {index : 1 , title : '회원정보', linkTo :  {name : 'MyProfileUpdate'}},
    {index : 2, title : '포인트', linkTo : {name :'MyProfileUpdate'}},
    {index : 3, title : '광고', linkTo : {name :'MyProfileUpdate'}},
    {index : 4, title : '게시판', linkTo : {name :'MyProfileUpdate'}},
    {index : 5, title : '문의/신고', linkTo : {name :'MyProfileUpdate'}}
];

// mypage nav sub
export const mypageNavSub = [
    { tab: 1, index: 1, title: '회원정보 수정', linkTo: {name :'MyProfileUpdate'} },
    { tab: 1, index: 2, title: '비밀번호 변경', linkTo: {name : 'MyPasswordUpdate'} },
    { tab: 3, index: 1, title: '즐겨찾기', linkTo: {name :'MyProfileUpdate'} },
    { tab: 3, index: 2, title: '내가 쓴 댓글', linkTo: {name :'MyProfileUpdate'} },
    { tab: 4, index: 1, title: '내가 쓴 게시글', linkTo: {name :'MyProfileUpdate'} },
    { tab: 4, index: 2, title: '내가 쓴 댓글', linkTo: {name :'MyProfileUpdate'} },
    { tab: 5, index: 1, title: '문의', linkTo: {name :'MyProfileUpdate'} },
    { tab: 5, index: 2, title: '신고', linkTo: {name :'MyProfileUpdate'} }
];

// admin 회원관리
export const userManagerNav = [
    {index : 1 , title : '회원정보', linkTo : {name : 'UserManagement'}},
    {index : 2 , title : '포인트', linkTo : {name : 'UserPointManagement'}}
];

