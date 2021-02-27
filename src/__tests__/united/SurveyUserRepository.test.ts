import { SurveysRepository } from '../../repositories/SurveyRepository'
import { getConnection, getCustomRepository } from 'typeorm'

import createConnection from '../../database'
import mockUserData from './mock/User1.json'
import mockSurveyData from './mock/Survey1.json'
import mockSurveyUserData from './mock/SurveyUser1.json'
import { UsersRepository } from '../../repositories/UserRepository'
import { SurveyUsersRepository } from '../../repositories/SurveyUserRepository'

let mockSurvey1 = {...mockSurveyData}
let mockUser1 = {...mockUserData}
let mockSurveyUser1 = {...mockSurveyUserData}

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

  it("Should be able to provide a survey for a user", async() => {
    const surveyUserRepository = getCustomRepository(SurveyUsersRepository)

    const newSurveyUser = surveyUserRepository.create({
      survey_id: mockSurvey1.id,
      user_id: mockUser1.id
    })
    await surveyUserRepository.save(newSurveyUser)

    const findedSurveyUser = await surveyUserRepository.findOne({
      survey_id: mockSurvey1.id,
      user_id: mockUser1.id
    })
    mockSurveyUser1 = findedSurveyUser;

    expect(findedSurveyUser).not.toStrictEqual(undefined)

  })

  it("Should be able to registry a user answer for a survey by id", async () => {
    const surveyUserRepository = getCustomRepository(SurveyUsersRepository)

    const surveyUser = await surveyUserRepository.findOne({
      id: mockSurveyUser1.id
    })
    surveyUser.value = 10;
    mockSurveyUser1 = surveyUser;

    await surveyUserRepository.save(surveyUser)

    const findedSurveyUser = await surveyUserRepository.findOne({
      id: mockSurveyUser1.id
    })

    expect(findedSurveyUser).toStrictEqual(surveyUser)
  })

  it(
    "Should be able to change a value answered for a user on a survey by id", async() => {

    const surveyUserRepository = getCustomRepository(SurveyUsersRepository)

    const surveyUser = await surveyUserRepository.findOne({
      id: mockSurveyUser1.id
    })
    surveyUser.value = 9
    await surveyUserRepository.save(surveyUser)

    const findedSurveyUser = await surveyUserRepository.findOne({
      id: mockSurveyUser1.id
    })

    expect(findedSurveyUser).not.toStrictEqual(undefined)
    expect(findedSurveyUser.value).not.toStrictEqual(mockSurveyUser1.value)
    expect(findedSurveyUser.value).toStrictEqual(surveyUser.value)
  })

  it("Should be able to remove a survey user's answer by id", async () => {
    const surveyUserRepository = getCustomRepository(SurveyUsersRepository)

    await surveyUserRepository.delete({
      id: mockSurveyUser1.id
    })
    
    const surveyUser = await surveyUserRepository.findOne({
      id: mockSurveyUser1.id
    })

    expect(surveyUser).toStrictEqual(undefined)
  })

})