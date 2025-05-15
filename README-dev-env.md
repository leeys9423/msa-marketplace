# 로컬 개발 환경 구성

이 문서는 로컬 개발 환경을 구성하는 방법을 설명합니다.

## 개요

마이크로서비스 아키텍처 개발을 위한 로컬 환경을 Docker Compose를 사용하여 구성했습니다. 다음과 같은 서비스들이 포함되어 있습니다:

- PostgreSQL: 사용자, 주문, 결제 서비스용 관계형 데이터베이스
- MongoDB: 상품 서비스용 NoSQL 데이터베이스
- Redis: 캐싱 및 세션 관리
- Kafka & Zookeeper: 이벤트 기반 비동기 통신
- Schema Registry: Kafka 스키마 관리
- 관리 도구: pgAdmin, Mongo Express, Redis Commander, Kafka UI

## 시작하기

### 1. Docker와 Docker Compose 설치

먼저 Docker와 Docker Compose가 설치되어 있어야 합니다. 아직 설치하지 않았다면 다음 링크에서 설치할 수 있습니다:
- [Docker Desktop 설치](https://www.docker.com/products/docker-desktop)

### 2. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성합니다:

```bash
cp .env.example .env
```

필요에 따라 `.env` 파일의 값을 수정합니다.

### 3. Docker Compose 실행

다음 명령어를 사용하여 모든 컨테이너를 시작합니다:

```bash
docker-compose up -d
```

특정 서비스만 실행하려면 다음과 같이 사용합니다:

```bash
docker-compose up -d postgres mongodb redis
```

### 4. 서비스 접속

각 서비스는 다음 URL로 접속할 수 있습니다:

- **Config Server**: http://localhost:8888
- **Eureka Server**: http://localhost:8761
- **API Gateway**: http://localhost:8080
- **pgAdmin (PostgreSQL 관리)**: http://localhost:5050
- **Mongo Express (MongoDB 관리)**: http://localhost:8083
- **Redis Commander (Redis 관리)**: http://localhost:8084
- **Kafka UI (Kafka 관리)**: http://localhost:8082

## 서비스 구성

### 마이크로서비스 아키텍처

마이크로서비스 아키텍처는 다음과 같이 구성되어 있습니다:

1. **인프라 서비스**
   - Config Server (8888): 중앙 집중식 설정 관리
   - Eureka Server (8761): 서비스 디스커버리
   - API Gateway (8080): API 게이트웨이 및 라우팅

2. **핵심 마이크로서비스**
   - User Service (8001): 사용자 관리 및 인증
   - Product Service (8002): 상품 카탈로그 관리
   - Order Service (8003): 주문 처리
   - Payment Service (8004): 결제 처리

3. **데이터 저장소**
   - PostgreSQL: 사용자, 주문, 결제 데이터
   - MongoDB: 상품 카탈로그 데이터
   - Redis: 캐싱 및 세션 관리

4. **메시징 & 이벤트 스트리밍**
   - Kafka & Zookeeper: 서비스 간 이벤트 기반 통신
   - Schema Registry: Avro 스키마 관리

## 개발 워크플로우

1. **인프라 서비스 시작**
   - Config Server 시작
   - Eureka Server 시작
   - API Gateway 시작

2. **의존성 서비스 시작**
   - Docker Compose로 데이터베이스 및 메시징 서비스 시작

3. **마이크로서비스 개발 및 실행**
   - 필요한 마이크로서비스 구현 및 실행

4. **설정 관리**
   - `config-repo` 디렉토리에서 각 서비스의 설정 관리
   - 설정 변경 후 해당 서비스 재시작 또는 `/actuator/refresh` 호출

## 주의사항

- Docker 컨테이너는 메모리와 CPU 리소스를 사용합니다. 시스템 리소스를 모니터링하세요.
- 개발 완료 후에는 `docker-compose down` 명령어로 컨테이너를 중지해주세요.
- 실제 프로덕션 환경에서는 보안 설정을 강화해야 합니다.

## 자세한 정보

더 자세한 Docker Compose 사용법은 `docker/README.md` 파일을 참조하세요.
