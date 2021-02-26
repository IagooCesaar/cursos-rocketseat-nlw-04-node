import { Router } from 'express'
const router = Router();

import { UserController } from './controllers/UserController'
const userController = new UserController();

router.post('/users', userController.create)

import { SurveyController } from './controllers/SurveyController'
const surveyController = new SurveyController();

router.post('/surveys', surveyController.create)
router.get('/surveys', surveyController.show)


import { SendMailController } from './controllers/SendMailController'
const sendMailController = new SendMailController();

router.post('/sendMail', sendMailController.execute)


import { AnswerController } from './controllers/AnswerController'
const answerController = new AnswerController();

// http://localhost:3333/answers/1?u=dff8aa5c-0880-487a-a477-804ed0b7926b
router.get('/answers/:value', answerController.execute)

export { router }