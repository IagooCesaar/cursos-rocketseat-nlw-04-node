import { UsersRepository } from '../../repositories/UserRepository'
import { getConnection, getCustomRepository } from 'typeorm'

import createConnection from '../../database'
import mockUser1 from './mock/User1.json'
// const mockUser1 = {
//   name: "Example User",
//   email: "user@example.com"
// }


describe("Users Repository", () => {
  
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    const connection = await getConnection();
    await connection.dropDatabase();
    await connection.close()
  })

  it("Should be able to create a new user", async () => {
    // expect(1).toBe(1)
    const userRepository = getCustomRepository(UsersRepository);

    const newUser = userRepository.create(mockUser1)  
    await userRepository.save(newUser)

    const findedUser = await userRepository.findOne(mockUser1)

    expect(findedUser).toStrictEqual(newUser)
  })
})
