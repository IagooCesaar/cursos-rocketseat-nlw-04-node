import {Request, Response} from 'express'
import { getCustomRepository, getRepository } from 'typeorm';
import { User } from '../models/User';
import { UsersRepository } from '../repositories/UserRepository';

class UserController {
  async create(request: Request, response: Response) {
    const {name, email} = request.body;

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

export {UserController};