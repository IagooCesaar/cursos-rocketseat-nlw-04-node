import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UserRepository';
import * as yup from 'yup'

class UserController {
  async create(request: Request, response: Response) {
    const {name, email} = request.body;

    const schema = yup.object().shape({
      name: yup.string().required("O nome é obrigatório"),
      email: yup.string().email("O e-mail deverá ser um e-mail válido").required("O e-mail é obrigatório")
    })

    try {
      await schema.validate(request.body, {
        abortEarly: false,
      })  
    } catch (error) {
      return response.status(400).json(error)
    }

    

    const userRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await userRepository.findOne({
      email
    })

    if (userAlreadyExists) {
      return response.status(400).send({error: "User Already exists!"})
    }

    const user = userRepository.create({name, email})

    await userRepository.save(user)    

    return response.status(201).send(user)
  }

  async index(request: Request, response: Response) {

  }

  async show(request: Request, response: Response) {

  }
}

export { UserController };
