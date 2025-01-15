#!/bin/bash

# Redis Container 실행
docker-compose up -d

# Redis 내 데이터 초기화
docker exec redis_test redis-cli FLUSHALL

# 테스트 실행
npx jest drawing.gateway.integration.spec.ts

# 테스트 종료 후 Docker Container 삭제
docker-compose down