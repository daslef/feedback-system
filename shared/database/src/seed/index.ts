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
    "seedContactTypes",
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
  const commandsMapping: { [K: string]: Function } = {
    reset: () => resetDatabase(db),
    seed: seedDatabase,
  } as const;

  const command = process.argv[2];

  if (!command) {
    throw new Error("Command [reset | seed] must be provided")
  }

  if (!(command in commandsMapping)) {
    throw new Error("Invalid command. Only [reset | seed] are supported")
  }

  await commandsMapping[command]!();

  process.exit(0);
})();
