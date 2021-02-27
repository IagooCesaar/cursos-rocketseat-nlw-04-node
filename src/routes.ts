import { Router } from 'express'
const router = Router();

import { UserController } from './controllers/UserController'
const userController = new UserController();

import { SurveyController } from './controllers/SurveyController'
const surveyController = new SurveyController();

import { SendMailController } from './controllers/SendMailController'
const sendMailController = new SendMailController();

import { AnswerController } from './controllers/AnswerController'
const answerController = new AnswerController();

import { NpsController } from './controllers/NpsController'
const npsController = new NpsController();


router.post('/users', userController.create)

router.post('/surveys', surveyController.create)
router.get('/surveys', surveyController.show)

router.post('/sendMail', sendMailController.execute)

// http://localhost:3333/answers/1?survey=dff8aa5c-0880-487a-a477-804ed0b7926b
router.get('/answers/:value', answerController.execute)

router.get('/nps/:survey_id', npsController.execute)

export { router }