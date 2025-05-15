# 상품 서비스 (Product Service) API 문서

상품 서비스는 마켓플레이스의 상품 카탈로그를 관리하고 상품 관련 기능을 처리합니다.

## 기본 URL

```
/api
```

## 인증

공개 상품 목록 및 검색 엔드포인트를 제외한 모든 엔드포인트는 JWT 토큰을 사용한 인증이 필요합니다.

- `Authorization` 헤더에 토큰 포함: `Bearer YOUR_TOKEN`

## API 엔드포인트

[앞 부분은 생략합니다...]

### 검색 및 필터링

#### 상품 검색

키워드 기반으로 상품을 검색합니다.

```
GET /products/search
```

**쿼리 매개변수:**

- `q` - 검색 쿼리
- `page` (선택 사항) - 페이지 번호 (기본값: 0)
- `size` (선택 사항) - 페이지 크기 (기본값: 20)
- `category` (선택 사항) - 카테고리 ID별 필터링
- `minPrice` & `maxPrice` (선택 사항) - 가격 범위별 필터링
- `sort` (선택 사항) - 정렬 기준 (relevance, price_asc, price_desc, newest)

**응답 (200 OK):**

```json
{
  "content": [
    {
      "_id": "60a1e2c87c21f32a4c88b4a5",
      "name": "무선 블루투스 헤드폰",
      "price": 129.99,
      "discountPrice": 99.99,
      "images": ["https://storage.example.com/products/headphones-main.jpg"],
      "status": "active",
      "stockQuantity": 100,
      "averageRating": 4.7,
      "reviewCount": 125,
      "createdAt": "2025-05-14T10:30:00Z"
    }
  ],
  "pageable": {
    "page": 0,
    "size": 20,
    "total": 1
  },
  "searchMetadata": {
    "query": "무선 헤드폰",
    "totalResults": 1,
    "processingTimeMs": 42
  }
}
```

#### 고급 필터링

다양한 조건으로 상품을 필터링합니다.

```
GET /products/filter
```

**쿼리 매개변수:**

- `category` (선택 사항) - 카테고리 ID별 필터링
- `minPrice` & `maxPrice` (선택 사항) - 가격 범위별 필터링
- `attributes.*` (선택 사항) - 상품 속성별 필터링 (예: attributes.color=black)
- `rating` (선택 사항) - 최소 평점별 필터링
- `inStock` (선택 사항) - 재고 있는 상품만 필터링 (true/false)
- `page` (선택 사항) - 페이지 번호 (기본값: 0)
- `size` (선택 사항) - 페이지 크기 (기본값: 20)
- `sort` (선택 사항) - 정렬 기준 (price_asc, price_desc, newest, popularity)

**응답 (200 OK):**

```json
{
  "content": [
    {
      "_id": "60a1e2c87c21f32a4c88b4a5",
      "name": "무선 블루투스 헤드폰",
      "price": 129.99,
      "discountPrice": 99.99,
      "images": ["https://storage.example.com/products/headphones-main.jpg"],
      "attributes": {
        "color": "블랙",
        "brand": "오디오텍"
      },
      "status": "active",
      "stockQuantity": 100,
      "averageRating": 4.7,
      "reviewCount": 125,
      "createdAt": "2025-05-14T10:30:00Z"
    }
  ],
  "pageable": {
    "page": 0,
    "size": 20,
    "total": 1
  },
  "filters": {
    "appliedFilters": {
      "category": "609c1e8b7c21f32a4c88b4a3",
      "minPrice": 50,
      "attributes.color": "블랙"
    },
    "availableFilters": {
      "brand": ["오디오텍", "사운드코어", "보스"],
      "color": ["블랙", "화이트", "블루"],
      "connectivity": ["블루투스 5.0", "블루투스 4.2", "유선"]
    }
  }
}
```

## 오류 응답

모든 엔드포인트는 다음과 같은 형식의 표준 오류 응답을 반환합니다:

```json
{
  "timestamp": "2025-05-14T20:00:00.000Z",
  "status": 400,
  "error": "Bad Request",
  "message": "상품 생성 요청 객체의 유효성 검사 실패",
  "path": "/api/products",
  "details": [
    {
      "field": "price",
      "message": "0보다 커야 합니다"
    }
  ]
}
```

## 도메인 이벤트

상품 서비스는 다음과 같은 이벤트를 이벤트 버스에 발행합니다:

| 이벤트 | 페이로드 | 설명 |
| ------ | ------- | ---- |
| ProductCreated | {productId, enterpriseId, name, price} | 상품이 생성되었을 때 |
| ProductUpdated | {productId, updatedFields[]} | 상품 정보가 업데이트되었을 때 |
| ProductStatusChanged | {productId, oldStatus, newStatus} | 상품 상태가 변경되었을 때 |
| ProductPriceChanged | {productId, oldPrice, newPrice} | 상품 가격이 변경되었을 때 |
| ProductStockChanged | {productId, oldQuantity, newQuantity} | 상품 재고 수량이 변경되었을 때 |
| ProductCategoryAssigned | {productId, categoryId} | 상품이 카테고리에 할당되었을 때 |
| CategoryCreated | {categoryId, name, parentId} | 새 카테고리가 생성되었을 때 |
