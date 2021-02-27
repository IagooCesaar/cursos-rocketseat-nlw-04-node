import { SurveysRepository } from '../../repositories/SurveyRepository'
import { getConnection, getCustomRepository } from 'typeorm'

import createConnection from '../../database'
import mockUser1 from './mock/User1.json'
import mockSurveyData from './mock/Survey1.json'

let mockSurvey1 = {...mockSurveyData}

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

})