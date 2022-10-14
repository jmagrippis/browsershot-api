import puppeteer, {type Browser} from 'puppeteer'
import type {FastifyInstance, RouteShorthandOptions} from 'fastify'

const routeOptions: RouteShorthandOptions = {
  schema: {
    querystring: {
      url: {type: 'string'},
    },
    response: {
      200: {
        type: 'string',
      },
    },
  },
}

interface IQuerystring {
  url: string
}

export const setupRoute = (server: FastifyInstance) =>
  server.get<{Querystring: IQuerystring}>(
    '/',
    routeOptions,
    async (request, reply) => {
      let browser: Browser | null = null
      try {
        browser = await puppeteer.launch({headless: true})
        const page = await browser.newPage()
        page.setViewport({width: 1200, height: 630})
        const url = request.query.url

        if (!url || !url.startsWith('http')) {
          reply
            .status(400)
            .send({ok: false, error: 'you need to specify a valid `url`'})
          return
        }

        await page.goto(url, {waitUntil: 'networkidle0'})
        const imageBuffer = await page.screenshot()

        reply.type('image/png')
        reply.send(imageBuffer)
      } finally {
        if (browser) {
          browser.close()
        }
      }
    }
  )
