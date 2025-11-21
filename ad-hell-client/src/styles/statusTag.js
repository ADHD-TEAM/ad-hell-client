// 태그 사용 예시
// <el-tag round><strong>답변완료</strong></el-tag>
// <el-tag type="warning" round><strong>답변 대기중</strong></el-tag>

// 회원 상태 tag
export const USER_STATUS_TAG = {
  active : { type: '',label: '활성'}
  , deactive : { type: 'info',label: '비활성'}
  , withdraw : { type: 'danger', label: '탈퇴' }
};

// 포인트 타입 tag
export const POINT_TYPE_TAG = {
    earned : {type : 'success', label : '적립'}
    , used :  {type : 'danger', label : '사용'}
}

// 문의 상태 tag
export const INQUIRY_STATUS_TAG = {
    completed : {type : '', label : '답변완료'}
    , used :  {type : 'info', label : '사용'}
}
// 공통(활성화/ 비활성화) 상태 tag
export const COMMON_STATUS_TAG = {
    active : { type: '',label: '활성'}
    , deactive : { type: 'info',label: '비활성'}
}
// 알림 상태 tag
export const NOTIFICATION_STATUS_TAG = {
    read_select : { type: '',label: '읽음'}
    , read : { type: 'info',label: '읽음'}
    , unread_select : { type: 'warning',label: '읽지않음'}
    , unread : { type: 'info',label: '읽지않음'}
}


