# 로컬 개발 환경 설정 가이드

이 문서는 Docker Compose를 사용하여 로컬 개발 환경을 설정하는 방법을 설명합니다.

## 필수 조건

- Docker와 Docker Compose가 설치되어 있어야 합니다.
- 터미널 또는 커맨드 라인 접근이 가능해야 합니다.

## 컨테이너 구성

다음과 같은 서비스 컨테이너가 구성되어 있습니다:

- **PostgreSQL**: 사용자, 주문, 결제 서비스용 관계형 데이터베이스
- **MongoDB**: 상품 서비스용 NoSQL 데이터베이스
- **Redis**: 캐싱 및 세션 관리
- **Kafka & Zookeeper**: 이벤트 스트리밍 및 비동기 통신
- **Schema Registry**: Kafka 스키마 관리
- **관리 도구**: pgAdmin(PostgreSQL), Mongo Express(MongoDB), Redis Commander(Redis), Kafka UI(Kafka)

## 컨테이너 실행 방법

### 모든 서비스 시작

```bash
docker-compose up -d
```

### 특정 서비스만 시작

```bash
docker-compose up -d postgres mongodb redis
```

### 컨테이너 상태 확인

```bash
docker-compose ps
```

### 로그 확인

```bash
# 모든 서비스 로그
docker-compose logs

# 특정 서비스 로그
docker-compose logs postgres

# 로그 실시간 확인
docker-compose logs -f kafka
```

### 컨테이너 중지

```bash
docker-compose stop
```

### 컨테이너 삭제 (데이터 유지)

```bash
docker-compose down
```

### 컨테이너 및 볼륨 삭제 (모든 데이터 삭제)

```bash
docker-compose down -v
```

## 서비스 접속 정보

### PostgreSQL

- **호스트**: localhost
- **포트**: 5432
- **사용자**: postgres
- **비밀번호**: postgres
- **데이터베이스**: user_service, order_service, payment_service

### MongoDB

- **호스트**: localhost
- **포트**: 27017
- **사용자**: mongo
- **비밀번호**: mongo
- **데이터베이스**: marketplace_products

### Redis

- **호스트**: localhost
- **포트**: 6379

### Kafka

- **부트스트랩 서버**: localhost:29092

## 관리 도구 접속 정보

### pgAdmin (PostgreSQL 관리)

- **URL**: http://localhost:5050
- **이메일**: admin@marketplace.com
- **비밀번호**: admin

### Mongo Express (MongoDB 관리)

- **URL**: http://localhost:8083

### Redis Commander (Redis 관리)

- **URL**: http://localhost:8084

### Kafka UI (Kafka 관리)

- **URL**: http://localhost:8082

## 마이크로서비스 연결 설정

각 마이크로서비스에서 사용할 수 있는 연결 설정은 다음과 같습니다:

### 사용자 서비스 (PostgreSQL)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/user_service
    username: postgres
    password: postgres
```

### 상품 서비스 (MongoDB)

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://mongo:mongo@localhost:27017/marketplace_products
```

### 주문 서비스 (PostgreSQL)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/order_service
    username: postgres
    password: postgres
```

### 결제 서비스 (PostgreSQL)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/payment_service
    username: postgres
    password: postgres
```

### Redis 캐싱 설정

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
```

### Kafka 설정

```yaml
spring:
  kafka:
    bootstrap-servers: localhost:29092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: io.confluent.kafka.serializers.KafkaAvroSerializer
    consumer:
      group-id: ${spring.application.name}
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: io.confluent.kafka.serializers.KafkaAvroDeserializer
    properties:
      schema.registry.url: http://localhost:8081
```

## 주의사항

- 처음 실행 시 Docker 이미지 다운로드로 인해 시간이 소요될 수 있습니다.
- 포트 충돌이 발생할 경우 `docker-compose.yml` 파일에서 포트 매핑을 수정해주세요.
- 개발 완료 후 리소스 확보를 위해 `docker-compose down` 명령어로 모든 컨테이너를 중지 및 제거해주세요.
