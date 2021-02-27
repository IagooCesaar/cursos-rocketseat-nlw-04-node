import { UsersRepository } from '../../repositories/UserRepository'
import { getConnection, getCustomRepository } from 'typeorm'

import createConnection from '../../database'
import mockUserData from './mock/User1.json'
let mockUser1 = {...mockUserData}

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
    const userRepository = getCustomRepository(UsersRepository);

    const newUser = userRepository.create({
      name: mockUser1.name,
      email: mockUser1.email
    })  
    await userRepository.save(newUser)
    mockUser1 = newUser;

    const findedUser = await userRepository.findOne({id: mockUser1.id})

    expect(findedUser).toStrictEqual(newUser)
  })

  it ('Should be able to find a user already created', async () => {
    const userRepository = getCustomRepository(UsersRepository)

    const findedUser = await userRepository.findOne({
      id: mockUser1.id
    })
    expect(mockUser1).toStrictEqual(findedUser)
  })

  it("Should not be able to find and edit user's name", async () => {
    const userRepository = getCustomRepository(UsersRepository)

    const userAlreadyCreated = await userRepository.findOne({id: mockUser1.id});
    userAlreadyCreated.name = "New User's Name"

    await userRepository.save(userAlreadyCreated)

    const findedUser = await userRepository.findOne({
      id: userAlreadyCreated.id
    })

    expect(userAlreadyCreated).toStrictEqual(findedUser)
  })

  it("Should be able to find and remove a user already created", async () => {
    const userRepository = getCustomRepository(UsersRepository)

    const user = await userRepository.findOne({email: mockUser1.email})
    await userRepository.remove(user)

    const userExists = await userRepository.findOne({email: mockUser1.email})
    
    expect(userExists).toStrictEqual(undefined)
  })
})
