
import next from 'next'
import express from 'express'
import {Database, Resource, getModelByName} from '@adminjs/prisma'
import {PrismaClient} from '@prisma/client'
import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()



const prisma = new PrismaClient()

AdminJS.registerAdapter({Database, Resource})

const admin = new AdminJS({
    rootPath: '/admin',
    resources: [
        {
            resource: {model: getModelByName('Example'), client: prisma},
            options: {},
        },
        {
            resource: {model: getModelByName('Person'), client: prisma},
            options: {},
        },

    ],
})
const router = AdminJSExpress.buildRouter(admin)

app.prepare()
    .then(() => {
        const server = express()

        server.get('/ping', (req, res) => {
            res.json({pong: Date.now()}).status(200)

        })
        server.use(admin.options.rootPath, router)

        server.get('*', (req, res) => {
            return handle(req, res)
        })

        server.listen(3000, (err) => {
            if (err) throw err
            console.log('> Ready on http://localhost:3000')
        })
    })
    .catch((ex) => {
        console.error(ex.stack)
        process.exit(1)
    })