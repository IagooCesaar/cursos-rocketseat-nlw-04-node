import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyUsersRepository } from "../repositories/SurveyUserRepository";

class AnswerController {
  async execute(req: Request, res: Response) {

    const { value } = req.params;
    const { u } = req.query;
    console.log({value, u})

    const surveysUsersRepository = getCustomRepository(SurveyUsersRepository)

    const surveyUser = await surveysUsersRepository.findOne({
      id: String(u)
    })

    if (!surveyUser) {
      return res.status(400).json({
        error: "Survey User does not exists!"
      })
    }
    console.log('Registering answer', surveyUser)

    surveyUser.value = Number(value);
    await surveysUsersRepository.save(surveyUser)

    return res.status(200).json(surveyUser)
  }
}

export { AnswerController }