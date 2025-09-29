import { oc } from "@orpc/contract";

import {
  getOfficialResponsibilitySchema,
  getManyOfficialResponsibilitySchema,
  createOfficialResponsibilitySchema,
  updateOfficialResponsibilitySchema,
  deleteOfficialResponsibilitySchema,
} from "@shared/schema/official_responsibility";

import { baseInputAll } from "@shared/schema/base";

const officialResponsibilityContract = oc
  .tag("Officials")
  .prefix("/official_responsibilities")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "Список ответственных за территории лиц",
      })
      .input(baseInputAll)
      .output(getManyOfficialResponsibilitySchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "Назначение нового ответственного на новую территорию",
        description: "Создание новой пары Территория-Ответственный",
      })
      .input(createOfficialResponsibilitySchema)
      .output(getOfficialResponsibilitySchema),

    update: oc
      .route({
        method: "PATCH",
        path: "/{id}",
        inputStructure: "detailed",
        summary: "Обновление ответственного за территорию",
        description:
          "Назначение нового ответственного за территорию либо изменение территории у того же ответственного",
      })
      .input(updateOfficialResponsibilitySchema)
      .output(getOfficialResponsibilitySchema),

    delete: oc
      .route({
        method: "DELETE",
        path: "/{id}",
        inputStructure: "detailed",
        summary: "Delete project by ID",
      })
      .input(deleteOfficialResponsibilitySchema),
  });

export default officialResponsibilityContract;
