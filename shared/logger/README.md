# Pino + Open Telemetry

## Log Levels

| Level |	Numeric	| Purpose |	Example Use Cases |
| --- | --- | --- | --- |
| fatal |	60	| Application crash imminent	| Database connection lost, critical service down |
| error	| 50	| Errors requiring investigation | API failures, validation errors, exceptions |
| warn	| 40	| Potential issues	| Deprecated API usage, resource limits approaching |
| info	| 30	| Significant application events |User authentication, service starts, key operations |
| debug	| 20	| Detailed debugging information | Function entry/exit, variable states |
| trace	| 10	| Very detailed execution flow | Loop iterations, deep debugging |