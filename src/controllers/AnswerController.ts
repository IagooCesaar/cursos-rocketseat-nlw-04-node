import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveyUsersRepository } from "../repositories/SurveyUserRepository";
import * as yup from 'yup'

class AnswerController {
  async execute(req: Request, res: Response) {

    const paramSchema = yup.object().shape({
      value: yup
        .number()
        .min(1, "A resposta deverá ser um número entre 1 e 10")
        .max(10, "A resposta deverá ser um número entre 1 e 10")
        .required('É necessário informar a resposta')
    })
    const querySchema = yup.object().shape({
      survey: yup
        .string()
        .uuid("A identificação da questão deverá ser um UUID válido")
        .required('É necessário informar a identificação da pesquisa')
    })

    await Promise.all([
      paramSchema.validate(req.params, {abortEarly: false}),
      querySchema.validate(req.query, {abortEarly: false})
    ])

    const { value } = req.params;
    const { survey } = req.query;
    
    const surveysUsersRepository = getCustomRepository(SurveyUsersRepository)

    const surveyUser = await surveysUsersRepository.findOne({
      id: String(survey)
    })

    if (!surveyUser) {
      throw new AppError("Survey User does not exists!");
    }
    
    surveyUser.value = Number(value);
    console.log('Registering answer', surveyUser)

    await surveysUsersRepository.save(surveyUser)

    return res.status(200).json(surveyUser)
  }
}

export { AnswerController }