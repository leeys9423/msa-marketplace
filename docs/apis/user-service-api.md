# 사용자 서비스 (User Service) API 문서

사용자 서비스는 이커머스 마켓플레이스의 일반 고객과 판매자를 위한 사용자 관리 및 인증을 담당합니다.

## 기본 URL

```
/api
```

## 인증

회원가입 및 로그인을 제외한 모든 엔드포인트는 JWT 토큰을 사용한 인증이 필요합니다.

- `Authorization` 헤더에 토큰 포함: `Bearer YOUR_TOKEN`

## API 엔드포인트

### 고객 계정 관리

#### 고객 회원가입

새로운 고객 계정을 생성합니다.

```
POST /members
```

**요청 본문:**

```json
{
  "username": "example_user",
  "password": "securePassword123",
  "email": "user@example.com",
  "name": "홍길동",
  "addressLine1": "서울특별시 강남구 테헤란로 123",
  "addressLine2": "456호",
  "postalCode": "06234"
}
```

**응답 (201 Created):**

```json
{
  "id": 1,
  "username": "example_user",
  "email": "user@example.com",
  "name": "홍길동",
  "created_at": "2025-05-14T10:30:00Z"
}
```

**오류 응답:**

- `400 Bad Request` - 잘못된 입력 매개변수
- `409 Conflict` - 사용자명 또는 이메일이 이미 존재함

#### 고객 로그인

인증 및 JWT 토큰 발급.

```
POST /members/login
```

**요청 본문:**

```json
{
  "username": "example_user",
  "password": "securePassword123"
}
```

**응답 (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "refresh_token": "eyfgciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**오류 응답:**

- `401 Unauthorized` - 잘못된 인증 정보

#### 고객 프로필 조회

고객 프로필 정보를 조회합니다.

```
GET /members/me
```

**응답 (200 OK):**

```json
{
  "id": 1,
  "username": "example_user",
  "email": "user@example.com",
  "name": "홍길동",
  "addressLine1": "서울특별시 강남구 테헤란로 123",
  "addressLine2": "456호",
  "postalCode": "06234",
  "created_at": "2025-05-14T10:30:00Z",
  "updated_at": "2025-05-14T10:30:00Z"
}
```

**오류 응답:**

- `401 Unauthorized` - 인증 필요
- `404 Not Found` - 회원을 찾을 수 없음

#### 고객 프로필 수정

고객 프로필 정보를 수정합니다.

```
PUT /members/me
```

**요청 본문:**

```json
{
  "name": "김철수",
  "addressLine1": "서울특별시 서초구 강남대로 456",
  "addressLine2": "789동 101호",
  "postalCode": "06643"
}
```

**응답 (200 OK):**

```json
{
  "id": 1,
  "username": "example_user",
  "email": "user@example.com",
  "name": "김철수",
  "addressLine1": "서울특별시 서초구 강남대로 456",
  "addressLine2": "789동 101호",
  "postalCode": "06643",
  "updated_at": "2025-05-14T11:45:00Z"
}
```

**오류 응답:**

- `400 Bad Request` - 잘못된 입력 매개변수
- `401 Unauthorized` - 인증 필요
- `404 Not Found` - 회원을 찾을 수 없음

#### 비밀번호 변경

고객 비밀번호를 변경합니다.

```
PUT /members/me/password
```

**요청 본문:**

```json
{
  "currentPassword": "securePassword123",
  "newPassword": "newSecurePassword456"
}
```

**응답 (200 OK):**

```json
{
  "message": "비밀번호가 성공적으로 변경되었습니다"
}
```

**오류 응답:**

- `400 Bad Request` - 비밀번호가 보안 요구사항을 충족하지 않음
- `401 Unauthorized` - 현재 비밀번호가 올바르지 않음
- `404 Not Found` - 회원을 찾을 수 없음

#### 고객 주문 조회

고객의 주문 목록을 조회합니다.

```
GET /members/me/orders
```

**쿼리 매개변수:**

- `page` (선택 사항) - 페이지 번호 (기본값: 0)
- `size` (선택 사항) - 페이지 크기 (기본값: 20)
- `status` (선택 사항) - 주문 상태별 필터링

**응답 (200 OK):**

```json
{
  "content": [
    {
      "id": 123,
      "orderNumber": "ORD-2025-12345",
      "totalAmount": 154.99,
      "status": "delivered",
      "createdAt": "2025-05-10T15:30:00Z"
    },
    {
      "id": 122,
      "orderNumber": "ORD-2025-12344",
      "totalAmount": 79.99,
      "status": "shipping",
      "createdAt": "2025-05-05T09:15:00Z"
    }
  ],
  "pageable": {
    "page": 0,
    "size": 20,
    "total": 2
  }
}
```

**오류 응답:**

- `401 Unauthorized` - 인증 필요

### 소셜 로그인

#### 소셜 로그인 시작

소셜 로그인 프로세스를 시작합니다.

```
GET /auth/social/{provider}
```

**경로 매개변수:**

- `provider` - 소셜 제공자 이름 (google, kakao, naver)

**응답:**

- 소셜 제공자의 인증 페이지로 리다이렉트

#### 소셜 로그인 콜백

소셜 로그인 제공자로부터의 콜백을 처리합니다.

```
GET /auth/social/{provider}/callback
```

**경로 매개변수:**

- `provider` - 소셜 제공자 이름 (google, kakao, naver)

**쿼리 매개변수:**

- `code` - 제공자로부터의 인증 코드
- `state` (선택 사항) - CSRF 보호를 위한 상태 값

**응답 (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "refresh_token": "eyfgciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**오류 응답:**

- `400 Bad Request` - 잘못된 코드 또는 상태
- `401 Unauthorized` - 인증 실패

#### 연결된 소셜 계정 조회

연결된 소셜 계정 목록을 조회합니다.

```
GET /members/me/social-logins
```

**응답 (200 OK):**

```json
[
  {
    "id": 1,
    "provider": "google",
    "createdAt": "2025-05-01T10:15:00Z"
  },
  {
    "id": 2,
    "provider": "kakao",
    "createdAt": "2025-05-10T14:20:00Z"
  }
]
```

**오류 응답:**

- `401 Unauthorized` - 인증 필요

#### 소셜 계정 연결

현재 회원에게 새 소셜 계정을 연결합니다.

```
POST /members/me/social-logins
```

**요청 본문:**

```json
{
  "provider": "naver",
  "providerToken": "PROVIDER_ACCESS_TOKEN"
}
```

**응답 (201 Created):**

```json
{
  "id": 3,
  "provider": "naver",
  "createdAt": "2025-05-14T12:30:00Z"
}
```

**오류 응답:**

- `400 Bad Request` - 잘못된 제공자 또는 토큰
- `401 Unauthorized` - 인증 필요
- `409 Conflict` - 소셜 계정이 이미 연결됨

#### 소셜 계정 연결 해제

연결된 소셜 계정을 제거합니다.

```
DELETE /members/me/social-logins/{id}
```

**경로 매개변수:**

- `id` - 연결 해제할 소셜 로그인 ID

**응답 (204 No Content)**

**오류 응답:**

- `401 Unauthorized` - 인증 필요
- `404 Not Found` - 소셜 로그인을 찾을 수 없음

### 판매자 기업 관리

#### 판매자 기업 등록

새로운 판매자 기업을 등록합니다.

```
POST /enterprises
```

**요청 본문:**

```json
{
  "businessName": "예제 스토어",
  "businessRegistrationNumber": "123-45-67890",
  "addressLine1": "서울특별시 강남구 삼성로 789",
  "addressLine2": "12층",
  "postalCode": "06321"
}
```

**응답 (201 Created):**

```json
{
  "id": 1,
  "businessName": "예제 스토어",
  "businessRegistrationNumber": "123-45-67890",
  "verificationStatus": "pending",
  "createdAt": "2025-05-14T13:45:00Z"
}
```

**오류 응답:**

- `400 Bad Request` - 잘못된 입력 매개변수
- `409 Conflict` - 사업자등록번호가 이미 존재함

#### 판매자 기업 정보 조회

판매자 기업 정보를 조회합니다.

```
GET /enterprises/{id}
```

**경로 매개변수:**

- `id` - 기업 ID

**응답 (200 OK):**

```json
{
  "id": 1,
  "businessName": "예제 스토어",
  "businessRegistrationNumber": "123-45-67890",
  "addressLine1": "서울특별시 강남구 삼성로 789",
  "addressLine2": "12층",
  "postalCode": "06321",
  "verificationStatus": "verified",
  "createdAt": "2025-05-14T13:45:00Z",
  "updatedAt": "2025-05-14T14:30:00Z"
}
```

**오류 응답:**

- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 권한 부족
- `404 Not Found` - 기업을 찾을 수 없음

#### 판매자 기업 정보 수정

판매자 기업 정보를 수정합니다.

```
PUT /enterprises/{id}
```

**경로 매개변수:**

- `id` - 기업 ID

**요청 본문:**

```json
{
  "businessName": "예제 스토어 업데이트",
  "addressLine1": "서울특별시 강남구 테헤란로 456",
  "addressLine2": "14층",
  "postalCode": "06321"
}
```

**응답 (200 OK):**

```json
{
  "id": 1,
  "businessName": "예제 스토어 업데이트",
  "businessRegistrationNumber": "123-45-67890",
  "addressLine1": "서울특별시 강남구 테헤란로 456",
  "addressLine2": "14층",
  "postalCode": "06321",
  "verificationStatus": "verified",
  "updatedAt": "2025-05-14T15:30:00Z"
}
```

**오류 응답:**

- `400 Bad Request` - 잘못된 입력 매개변수
- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 권한 부족
- `404 Not Found` - 기업을 찾을 수 없음

#### 판매자 기업 인증 요청

판매자 기업에 대한 인증 요청을 제출합니다.

```
POST /enterprises/{id}/verify
```

**경로 매개변수:**

- `id` - 기업 ID

**요청 본문:**

```json
{
  "verificationDocuments": [
    {
      "type": "business_license",
      "fileUrl": "https://storage.example.com/documents/license.pdf"
    },
    {
      "type": "id_card",
      "fileUrl": "https://storage.example.com/documents/id.jpg"
    }
  ]
}
```

**응답 (202 Accepted):**

```json
{
  "message": "인증 요청이 성공적으로 제출되었습니다",
  "verificationStatus": "pending"
}
```

**오류 응답:**

- `400 Bad Request` - 잘못된 문서 유형 또는 URL
- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 권한 부족
- `404 Not Found` - 기업을 찾을 수 없음

### 판매자 계정 관리

#### 판매자 계정 생성

기업에 대한 새 판매자 계정을 생성합니다.

```
POST /enterprises/{id}/seller-accounts
```

**경로 매개변수:**

- `id` - 기업 ID

**요청 본문:**

```json
{
  "username": "seller_user",
  "password": "secureSellerPwd123",
  "email": "seller@example.com",
  "name": "김판매",
  "role": "owner"
}
```

**응답 (201 Created):**

```json
{
  "id": 1,
  "enterpriseId": 1,
  "username": "seller_user",
  "email": "seller@example.com",
  "name": "김판매",
  "role": "owner",
  "createdAt": "2025-05-14T16:15:00Z"
}
```

**오류 응답:**

- `400 Bad Request` - 잘못된 입력 매개변수
- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 권한 부족
- `404 Not Found` - 기업을 찾을 수 없음
- `409 Conflict` - 사용자명 또는 이메일이 이미 존재함

#### 판매자 계정 목록 조회

기업의 판매자 계정 목록을 조회합니다.

```
GET /enterprises/{id}/seller-accounts
```

**경로 매개변수:**

- `id` - 기업 ID

**쿼리 매개변수:**

- `page` (선택 사항) - 페이지 번호 (기본값: 0)
- `size` (선택 사항) - 페이지 크기 (기본값: 20)

**응답 (200 OK):**

```json
{
  "content": [
    {
      "id": 1,
      "username": "seller_user",
      "email": "seller@example.com",
      "name": "김판매",
      "role": "owner",
      "createdAt": "2025-05-14T16:15:00Z"
    },
    {
      "id": 2,
      "username": "staff_user",
      "email": "staff@example.com",
      "name": "이직원",
      "role": "staff",
      "createdAt": "2025-05-14T17:30:00Z"
    }
  ],
  "pageable": {
    "page": 0,
    "size": 20,
    "total": 2
  }
}
```

**오류 응답:**

- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 권한 부족
- `404 Not Found` - 기업을 찾을 수 없음

#### 판매자 계정 수정

판매자 계정을 수정합니다.

```
PUT /seller-accounts/{id}
```

**경로 매개변수:**

- `id` - 판매자 계정 ID

**요청 본문:**

```json
{
  "email": "seller_updated@example.com",
  "name": "김판매수정"
}
```

**응답 (200 OK):**

```json
{
  "id": 1,
  "enterpriseId": 1,
  "username": "seller_user",
  "email": "seller_updated@example.com",
  "name": "김판매수정",
  "role": "owner",
  "updatedAt": "2025-05-14T18:20:00Z"
}
```

**오류 응답:**

- `400 Bad Request` - 잘못된 입력 매개변수
- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 권한 부족
- `404 Not Found` - 판매자 계정을 찾을 수 없음

#### 판매자 역할 변경

판매자 계정의 역할을 변경합니다.

```
PUT /seller-accounts/{id}/role
```

**경로 매개변수:**

- `id` - 판매자 계정 ID

**요청 본문:**

```json
{
  "role": "staff"
}
```

**응답 (200 OK):**

```json
{
  "id": 1,
  "username": "seller_user",
  "role": "staff",
  "updatedAt": "2025-05-14T19:10:00Z"
}
```

**오류 응답:**

- `400 Bad Request` - 잘못된 역할
- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 권한 부족 (역할 변경은 소유자만 가능)
- `404 Not Found` - 판매자 계정을 찾을 수 없음

## 오류 응답

모든 엔드포인트는 다음과 같은 형식의 표준 오류 응답을 반환합니다:

```json
{
  "timestamp": "2025-05-14T20:00:00.000Z",
  "status": 400,
  "error": "Bad Request",
  "message": "회원가입 요청 객체의 유효성 검사 실패",
  "path": "/api/members",
  "details": [
    {
      "field": "email",
      "message": "유효한 이메일 주소여야 합니다"
    }
  ]
}
```

## 도메인 이벤트

사용자 서비스는 다음과 같은 이벤트를 이벤트 버스에 발행합니다:

| 이벤트 | 페이로드 | 설명 |
| ------ | ------- | ---- |
| MemberCreated | {memberId, email, name} | 새 고객이 생성되었을 때 |
| MemberUpdated | {memberId, updatedFields[]} | 고객 정보가 업데이트되었을 때 |
| MemberDisabled | {memberId, reason} | 고객 계정이 비활성화되었을 때 |
| EnterpriseCreated | {enterpriseId, businessName} | 새 판매자 기업이 생성되었을 때 |
| EnterpriseVerified | {enterpriseId, verificationDate} | 판매자 기업이 인증되었을 때 |
| SellerAccountCreated | {sellerId, enterpriseId, role} | 새 판매자 계정이 생성되었을 때 |
