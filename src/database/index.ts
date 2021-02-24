import { 
  Connection, 
  createConnection, 
  getConnectionOptions
} from 'typeorm'


export default async (): Promise<Connection> => {
  const defaultOpt = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOpt, {
      database: process.env.NODE_ENV === 'test' 
        ? String(defaultOpt.database).replace('.sqlite', '.test.sqlite')
        : defaultOpt.database
    })
  )
}