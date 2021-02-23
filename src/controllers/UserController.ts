import {Request, Response} from 'express'

class UserController {
  async create(request: Request, response: Response) {
    const body = request.body;
    console.log(body)

    return response.status(201).send({message: 'ok'})
  }

  async index(request: Request, response: Response) {

  }

  async show(request: Request, response: Response) {

  }
}

export {UserController};