# E-commerce Marketplace Platform

## 프로젝트 개요

다양한 판매자가 제품을 등록하고 판매할 수 있는 마켓플레이스 형태의 이커머스 플랫폼입니다. 사이드 프로젝트로 진행하며 현대적인 기술 스택을 활용한 MSA(Microservice Architecture) 구현에 중점을 둡니다.

## 기술 스택

### 백엔드 (공통)

- **API 문서화**: Swagger / OpenAPI
- **메시지 큐**: Apache Kafka
- **컨테이너화**: Docker
- **오케스트레이션**: Kubernetes
- **클라우드 제공자**: AWS

### 서비스별 기술 스택

#### 사용자 서비스 (User Service)

- **언어**: Java 17
- **프레임워크**: Spring Boot 3.x, Spring Security
- **데이터베이스**: PostgreSQL
- **캐싱**: Redis (세션 및 토큰 관리)

#### 상품 서비스 (Product Service)

- **언어**: TypeScript
- **프레임워크**: NestJS
- **데이터베이스**: MongoDB
- **검색 엔진**: MongoDB Atlas Search
- **이미지 스토리지**: AWS S3 + CloudFront

#### 주문 서비스 (Order Service)

- **언어**: Java 17
- **프레임워크**: Spring Boot 3.x, Spring Cloud
- **데이터베이스**: PostgreSQL
- **캐싱**: Redis

#### 결제 서비스 (Payment Service)

- **언어**: Java 17
- **프레임워크**: Spring Boot 3.x
- **데이터베이스**: PostgreSQL
- **보안**: 데이터 암호화, TLS 1.3

### 데이터베이스

- **관계형 DB**: PostgreSQL (사용자, 주문, 결제 서비스)
- **NoSQL**: MongoDB (상품 카탈로그, 리뷰 등)
- **인메모리 DB**: Redis (캐싱, 세션 관리, 실시간 데이터)

### 메시지 큐

- **이벤트 브로커**: Apache Kafka
- **스키마 관리**: Schema Registry (Avro)

### 인프라

- **컨테이너화**: Docker
- **오케스트레이션**: Kubernetes
- **클라우드 제공자**: AWS
  - EKS (Elastic Kubernetes Service)
  - RDS (PostgreSQL)
  - DocumentDB 또는 MongoDB Atlas
  - ElastiCache (Redis)
  - S3 (이미지 및 파일 저장)
  - CloudFront (CDN)

### CI/CD

- **버전 관리**: Git
- **CI/CD 파이프라인**: GitHub Actions
- **아티팩트 관리**: Docker Hub 또는 AWS ECR

## 마이크로서비스 구성

### 핵심 서비스

1. **사용자 서비스 (User Service)**

   - 회원가입, 로그인, 프로필 관리
   - 일반 사용자 및 판매자 계정 관리
   - 인증 및 권한 관리
   - 소셜 로그인 연동

2. **상품 서비스 (Product Service)**

   - 상품 등록, 수정, 조회
   - 카테고리 관리
   - 상품 검색 및 필터링
   - 재고 관리
   - 상품 통계 (평점, 판매량 등)

3. **주문 서비스 (Order Service)**

   - 주문 생성 및 관리
   - 주문 상태 추적
   - 배송 정보 관리
   - 주문 취소 및 변경 처리

4. **결제 서비스 (Payment Service)**
   - 결제 처리 및 관리
   - PG사 연동
   - 환불 처리
   - 결제 수단 관리

### 인프라 서비스

1. **API 게이트웨이**

   - Spring Cloud Gateway
   - 라우팅, 로드 밸런싱, 인증

2. **서비스 디스커버리**

   - Spring Cloud Netflix Eureka 또는 Kubernetes Service Discovery

3. **설정 관리**
   - Spring Cloud Config 또는 Kubernetes ConfigMaps 및 Secrets

## 이벤트 기반 통신 패턴

주요 도메인 이벤트를 Kafka를 통해 처리:

### 사용자 이벤트

- MemberCreated, MemberUpdated, MemberDisabled
- EnterpriseCreated, EnterpriseVerified
- SellerAccountCreated

### 상품 이벤트

- ProductCreated, ProductUpdated, ProductStatusChanged
- ProductPriceChanged, ProductStockChanged
- CategoryCreated

### 주문 이벤트

- OrderCreated, OrderStatusChanged, OrderCanceled
- OrderCancellationRequested

### 결제 이벤트

- PaymentCreated, PaymentCompleted, PaymentFailed
- RefundInitiated, RefundCompleted

## 데이터 관리 전략

- **PostgreSQL**: 트랜잭션이 중요한 사용자, 주문, 결제 데이터
- **MongoDB**: 스키마가 자주 변경되는 상품 카탈로그, 리뷰
- **Redis**: 세션 관리, 장바구니, 실시간 재고 정보, 캐싱

## 개발 및 배포 워크플로우

1. **로컬 개발 환경**

   - Docker Compose로 의존성 서비스 실행
   - 각 마이크로서비스 로컬에서 개발

2. **CI/CD 파이프라인**

   - 코드 푸시 시 자동 테스트 실행
   - 도커 이미지 빌드 및 푸시
   - 쿠버네티스 매니페스트 업데이트

3. **배포 환경**
   - 개발: EKS 클러스터 (소규모)
   - 프로덕션: EKS 클러스터 (확장 가능한 구성)

## 모니터링 및 로깅

- **로깅**: ELK 스택 또는 AWS CloudWatch
- **모니터링**: Prometheus + Grafana
- **분산 추적**: Spring Cloud Sleuth + Zipkin (자바 서비스), OpenTelemetry (TypeScript 서비스)

## 프로젝트 로드맵

1. **1단계**: 서비스별 데이터 모델 설계 및 API 스펙 정의
2. **2단계**: 각 핵심 서비스 독립적 개발 (사용자, 상품, 주문, 결제)
3. **3단계**: 이벤트 기반 통신 구현 및 서비스 통합
4. **4단계**: 인프라 구축 및 배포 파이프라인 설정
5. **5단계**: 모니터링, 로깅, 성능 최적화

## 학습 목표

- MSA 설계 및 구현 경험 습득
- 이벤트 드리븐 아키텍처 실전 적용
- 다양한 언어와 프레임워크의 통합 (Java/Kotlin + TypeScript)
- 클라우드 네이티브 애플리케이션 개발 및 배포
- 서비스 간 통신 패턴 및 데이터 일관성 관리
- 컨테이너 오케스트레이션 (Kubernetes) 실무 활용
- 다양한 데이터베이스 기술 통합
