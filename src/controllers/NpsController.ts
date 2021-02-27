import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveyUsersRepository } from "../repositories/SurveyUserRepository";
import * as yup from 'yup'

class NpsController { 
  async execute(req: Request, res: Response) {
    /*
      *As notas são respondidas de 1 a 10.
      *Classificação dos respondentes:
        Detratores  => 0 a 6
        Passivos    => 7 a 8
        Promotores  => 9 a 10

      *Cálculo NPS
        (Número de Promotores - Número de Detratores) / (Número de respondentes) * 100      
    */

    const paramSchema = yup.object().shape({
      survey_id: yup
        .string()
        .uuid("A identificação da pesquisa deverá ser um UUID válido")
        .required("A identificação da pesquisa deverá ser um UUID válido")
    })
    await paramSchema.validate(req.params, {abortEarly: false})

    const { survey_id } = req.params
    const surveysUsersRepository = getCustomRepository(SurveyUsersRepository)

    const surveysUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull())
    })

    const totalAnswers = surveysUsers.length;
    const detractors = surveysUsers.filter(survey => (
      survey.value >=0 && survey.value <= 6
    )).length
    const passives = surveysUsers.filter(survey => (
      survey.value >=7 && survey.value <= 8
    )).length
    const promoters = surveysUsers.filter(survey => (
      survey.value >=9 && survey.value <= 10
    )).length

    const npsScore = Number((100 * (promoters - detractors) / totalAnswers).toFixed(2));

    return res.status(200).json({
      detractors,
      passives,
      promoters,
      totalAnswers,
      npsScore
    })    
  }
}

export { NpsController }