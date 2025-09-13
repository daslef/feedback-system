import resetDatabase from "./reset";
import * as fake from "./fake";
import * as real from "./real";
import { db } from "../index";

async function seedDatabase() {
  const seedFunctionIdentifiers = [
    "seedAdministrativeUnitTypes",
    "seedAdministrativeUnits",
    "seedFeedbackStatuses",
    "seedFeedbackTypes",
    "seedFeedbackTopics",
    "seedFeedbackTopicCategories",
    "seedFeedbackTopicCategoryTopic",
    "seedPersonTypes",
    "seedPersons",
    "seedProjects",
    // "seedFeedbacks",
  ];

  for await (const seedFunctionName of seedFunctionIdentifiers) {
    try {
      const seedFunction = real[seedFunctionName] ?? fake[seedFunctionName];
      await seedFunction(db);
    } catch (error) {
      console.error(error);
    }
  }
}

(async () => {
  const commandsMapping = {
    reset: () => resetDatabase(db),
    seed: seedDatabase,
  };
  const command = process.argv[2];
  await commandsMapping[command]();
  process.exit(0);
})();
