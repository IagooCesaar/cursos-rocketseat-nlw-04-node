import { SurveysRepository } from '../../repositories/SurveyRepository'
import { getConnection, getCustomRepository } from 'typeorm'

import createConnection from '../../database'
import mockSurveyData from './mock/Survey1.json'

let mockSurvey1 = {...mockSurveyData}

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

  it("Should be able to find a survey already created by id", async () => {
    const surveyRepository = getCustomRepository(SurveysRepository)

    const findedSurvey = await surveyRepository.findOne({
      id: mockSurvey1.id
    })
    expect(findedSurvey).not.toStrictEqual(undefined)
  })

  it("Should be able to find and edit a survey", async () => {
    const surveyRepository = getCustomRepository(SurveysRepository)

    const findedSurvey = await surveyRepository.findOne({
      id: mockSurvey1.id
    })
    expect(findedSurvey).not.toStrictEqual(undefined)

    const newSurveyData = findedSurvey

    newSurveyData.description = "This is a example"
    newSurveyData.title = "This is a example"
    await surveyRepository.save(newSurveyData)

    const editedSurvey = await surveyRepository.findOne({
      id: newSurveyData.id      
    })

    expect(editedSurvey).toStrictEqual(newSurveyData)
  })

  it("Should be able to delete a survey by id", async () => {
    const surveyRepository = getCustomRepository(SurveysRepository)

    await surveyRepository.delete({id: mockSurvey1.id})

    const survey = await surveyRepository.findOne({id: mockSurvey1.id})
    
    expect(survey).toStrictEqual(undefined)
  })


})