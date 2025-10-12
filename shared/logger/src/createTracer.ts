import process from 'process';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

export function createTracer() {
  const exporterOptions = {
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  }

  const traceExporter = new OTLPTraceExporter(exporterOptions)
  const sdk = new NodeSDK({
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'backend',
      [ATTR_SERVICE_VERSION]: '1.0'
    }),
  })

  sdk.start()

  return {
    tracer: sdk,
    onSigTerm: () => {
      return new Promise<void>(resolve => {
        sdk
          .shutdown()
          .then(() => console.log('Tracing terminated'))
          .catch((error: unknown) => console.log('Error terminating tracing', error))
          .finally(() => resolve())
      })
    }
  }
}