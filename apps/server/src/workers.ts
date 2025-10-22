import { buildMailWorker } from "@shared/queue";

["citizen-approved", "citizen-rejected", "official-request"].forEach(
  (queueName) => {
    buildMailWorker(queueName);
  },
);
