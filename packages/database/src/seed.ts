import { seed, rand, randFirstName, randLastName, randJobTitle, randProductName, randProductDescription, randNumber } from '@ngneat/falso'
import { db } from './database'

async function seedProjectTypes() {
  await db.insertInto('project_type').values([
    { title: 'Дороги' },
    { title: 'Школы' },
    { title: 'Больницы' },
    { title: 'Парки' }
  ]).execute()
}

async function seedAdministrativeUnits() {
  await db.insertInto('administrative_unit').values([
    { title: 'Москва' },
    { title: 'Санкт-Петербург' },
    { title: 'Новосибирск' }
  ]).execute()
}

async function seedFeedbackStatuses() {
  await db.insertInto('feedback_status').values([
    { status: 'Новый' },
    { status: 'В работе' },
    { status: 'Закрыт' }
  ]).execute()
}

async function seedPersons() {
  for (let i = 0; i < 10; i++) {
    await db.insertInto('person').values({
      first_name: randFirstName(),
      last_name: randLastName(),
      middle_name: randFirstName(),
      person_type_id: 1
    }).execute()
  }
}

async function seedProjects() {
  const units = await db.selectFrom('administrative_unit').select(['id']).execute()
  const types = await db.selectFrom('project_type').select(['id']).execute()

  const unitIds = units.map(u => u.id)
  const typeIds = types.map(t => t.id)

  for (let i = 0; i < 20; i++) {
    await db.insertInto('project').values({
      latitude: randNumber({ min: 50, max: 60, precision: 0.0001 }),
      longitude: randNumber({ min: 30, max: 40, precision: 0.0001 }),
      year_of_completion: randNumber({ min: 2000, max: 2025 }),
      administrative_unit_id: rand(unitIds),
      project_type_id: rand(typeIds),
      title: randProductName()
    }).execute()
  }
}

async function seedFeedbacks() {
  const projects = await db.selectFrom('project').select(['id']).execute()
  const persons = await db.selectFrom('person').select(['id']).execute()
  const statuses = await db.selectFrom('feedback_status').select(['id']).execute()

  const projectIds = projects.map(p => p.id)
  const personIds = persons.map(p => p.id)
  const statusIds = statuses.map(s => s.id)

  for (let i = 0; i < 30; i++) {
    await db.insertInto('feedback').values({
      project_id: rand(projectIds),
      description: randProductDescription(),
      person_contact_id: rand(personIds),
      created_at: new Date().toISOString(),
      feedback_status_id: rand(statusIds)
    }).execute()
  }
}

async function seedDatabase() {
  await db.deleteFrom('feedback').execute()
  await db.deleteFrom('project').execute()
  await db.deleteFrom('person').execute()
  await db.deleteFrom('project_type').execute()
  await db.deleteFrom('administrative_unit').execute()
  await db.deleteFrom('feedback_status').execute()

  seed('static')

  await seedProjectTypes()
  await seedAdministrativeUnits()
  await seedFeedbackStatuses()
  await seedPersons()
  await seedProjects()
  await seedFeedbacks()
}

;(async () => {
  await seedDatabase()
  process.exit(0)
})()