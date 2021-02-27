import request from 'supertest'
import { getConnection } from 'typeorm'
import app from '../../app'

import createConnection from '../../database'

const mockUser = {
  email: 'user@example.com',
  name: 'User example'
}

describe("User's routes", () => {

  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    const connection = await getConnection();
    await connection.dropDatabase();
    await connection.close()
  })

  it('Should be able to create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send(mockUser);
    
    expect(response.status).toBe(201)
  })

  it('Should not be able to create the same user checking by email', async () => {
    const response = await request(app)
      .post('/users')
      .send(mockUser);
    
    expect(response.status).toBe(400)
  })
})