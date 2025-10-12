# feedback-system

## Ports

| Service | Inner Port | Outer Port |
| --- | --- | --- |
| Postgres | 5432 | ${POSTGRES_PORT} |
| Pgadmin | 80 | 5050 |
| Redis | 6379 | ${REDIS_PORT} |
| Bullboard | 3000 | ${BULLBOARD_PORT} |
| Minio | 9000 | ${MINIO_PORT_API} |
| Minio Console | 9001 | ${MINIO_PORT_CONSOLE} |
| Zookeeper |  |  |
| Clickhouse | 9000 | 9000 |
| Signoz | 8080 | 8080 |
| OTLP gRPC | 4317 | 4317 |
| OTLP HTTP | 4318 | 4318 |