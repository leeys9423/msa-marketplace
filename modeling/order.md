# 주문 서비스 (Order Service)

## 개요

주문 서비스는 이커머스 마켓플레이스에서 고객의 주문을 관리하는 독립적인 마이크로서비스입니다. 이 서비스는 주문 생성부터 배송 관리까지 주문 생명주기 전체를 담당합니다.

## 주요 책임

- 주문 생성 및 관리
- 주문 상태 트래킹
- 배송 정보 관리
- 주문 취소 및 변경 처리
- 주문 이력 관리

## 데이터 모델

```mermaid
erDiagram
    %% 주문 서비스 (Order Service)
    members ||--o{ orders : "주문"
    orders ||--|{ order_items : "포함"
    members ||--o{ delivery_addresses : "보유"
    orders ||--o| delivery_addresses : "배송"
    orders ||--o{ order_status_logs : "이력"

    %% 회원 (참조용 간소화)
    members {
        int id PK "회원 ID"
        string username "사용자명"
    }

    %% 주문 관련 테이블
    orders {
        int id PK "주문 ID"
        string order_number "주문 번호 (표시용)"
        int member_id FK "주문자 ID"
        string status "주문 상태"
        decimal subtotal_amount "상품 총액"
        decimal shipping_fee "배송비"
        decimal discount_amount "할인 금액"
        decimal total_amount "최종 결제 금액"
        int delivery_address_id FK "배송지 ID"
        string recipient_name "수령인 이름"
        string recipient_phone "수령인 연락처"
        text order_memo "주문 메모"
        bigint payment_id "결제 ID (결제 서비스 참조)"
        string payment_status "결제 상태 (캐시)"
        timestamp payment_due_date "결제 기한"
        timestamp created_at "주문 생성 시간"
        timestamp updated_at "주문 정보 수정 시간"
    }

    order_items {
        int id PK "주문 상품 ID"
        int order_id FK "주문 ID"
        string product_id "상품 ID (MongoDB 참조)"
        string product_name "상품명 (주문 시점)"
        string product_option "상품 옵션 (주문 시점)"
        int quantity "수량"
        decimal unit_price "단가 (주문 시점)"
        decimal total_price "상품별 총 가격"
        string item_status "상품별 상태"
        string enterprise_id "판매자 ID (주문 시점)"
        timestamp created_at "생성 시간"
    }

    order_status_logs {
        int id PK "로그 ID"
        int order_id FK "주문 ID"
        string from_status "이전 상태"
        string to_status "변경 상태"
        string changed_by "변경자 (user_id 또는 system)"
        text change_reason "변경 사유"
        string event_source "이벤트 소스 (order, payment 등)"
        timestamp created_at "변경 시간"
    }

    delivery_addresses {
        int id PK "배송지 ID"
        int member_id FK "회원 ID"
        string recipient_name "수령인 이름"
        string recipient_phone "수령인 연락처"
        string address_line1 "기본 주소"
        string address_line2 "상세 주소"
        string postal_code "우편번호"
        boolean is_default "기본 배송지 여부"
        timestamp created_at "생성 시간"
        timestamp updated_at "수정 시간"
    }
```

## 주문 상태 흐름

```
pending → paid → preparing → shipping → delivered
        ↘ canceled
```

| 상태      | 설명                      |
| --------- | ------------------------- |
| pending   | 주문 생성됨, 결제 대기 중 |
| paid      | 결제 완료됨               |
| preparing | 상품 준비 중              |
| shipping  | 배송 중                   |
| delivered | 배송 완료                 |
| canceled  | 주문 취소됨               |

## 발행 이벤트

주문 서비스는 다음과 같은 도메인 이벤트를 발행합니다:

| 이벤트                     | 페이로드                                               | 설명                      |
| -------------------------- | ------------------------------------------------------ | ------------------------- |
| OrderCreated               | {orderId, orderNumber, memberId, totalAmount, items[]} | 주문이 생성되었을 때      |
| OrderStatusChanged         | {orderId, oldStatus, newStatus, reason}                | 주문 상태가 변경되었을 때 |
| OrderCancellationRequested | {orderId, reason}                                      | 주문 취소가 요청되었을 때 |
| OrderCanceled              | {orderId, reason}                                      | 주문이 취소되었을 때      |

## 구독 이벤트

주문 서비스는 다음과 같은 외부 이벤트를 구독합니다:

| 이벤트                | 소스        | 처리                                    |
| --------------------- | ----------- | --------------------------------------- |
| PaymentCompleted      | 결제 서비스 | 주문 상태를 'paid'로 업데이트           |
| PaymentFailed         | 결제 서비스 | 주문 상태를 'payment_failed'로 업데이트 |
| PaymentCanceled       | 결제 서비스 | 결제 취소 정보 업데이트                 |
| PaymentRefunded       | 결제 서비스 | 환불 정보 업데이트                      |
| ProductStockConfirmed | 상품 서비스 | 재고 확인 완료 처리                     |

## API 엔드포인트

```
# 주문 관리
POST /api/orders                # 주문 생성
GET /api/orders                 # 주문 목록 조회
GET /api/orders/{id}            # 주문 상세 조회
PUT /api/orders/{id}/cancel     # 주문 취소
PUT /api/orders/{id}/status     # 주문 상태 변경 (어드민용)

# 배송지 관리
GET /api/delivery-addresses     # 배송지 목록 조회
POST /api/delivery-addresses    # 배송지 추가
PUT /api/delivery-addresses/{id}# 배송지 수정
DELETE /api/delivery-addresses/{id} # 배송지 삭제
```

## 주문 생성 프로세스

```mermaid
sequenceDiagram
    participant Client
    participant OS as Order Service
    participant PS as Product Service
    participant Kafka as Event Bus

    Client->>OS: 1. 주문 생성 요청
    OS->>PS: 2. 상품 정보 및 재고 확인
    PS-->>OS: 3. 상품 정보 및 재고 응답
    OS->>OS: 4. 주문 엔티티 생성 (status: pending)
    OS-->>Client: 5. 주문 생성 완료 응답
    OS->>Kafka: 6. OrderCreated 이벤트 발행
```

## 기술 스택

- **언어/프레임워크**: Java 17, Spring Boot 3.x
- **데이터베이스**: PostgreSQL
- **메시지 브로커**: Apache Kafka
- **API 문서화**: Swagger/OpenAPI
- **테스트**: JUnit 5, TestContainers

## 의존성

- **외부 서비스 의존성**:

  - 상품 서비스: 상품 정보 및 재고 확인
  - 결제 서비스: 결제 상태 연동
  - 회원 서비스: 회원 정보 및 인증

- **인프라 의존성**:
  - PostgreSQL: 주문 데이터 저장
  - Kafka: 이벤트 발행 및 구독
  - Redis: 분산 락 (동시성 제어용)

## 성능 요구사항

- 초당 최대 주문 처리량: 100 TPS
- 주문 생성 API 응답 시간: 99퍼센타일 500ms 이하
- 가용성 목표: 99.9%

## 모니터링 지표

- 초당 주문 생성 수
- 주문 상태별 분포
- 취소율
- API 응답 시간
- 이벤트 처리 지연시간

## 확장 고려사항

1. **멀티 벤더 지원**:

   - 단일 주문에 여러 판매자 상품 포함 시 주문 분할 처리

2. **부분 배송/취소 처리**:

   - 주문 아이템 별 상태 관리 확장

3. **국제 배송 지원**:

   - 국가별 배송 정책 및 주소 체계 지원

4. **대용량 처리**:
   - 주문 데이터 아카이빙 및 샤딩 전략
