import request from 'supertest'
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

  it('Should be able to create a new survey', async () => {
    const response = await request(app)
      .post('/surveys')
      .send(mockSurvey);
    
    expect(response.status).toBe(201)
  })
})