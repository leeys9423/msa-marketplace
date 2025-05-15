# 결제 서비스 (Payment Service) API 문서

결제 서비스는 이커머스 마켓플레이스의 결제 처리 및 관리를 담당합니다.

## 기본 URL

```
/api
```

## 인증

모든 엔드포인트는 JWT 토큰을 사용한 인증이 필요합니다.

- `Authorization` 헤더에 토큰 포함: `Bearer YOUR_TOKEN`

## API 엔드포인트

### 결제 처리

#### 결제 처리 요청

새로운 결제를 처리합니다.

```
POST /payments
```

**요청 본문:**

```json
{
  "orderId": 123,
  "orderNumber": "ORD-2025-12345",
  "amount": 154.97,
  "paymentMethodId": 10,
  "pgProvider": "toss",
  "paymentType": "full"
}
```

**응답 (201 Created):**

```json
{
  "id": 789,
  "paymentNumber": "PAY-2025-78910",
  "orderId": 123,
  "orderNumber": "ORD-2025-12345",
  "memberId": 456,
  "status": "pending",
  "amount": 154.97,
  "pgProvider": "toss",
  "paymentMethodId": 10,
  "paymentType": "full",
  "pgRedirectUrl": "https://pg.example.com/toss/payment/redirect/12345",
  "createdAt": "2025-05-14T10:40:00Z"
}
```

**오류 응답:**

- `400 Bad Request` - 잘못된 입력 매개변수
- `401 Unauthorized` - 인증 필요
- `404 Not Found` - 주문 또는 결제 수단을 찾을 수 없음
- `409 Conflict` - 이미 처리 중인 결제가 있음

#### 결제 정보 조회

특정 결제의 정보를 조회합니다.

```
GET /payments/{id}
```

**경로 매개변수:**

- `id` - 결제 ID

**응답 (200 OK):**

```json
{
  "id": 789,
  "paymentNumber": "PAY-2025-78910",
  "orderId": 123,
  "orderNumber": "ORD-2025-12345",
  "memberId": 456,
  "status": "completed",
  "amount": 154.97,
  "pgProvider": "toss",
  "paymentMethodId": 10,
  "paymentMethod": {
    "id": 10,
    "methodType": "credit_card",
    "provider": "shinhan",
    "identifier": "45XX-XXXX-XXXX-1234",
    "isDefault": true
  },
  "paymentType": "full",
  "pgTransactionId": "toss_tx_12345678",
  "paymentData": {
    "cardApprovalNumber": "12345678",
    "installmentMonths": 0
  },
  "paidAt": "2025-05-14T10:45:00Z",
  "createdAt": "2025-05-14T10:40:00Z",
  "updatedAt": "2025-05-14T10:45:00Z"
}
```

**오류 응답:**

- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 권한 부족
- `404 Not Found` - 결제를 찾을 수 없음

#### 주문별 결제 내역 조회

주문에 대한 모든 결제 내역을 조회합니다.

```
GET /orders/{orderId}/payments
```

**경로 매개변수:**

- `orderId` - 주문 ID

**응답 (200 OK):**

```json
[
  {
    "id": 789,
    "paymentNumber": "PAY-2025-78910",
    "status": "completed",
    "amount": 154.97,
    "pgProvider": "toss",
    "paymentType": "full",
    "paidAt": "2025-05-14T10:45:00Z",
    "createdAt": "2025-05-14T10:40:00Z"
  }
]
```

**오류 응답:**

- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 권한 부족
- `404 Not Found` - 주문을 찾을 수 없음

### 환불 처리

#### 환불 요청

결제에 대한 환불을 요청합니다.

```
POST /payments/{id}/refund
```

**경로 매개변수:**

- `id` - 결제 ID

**요청 본문:**

```json
{
  "amount": 154.97,
  "reason": "order_canceled",
  "detail": "고객 요청으로 인한 주문 취소"
}
```

**응답 (201 Created):**

```json
{
  "id": 101,
  "refundNumber": "REF-2025-10101",
  "paymentId": 789,
  "orderId": 123,
  "status": "requested",
  "amount": 154.97,
  "refundReason": "order_canceled",
  "refundDetail": "고객 요청으로 인한 주문 취소",
  "refundMethod": "original_payment",
  "createdAt": "2025-05-14T11:30:00Z"
}
```

**오류 응답:**

- `400 Bad Request` - 잘못된 입력 매개변수 또는 환불 금액
- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 권한 부족
- `404 Not Found` - 결제를 찾을 수 없음
- `409 Conflict` - 결제가 완료되지 않았거나 이미 환불됨

#### 환불 정보 조회

특정 환불의 정보를 조회합니다.

```
GET /refunds/{id}
```

**경로 매개변수:**

- `id` - 환불 ID

**응답 (200 OK):**

```json
{
  "id": 101,
  "refundNumber": "REF-2025-10101",
  "paymentId": 789,
  "orderId": 123,
  "status": "completed",
  "amount": 154.97,
  "refundReason": "order_canceled",
  "refundDetail": "고객 요청으로 인한 주문 취소",
  "refundMethod": "original_payment",
  "refundData": {
    "pgTransactionId": "toss_refund_87654321",
    "originalPaymentInfo": {
      "method": "credit_card",
      "provider": "shinhan",
      "identifier": "45XX-XXXX-XXXX-1234"
    }
  },
  "completedAt": "2025-05-14T11:45:00Z",
  "createdAt": "2025-05-14T11:30:00Z",
  "updatedAt": "2025-05-14T11:45:00Z"
}
```

**오류 응답:**

- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 권한 부족
- `404 Not Found` - 환불을 찾을 수 없음

#### 결제별 환불 내역 조회

결제에 대한 모든 환불 내역을 조회합니다.

```
GET /payments/{id}/refunds
```

**경로 매개변수:**

- `id` - 결제 ID

**응답 (200 OK):**

```json
[
  {
    "id": 101,
    "refundNumber": "REF-2025-10101",
    "status": "completed",
    "amount": 154.97,
    "refundReason": "order_canceled",
    "completedAt": "2025-05-14T11:45:00Z",
    "createdAt": "2025-05-14T11:30:00Z"
  }
]
```

**오류 응답:**

- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 권한 부족
- `404 Not Found` - 결제를 찾을 수 없음

### 결제 수단 관리

#### 결제 수단 목록 조회

회원의 결제 수단 목록을 조회합니다.

```
GET /payment-methods
```

**응답 (200 OK):**

```json
[
  {
    "id": 10,
    "methodType": "credit_card",
    "provider": "shinhan",
    "identifier": "45XX-XXXX-XXXX-1234",
    "isDefault": true,
    "expiresAt": "2028-12-31T23:59:59Z",
    "createdAt": "2025-01-15T09:00:00Z"
  },
  {
    "id": 11,
    "methodType": "bank_transfer",
    "provider": "woori",
    "identifier": "XXXX-XX-XXXXXX",
    "isDefault": false,
    "createdAt": "2025-02-20T14:30:00Z"
  }
]
```

**오류 응답:**

- `401 Unauthorized` - 인증 필요

#### 결제 수단 등록

새 결제 수단을 등록합니다.

```
POST /payment-methods
```

**요청 본문:**

```json
{
  "methodType": "credit_card",
  "provider": "hyundai",
  "identifier": "52XX-XXXX-XXXX-5678",
  "extraData": {
    "cardholderName": "홍길동",
    "expiryMonth": 12,
    "expiryYear": 2029,
    "encryptedCVV": "암호화된_CVV_데이터"
  },
  "isDefault": false
}
```

**응답 (201 Created):**

```json
{
  "id": 12,
  "methodType": "credit_card",
  "provider": "hyundai",
  "identifier": "52XX-XXXX-XXXX-5678",
  "isDefault": false,
  "expiresAt": "2029-12-31T23:59:59Z",
  "createdAt": "2025-05-14T15:00:00Z",
  "updatedAt": "2025-05-14T15:00:00Z"
}
```

**오류 응답:**

- `400 Bad Request` - 잘못된 입력 매개변수
- `401 Unauthorized` - 인증 필요
- `422 Unprocessable Entity` - 유효하지 않은 결제 정보

#### 결제 수단 삭제

결제 수단을 삭제합니다.

```
DELETE /payment-methods/{id}
```

**경로 매개변수:**

- `id` - 결제 수단 ID

**응답 (204 No Content)**

**오류 응답:**

- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 권한 부족
- `404 Not Found` - 결제 수단을 찾을 수 없음
- `409 Conflict` - 진행 중인 결제에 사용 중인 결제 수단

#### 기본 결제 수단 설정

특정 결제 수단을 기본 결제 수단으로 설정합니다.

```
PUT /payment-methods/{id}/default
```

**경로 매개변수:**

- `id` - 결제 수단 ID

**응답 (200 OK):**

```json
{
  "id": 12,
  "methodType": "credit_card",
  "provider": "hyundai",
  "identifier": "52XX-XXXX-XXXX-5678",
  "isDefault": true,
  "updatedAt": "2025-05-14T16:00:00Z"
}
```

**오류 응답:**

- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 권한 부족
- `404 Not Found` - 결제 수단을 찾을 수 없음

## 결제 콜백 엔드포인트

PG사 결제 완료 후 처리를 위한 콜백 엔드포인트입니다.

```
GET /payments/callback/{pgProvider}
```

**경로 매개변수:**

- `pgProvider` - PG 제공자 (toss, kg_inicis, nice_pay, paypal)

**쿼리 매개변수:**
PG사 별로 다양한 쿼리 매개변수가 포함됩니다.

**응답:**
결제 결과 페이지로 리다이렉트

## 결제 웹훅 엔드포인트

PG사에서 보내는 웹훅을 처리하기 위한 엔드포인트입니다.

```
POST /payments/webhook/{pgProvider}
```

**경로 매개변수:**

- `pgProvider` - PG 제공자 (toss, kg_inicis, nice_pay, paypal)

**요청 본문:**
PG사 별로 다양한 JSON 포맷이 포함됩니다.

**응답 (200 OK):**

```json
{
  "received": true
}
```

## 관리자 기능

#### 결제 상태 관리 (어드민용)

결제 상태를 수동으로 변경합니다 (관리자 전용).

```
PUT /admin/payments/{id}/status
```

**경로 매개변수:**

- `id` - 결제 ID

**요청 본문:**

```json
{
  "status": "completed",
  "reason": "manual_approval",
  "pgTransactionId": "manual_tx_987654"
}
```

**응답 (200 OK):**

```json
{
  "id": 789,
  "paymentNumber": "PAY-2025-78910",
  "status": "completed",
  "updatedAt": "2025-05-14T17:00:00Z",
  "updatedBy": "admin_user"
}
```

**오류 응답:**

- `400 Bad Request` - 잘못된 상태 또는 상태 전환이 허용되지 않음
- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 관리자 권한 필요
- `404 Not Found` - 결제를 찾을 수 없음

#### 환불 상태 관리 (어드민용)

환불 상태를 수동으로 변경합니다 (관리자 전용).

```
PUT /admin/refunds/{id}/status
```

**경로 매개변수:**

- `id` - 환불 ID

**요청 본문:**

```json
{
  "status": "completed",
  "reason": "manual_approval",
  "pgTransactionId": "manual_refund_123456"
}
```

**응답 (200 OK):**

```json
{
  "id": 101,
  "refundNumber": "REF-2025-10101",
  "status": "completed",
  "updatedAt": "2025-05-14T17:30:00Z",
  "updatedBy": "admin_user"
}
```

**오류 응답:**

- `400 Bad Request` - 잘못된 상태 또는 상태 전환이 허용되지 않음
- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 관리자 권한 필요
- `404 Not Found` - 환불을 찾을 수 없음

## 결제 통계 (어드민용)

#### 결제 통계 조회

결제 관련 통계를 조회합니다 (관리자 전용).

```
GET /admin/payments/statistics
```

**쿼리 매개변수:**

- `startDate` - 시작 날짜 (YYYY-MM-DD)
- `endDate` - 종료 날짜 (YYYY-MM-DD)
- `pgProvider` (선택 사항) - PG 제공자 필터링
- `paymentMethodType` (선택 사항) - 결제 수단 유형 필터링

**응답 (200 OK):**

```json
{
  "totalPayments": 1250,
  "totalAmount": 1250000.00,
  "successfulPayments": 1200,
  "successRate": 96.0,
  "refundedPayments": 50,
  "refundedAmount": 45000.00,
  "refundRate": 3.6,
  "averageAmount": 1041.67,
  "byPaymentMethod": [
    {
      "methodType": "credit_card",
      "count": 900,
      "amount": 900000.00,
      "percentage": 72.0
    },
    {
      "methodType": "bank_transfer",
      "count": 200,
      "amount": 250000.00,
      "percentage": 20.0
    },
    {
      "methodType": "virtual_account",
      "count": 100,
      "amount": 100000.00,
      "percentage": 8.0
    }
  ],
  "byStatus": [
    {
      "status": "completed",
      "count": 1200,
      "amount": 1205000.00
    },
    {
      "status": "failed",
      "count": 50,
      "amount": 45000.00
    }
  ],
  "dailyTrends": [
    {
      "date": "2025-05-01",
      "count": 42,
      "amount": 38500.00
    },
    {
      "date": "2025-05-02",
      "count": 38,
      "amount": 42100.00
    }
  ]
}
```

**오류 응답:**

- `400 Bad Request` - 잘못된 쿼리 매개변수
- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 관리자 권한 필요

## 오류 응답

모든 엔드포인트는 다음과 같은 형식의 표준 오류 응답을 반환합니다:

```json
{
  "timestamp": "2025-05-14T20:00:00.000Z",
  "status": 400,
  "error": "Bad Request",
  "message": "결제 요청 객체의 유효성 검사 실패",
  "path": "/api/payments",
  "details": [
    {
      "field": "amount",
      "message": "0보다 커야 합니다"
    }
  ]
}
```

## 도메인 이벤트

결제 서비스는 다음과 같은 이벤트를 이벤트 버스에 발행합니다:

| 이벤트 | 페이로드 | 설명 |
| ------ | ------- | ---- |
| PaymentCreated | {paymentId, orderId, amount, method} | 결제가 생성되었을 때 |
| PaymentCompleted | {paymentId, orderId, pgTransactionId} | 결제가 완료되었을 때 |
| PaymentFailed | {paymentId, orderId, reason} | 결제가 실패했을 때 |
| PaymentCanceled | {paymentId, orderId} | 결제가 취소되었을 때 |
| RefundInitiated | {refundId, paymentId, orderId, amount} | 환불이 시작되었을 때 |
| RefundCompleted | {refundId, paymentId, orderId, amount} | 환불이 완료되었을 때 |
