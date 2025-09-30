import buildMailWorker from "./mail/mail.worker";

["citizen-approved", "citizen-rejected", "official-request"].forEach(
  (queueName) => {
    buildMailWorker(queueName);
  },
);
