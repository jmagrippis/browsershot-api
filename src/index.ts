import Fastify, {type FastifyInstance, type FastifyListenOptions} from 'fastify'

import {setupRoute} from './routes/screenshot'

const server: FastifyInstance = Fastify({
  trustProxy: true,
  requestTimeout: 2 * 60 * 1000,
})

setupRoute(server)

const start = async () => {
  try {
    console.log('spinning up server')
    const port = parseInt(process.env.PORT || '3100')
    const options: FastifyListenOptions = {port}
    await server.listen(options)
    console.log('server listening on', port)
  } catch (error) {
    server.log.error(error)
    console.error(error)
    process.exit(1)
  }
}

start()
