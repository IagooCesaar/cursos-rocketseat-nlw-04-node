import request from 'supertest'
import { getConnection } from 'typeorm'
import app from '../app'

import createConnection from '../database'

const mockSurvey = {
  title: 'Title for example',
  description: 'Description for example'
}

describe("Survey's routes", () => {

  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    const connection = await getConnection();
    await connection.dropDatabase();
    await connection.close()
  })

  it('Should be able to create a new survey', async () => {
    const response = await request(app)
      .post('/surveys')
      .send(mockSurvey);
    
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  })

  it('Should be able to get all surveys', async () => {
    const response = await request(app)
      .get('/surveys')
      
    expect(response.body.length).toBeGreaterThanOrEqual(1)
  })
})