# feedback-system

## Ports

| Service | Inner Port | Outer Port |
| --- | --- | --- |
| Postgres | 5432 | 5432 |
| Pgadmin | 80 | 5050 |
| Redis | 6379 | ${REDIS_PORT} |
| Bullboard | 3000 | 7990 |
| Minio | 9000 | ${MINIO_PORT_API} |
| Minio Console | 9001 | 9001 |
