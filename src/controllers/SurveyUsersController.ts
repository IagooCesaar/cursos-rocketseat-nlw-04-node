import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveyUsersRepository } from "../repositories/SurveyUserRepository";
import * as yup from 'yup'

class SurveyUsersController {
  async show(req: Request, res: Response) {
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
      survey_id
    })

    return res.status(200).json(surveysUsers)
  }
}

export { SurveyUsersController }