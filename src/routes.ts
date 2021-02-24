import { Router } from 'express'
const router = Router();

import { UserController } from './controllers/UserController'
const userController = new UserController();

router.post('/users', userController.create)

import { SurveyController } from './controllers/SurveyController'
const surveyController = new SurveyController();

router.post('/surveys', surveyController.create)
router.get('/surveys', surveyController.show)

export { router }