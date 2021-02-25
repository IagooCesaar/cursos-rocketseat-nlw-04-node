import path from 'path';
import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveyRepository";
import { SurveyUsersRepository } from "../repositories/SurveyUserRepository";
import { UsersRepository } from "../repositories/UserRepository";
import SendMailService from "../services/SendMailService";

class SendMailController {
  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository)
    const surveysUsersRepository = getCustomRepository(SurveyUsersRepository)

    const user = await usersRepository.findOne({email})
    if (!user) {
      return res.status(400).json({error: 'User does not exists'})
    }

    const survey = await surveysRepository.findOne({id: survey_id})
    if (!survey) {
      return res.status(400).json({error: 'Survey does not exists'})      
    }

    // Salvar as informações na tabela Surveys_Users
    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id,
    })
    await surveysUsersRepository.save(surveyUser);

    const npsPath = path.resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

    // Enviar e-mail para o usuário
    await SendMailService.execute({
      to: email,
      subject: survey.title,

      templatePath: npsPath,
      variables: {
        name: user.name,
        title: survey.title,
        description: survey.description
      },      
    })

    return res.status(201).json(surveyUser)
  }
}

export { SendMailController }