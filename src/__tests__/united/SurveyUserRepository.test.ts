import { SurveysRepository } from '../../repositories/SurveyRepository'
import { getConnection, getCustomRepository } from 'typeorm'

import createConnection from '../../database'
import mockUserData from './mock/User1.json'
import mockSurveyData from './mock/Survey1.json'
import { UsersRepository } from '../../repositories/UserRepository'

let mockSurvey1 = {...mockSurveyData}
let mockUser1 = {...mockUserData}

describe("Survey User Repository" ,() => {

  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    const connection = await getConnection();
    await connection.dropDatabase();
    await connection.close()
  })
  
  it("Should be able to create a survey", async() => {
    const surveyRepository = getCustomRepository(SurveysRepository)

    const newSurvey = await surveyRepository.create({
      title: mockSurvey1.title,
      description: mockSurvey1.description,
    })
    await surveyRepository.save(newSurvey)
    mockSurvey1 = newSurvey;

    const findedSurvey = await surveyRepository.findOne({
      id: mockSurvey1.id
    })

    expect(findedSurvey).toStrictEqual(mockSurvey1)    
  })

  it("Should be able to create a user", async () => {
    const userRepository = getCustomRepository(UsersRepository)

    const newUser = userRepository.create({
      name: mockUser1.name,
      email: mockUser1.email
    })  
    await userRepository.save(newUser)
    mockUser1 = newUser;
    
    const findedUser = await userRepository.findOne({
      id: mockUser1.id,      
    })

    expect(findedUser).toStrictEqual(mockUser1);
  })

})