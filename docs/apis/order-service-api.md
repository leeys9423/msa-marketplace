# 주문 서비스 (Order Service) API 문서

주문 서비스는 이커머스 마켓플레이스에서 고객의 주문, 주문 생명주기 및 배송 정보를 관리합니다.

## 기본 URL

```
/api
```

## 인증

모든 엔드포인트는 JWT 토큰을 사용한 인증이 필요합니다.

- `Authorization` 헤더에 토큰 포함: `Bearer YOUR_TOKEN`

## API 엔드포인트

### 주문 관리

#### 주문 생성

새로운 주문을 생성합니다.

```
POST /orders
```

**요청 본문:**

```json
{
  "deliveryAddressId": 5,
  "orderMemo": "문 앞에 배송 부탁드립니다",
  "items": [
    {
      "productId": "60a1e2c87c21f32a4c88b4a5",
      "quantity": 1
    },
    {
      "productId": "60a1e2c87c21f32a4c88b4a6",
      "quantity": 2
    }
  ]
}
```

**응답 (201 Created):**

```json
{
  "id": 123,
  "orderNumber": "ORD-2025-12345",
  "status": "pending",
  "subtotalAmount": 149.97,
  "shippingFee": 5.00,
  "discountAmount": 0.00,
  "totalAmount": 154.97,
  "recipientName": "홍길동",
  "recipientPhone": "010-1234-5678",
  "deliveryAddressId": 5,
  "deliveryAddress": {
    "addressLine1": "서울특별시 강남구 테헤란로 123",
    "addressLine2": "456호",
    "postalCode": "06234"
  },
  "orderMemo": "문 앞에 배송 부탁드립니다",
  "paymentDueDate": "2025-05-14T23:59:59Z",
  "items": [
    {
      "id": 456,
      "productId": "60a1e2c87c21f32a4c88b4a5",
      "productName": "무선 블루투스 헤드폰",
      "productOption": "블랙",
      "quantity": 1,
      "unitPrice": 99.99,
      "totalPrice": 99.99,
      "itemStatus": "pending",
      "enterpriseId": "123"
    },
    {
      "id": 457,
      "productId": "60a1e2c87c21f32a4c88b4a6",
      "productName": "스마트폰 충전 독",
      "productOption": "",
      "quantity": 2,
      "unitPrice": 24.99,
      "totalPrice": 49.98,
      "itemStatus": "pending",
      "enterpriseId": "456"
    }
  ],
  "createdAt": "2025-05-14T10:30:00Z"
}
```

**오류 응답:**

- `400 Bad Request` - 잘못된 입력 매개변수
- `401 Unauthorized` - 인증 필요
- `404 Not Found` - 배송지 또는 상품을 찾을 수 없음

#### 주문 목록 조회

주문 목록을 조회합니다.

```
GET /orders
```

**쿼리 매개변수:**

- `page` (선택 사항) - 페이지 번호 (기본값: 0)
- `size` (선택 사항) - 페이지 크기 (기본값: 20)
- `status` (선택 사항) - 주문 상태별 필터링
- `startDate` & `endDate` (선택 사항) - 날짜 범위 필터링

**응답 (200 OK):**

```json
{
  "content": [
    {
      "id": 123,
      "orderNumber": "ORD-2025-12345",
      "status": "paid",
      "totalAmount": 154.97,
      "createdAt": "2025-05-14T10:30:00Z",
      "updatedAt": "2025-05-14T10:45:00Z",
      "itemCount": 2
    },
    {
      "id": 122,
      "orderNumber": "ORD-2025-12344",
      "status": "delivered",
      "totalAmount": 79.99,
      "createdAt": "2025-05-10T15:30:00Z",
      "updatedAt": "2025-05-12T09:00:00Z",
      "itemCount": 1
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

- `400 Bad Request` - 잘못된 쿼리 매개변수
- `401 Unauthorized` - 인증 필요

#### 주문 상세 조회

특정 주문의 상세 정보를 조회합니다.

```
GET /orders/{id}
```

**경로 매개변수:**

- `id` - 주문 ID

**응답 (200 OK):**

```json
{
  "id": 123,
  "orderNumber": "ORD-2025-12345",
  "status": "paid",
  "subtotalAmount": 149.97,
  "shippingFee": 5.00,
  "discountAmount": 0.00,
  "totalAmount": 154.97,
  "recipientName": "홍길동",
  "recipientPhone": "010-1234-5678",
  "deliveryAddress": {
    "addressLine1": "서울특별시 강남구 테헤란로 123",
    "addressLine2": "456호",
    "postalCode": "06234"
  },
  "orderMemo": "문 앞에 배송 부탁드립니다",
  "paymentStatus": "completed",
  "paymentId": 789,
  "items": [
    {
      "id": 456,
      "productId": "60a1e2c87c21f32a4c88b4a5",
      "productName": "무선 블루투스 헤드폰",
      "productOption": "블랙",
      "quantity": 1,
      "unitPrice": 99.99,
      "totalPrice": 99.99,
      "itemStatus": "preparing",
      "enterpriseId": "123"
    },
    {
      "id": 457,
      "productId": "60a1e2c87c21f32a4c88b4a6",
      "productName": "스마트폰 충전 독",
      "productOption": "",
      "quantity": 2,
      "unitPrice": 24.99,
      "totalPrice": 49.98,
      "itemStatus": "preparing",
      "enterpriseId": "456"
    }
  ],
  "statusLogs": [
    {
      "fromStatus": "pending",
      "toStatus": "paid",
      "changedBy": "system",
      "changeReason": "payment_completed",
      "eventSource": "payment",
      "createdAt": "2025-05-14T10:45:00Z"
    }
  ],
  "createdAt": "2025-05-14T10:30:00Z",
  "updatedAt": "2025-05-14T10:45:00Z"
}
```

**오류 응답:**

- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 권한 부족
- `404 Not Found` - 주문을 찾을 수 없음

#### 주문 취소

주문을 취소합니다.

```
PUT /orders/{id}/cancel
```

**경로 매개변수:**

- `id` - 주문 ID

**요청 본문:**

```json
{
  "reason": "changed_mind",
  "detail": "다른 제품으로 주문 예정"
}
```

**응답 (200 OK):**

```json
{
  "id": 123,
  "orderNumber": "ORD-2025-12345",
  "status": "canceled",
  "cancelReason": "changed_mind",
  "cancelDetail": "다른 제품으로 주문 예정",
  "updatedAt": "2025-05-14T11:15:00Z"
}
```

**오류 응답:**

- `400 Bad Request` - 잘못된 취소 이유
- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 권한 부족
- `404 Not Found` - 주문을 찾을 수 없음
- `409 Conflict` - 이미 배송 중이거나 완료된 주문

#### 주문 상태 변경 (어드민용)

주문의 상태를 변경합니다 (관리자 전용).

```
PUT /orders/{id}/status
```

**경로 매개변수:**

- `id` - 주문 ID

**요청 본문:**

```json
{
  "status": "preparing",
  "reason": "product_verified"
}
```

**응답 (200 OK):**

```json
{
  "id": 123,
  "orderNumber": "ORD-2025-12345",
  "status": "preparing",
  "updatedAt": "2025-05-14T12:00:00Z"
}
```

**오류 응답:**

- `400 Bad Request` - 잘못된 상태 또는 상태 전환이 허용되지 않음
- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 관리자 권한 필요
- `404 Not Found` - 주문을 찾을 수 없음

### 배송지 관리

#### 배송지 목록 조회

회원의 배송지 목록을 조회합니다.

```
GET /delivery-addresses
```

**응답 (200 OK):**

```json
[
  {
    "id": 5,
    "recipientName": "홍길동",
    "recipientPhone": "010-1234-5678",
    "addressLine1": "서울특별시 강남구 테헤란로 123",
    "addressLine2": "456호",
    "postalCode": "06234",
    "isDefault": true,
    "createdAt": "2025-04-01T09:00:00Z",
    "updatedAt": "2025-04-01T09:00:00Z"
  },
  {
    "id": 6,
    "recipientName": "홍길동",
    "recipientPhone": "010-1234-5678",
    "addressLine1": "경기도 성남시 분당구 판교로 123",
    "addressLine2": "789동 101호",
    "postalCode": "13487",
    "isDefault": false,
    "createdAt": "2025-04-05T14:30:00Z",
    "updatedAt": "2025-04-05T14:30:00Z"
  }
]
```

**오류 응답:**

- `401 Unauthorized` - 인증 필요

#### 배송지 추가

새 배송지를 추가합니다.

```
POST /delivery-addresses
```

**요청 본문:**

```json
{
  "recipientName": "김철수",
  "recipientPhone": "010-9876-5432",
  "addressLine1": "서울특별시 송파구 올림픽로 123",
  "addressLine2": "아파트 456동 789호",
  "postalCode": "05500",
  "isDefault": false
}
```

**응답 (201 Created):**

```json
{
  "id": 7,
  "recipientName": "김철수",
  "recipientPhone": "010-9876-5432",
  "addressLine1": "서울특별시 송파구 올림픽로 123",
  "addressLine2": "아파트 456동 789호",
  "postalCode": "05500",
  "isDefault": false,
  "createdAt": "2025-05-14T13:30:00Z",
  "updatedAt": "2025-05-14T13:30:00Z"
}
```

**오류 응답:**

- `400 Bad Request` - 잘못된 입력 매개변수
- `401 Unauthorized` - 인증 필요

#### 배송지 수정

기존 배송지를 수정합니다.

```
PUT /delivery-addresses/{id}
```

**경로 매개변수:**

- `id` - 배송지 ID

**요청 본문:**

```json
{
  "recipientName": "김철수",
  "recipientPhone": "010-9876-5432",
  "addressLine1": "서울특별시 송파구 올림픽로 456",
  "addressLine2": "아파트 789동 123호",
  "postalCode": "05500",
  "isDefault": true
}
```

**응답 (200 OK):**

```json
{
  "id": 7,
  "recipientName": "김철수",
  "recipientPhone": "010-9876-5432",
  "addressLine1": "서울특별시 송파구 올림픽로 456",
  "addressLine2": "아파트 789동 123호",
  "postalCode": "05500",
  "isDefault": true,
  "updatedAt": "2025-05-14T14:00:00Z"
}
```

**오류 응답:**

- `400 Bad Request` - 잘못된 입력 매개변수
- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 권한 부족
- `404 Not Found` - 배송지를 찾을 수 없음

#### 배송지 삭제

배송지를 삭제합니다.

```
DELETE /delivery-addresses/{id}
```

**경로 매개변수:**

- `id` - 배송지 ID

**응답 (204 No Content)**

**오류 응답:**

- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 권한 부족
- `404 Not Found` - 배송지를 찾을 수 없음
- `409 Conflict` - 진행 중인 주문에 사용 중인 배송지

## 오류 응답

모든 엔드포인트는 다음과 같은 형식의 표준 오류 응답을 반환합니다:

```json
{
  "timestamp": "2025-05-14T20:00:00.000Z",
  "status": 400,
  "error": "Bad Request",
  "message": "주문 생성 요청 객체의 유효성 검사 실패",
  "path": "/api/orders",
  "details": [
    {
      "field": "items",
      "message": "최소 하나 이상의 상품이 필요합니다"
    }
  ]
}
```

## 도메인 이벤트

주문 서비스는 다음과 같은 이벤트를 이벤트 버스에 발행합니다:

| 이벤트 | 페이로드 | 설명 |
| ------ | ------- | ---- |
| OrderCreated | {orderId, orderNumber, memberId, totalAmount, items[]} | 주문이 생성되었을 때 |
| OrderStatusChanged | {orderId, oldStatus, newStatus, reason} | 주문 상태가 변경되었을 때 |
| OrderCancellationRequested | {orderId, reason} | 주문 취소가 요청되었을 때 |
| OrderCanceled | {orderId, reason} | 주문이 취소되었을 때 |
