import path from 'path';
import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveyRepository";
import { SurveyUsersRepository } from "../repositories/SurveyUserRepository";
import { UsersRepository } from "../repositories/UserRepository";
import SendMailService from "../services/SendMailService";
import { AppError } from '../errors/AppError';
import * as yup from 'yup'

class SendMailController {
  async execute(req: Request, res: Response) {
    const bodySchema = yup.object().shape({
      email: yup
        .string()
        .email("E-mail deverá ser um e-mail válido")
        .required("O e-mail é obrigatório"),
      survey_id: yup
        .string()
        .uuid("A identificação da questão deverá ser um UUID válido")
        .required("A identificação da questão é obrigatória")
    })
    await bodySchema.validate(req.body, {abortEarly: false})

    const { email, survey_id } = req.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository)
    const surveysUsersRepository = getCustomRepository(SurveyUsersRepository)

    const user = await usersRepository.findOne({email})
    if (!user) {
      throw new AppError('User does not exists')
    }

    const survey = await surveysRepository.findOne({id: survey_id})
    if (!survey) {
      throw new AppError('Survey does not exists')
    }

    //Verificando se já existe resposta para o usuário
    const surveyUserAlreadyExist = await surveysUsersRepository.findOne({
      where: {
        user_id: user.id,
        survey_id: survey.id
      },
      // relations: ['Users']
    })

    //Variáveis para compor modelo de e-mail
    const npsPath = path.resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');
    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: '',
      link: process.env.URL_MAIL
    }
    

    if (surveyUserAlreadyExist) {
      // Enviar e-mail para o usuário
      variables.id = surveyUserAlreadyExist.id;
      await SendMailService.execute({
        to: email,
        subject: survey.title,

        templatePath: npsPath,
        variables,      
      })

      return res.status(200).json(surveyUserAlreadyExist)

    } else {
        // Salvar as informações na tabela Surveys_Users
        const surveyUser = surveysUsersRepository.create({
          user_id: user.id,
          survey_id,
        })
        await surveysUsersRepository.save(surveyUser);         
        
        // Enviar e-mail para o usuário
        variables.id = surveyUser.id;  
        await SendMailService.execute({
          to: email,
          subject: survey.title,
  
          templatePath: npsPath,
          variables,      
        })
  
        return res.status(201).json(surveyUser)
    }    
  }
}

export { SendMailController }