print("MongoDB 초기화 시작...");

// 제품 서비스 데이터베이스 생성
db = db.getSiblingDB('marketplace_products');

// 제품 컬렉션에 인덱스 생성
db.products.createIndex({ "name": "text", "description": "text" });
db.products.createIndex({ "category": 1 });
db.products.createIndex({ "seller_id": 1 });
db.products.createIndex({ "price": 1 });
db.products.createIndex({ "created_at": -1 });

// 카테고리 컬렉션에 인덱스 생성
db.categories.createIndex({ "name": 1 }, { unique: true });
db.categories.createIndex({ "parent_id": 1 });

// 리뷰 컬렉션에 인덱스 생성
db.reviews.createIndex({ "product_id": 1 });
db.reviews.createIndex({ "user_id": 1 });
db.reviews.createIndex({ "rating": 1 });
db.reviews.createIndex({ "created_at": -1 });

// 샘플 카테고리 데이터 생성
var categoryIds = [];

var electronicsId = ObjectId();
categoryIds.push(electronicsId);
db.categories.insertOne({
    _id: electronicsId,
    name: "전자제품",
    description: "모든 전자제품 및 가전제품",
    parent_id: null,
    level: 1,
    created_at: new Date(),
    updated_at: new Date()
});

var smartphoneId = ObjectId();
categoryIds.push(smartphoneId);
db.categories.insertOne({
    _id: smartphoneId,
    name: "스마트폰",
    description: "모바일 스마트폰 제품",
    parent_id: electronicsId,
    level: 2,
    created_at: new Date(),
    updated_at: new Date()
});

var laptopId = ObjectId();
categoryIds.push(laptopId);
db.categories.insertOne({
    _id: laptopId,
    name: "노트북",
    description: "노트북 및 랩탑 컴퓨터",
    parent_id: electronicsId,
    level: 2,
    created_at: new Date(),
    updated_at: new Date()
});

var fashionId = ObjectId();
categoryIds.push(fashionId);
db.categories.insertOne({
    _id: fashionId,
    name: "패션",
    description: "옷, 신발, 액세서리",
    parent_id: null,
    level: 1,
    created_at: new Date(),
    updated_at: new Date()
});

var mensId = ObjectId();
categoryIds.push(mensId);
db.categories.insertOne({
    _id: mensId,
    name: "남성의류",
    description: "남성을 위한 의류",
    parent_id: fashionId,
    level: 2,
    created_at: new Date(),
    updated_at: new Date()
});

var womensId = ObjectId();
categoryIds.push(womensId);
db.categories.insertOne({
    _id: womensId,
    name: "여성의류",
    description: "여성을 위한 의류",
    parent_id: fashionId,
    level: 2,
    created_at: new Date(),
    updated_at: new Date()
});

print("MongoDB 카테고리 데이터 초기화 완료: " + db.categories.count() + "개의 카테고리가 생성되었습니다.");

print("MongoDB 초기화 완료!");
