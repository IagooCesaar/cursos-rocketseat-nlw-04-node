import {Request, Response } from 'express'
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveyRepository'
import * as yup from 'yup'

class SurveyController {

  async create(req: Request, res: Response) {
    const { title, description } = req.body;
    const bodySchema = yup.object().shape({
      title: yup
        .string()
        .min(15,"O título deverá ter no mínimo 15 caracteres")
        .required("O título da questão é obrigatóra"),
      description: yup
        .string()
        .min(15, "A descrição deverá ter no mínimo 15 caracteres")
        .required("A descrição da questão é obrigatória")
    })
    await bodySchema.validate(req.body, {abortEarly: false})

    const surveysRepository = getCustomRepository(SurveysRepository)

    const survey = surveysRepository.create({title, description})

    await surveysRepository.save(survey);

    return res.status(201).send(survey)
  }

  async show(req: Request, res: Response) {
    const surveyRespository = getCustomRepository(SurveysRepository)  

    const all = await surveyRespository.find();

    return res.status(200).send(all)
  }

}

export { SurveyController }