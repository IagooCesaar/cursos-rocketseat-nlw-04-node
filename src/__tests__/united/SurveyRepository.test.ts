import { SurveysRepository } from '../../repositories/SurveyRepository'
import { getConnection, getCustomRepository } from 'typeorm'

import createConnection from '../../database'
import mockSurvey from './mock/Survey1.json'

let mockSurvey1 = {...mockSurvey}

describe("Surveys Repository", () => {
    
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    const connection = await getConnection();
    await connection.dropDatabase();
    await connection.close()
  })

  it("Should be able to create a new survey", async () => {
    const surveyRepository = getCustomRepository(SurveysRepository)

    const newSurvey = surveyRepository.create({
      title: mockSurvey1.title,
      description: mockSurvey1.description
    })
    await surveyRepository.save(newSurvey)
    mockSurvey1.id = newSurvey.id;

    const findedSurvey = await surveyRepository.findOne(mockSurvey1)

    expect(findedSurvey).toStrictEqual(newSurvey)
  }) 

  // it("Should be able to find a survey al")
})