import { 
  Connection, 
  ConnectionOptions, 
  createConnection, 
  getConnectionOptions
} from 'typeorm'


export default async (): Promise<Connection> => {
  const defaultOpt = await getConnectionOptions();

  const newOptions = {
    database: process.env.NODE_ENV === 'test' 
      ? String(defaultOpt.database).replace(/.sqlite/, '.test.sqlite')
      : defaultOpt.database,
    logging: process.env.NODE_ENV === 'test' 
      ? false
      : true
  }
  return createConnection(
    {...defaultOpt, ...newOptions} as ConnectionOptions
  )
}