import { Application, Context } from 'https://deno.land/x/oak/mod.ts' 
import usersRouter from './routes/users.routes.ts'
import authRouter from './routes/auth.routes.ts'
import * as colors from 'https://deno.land/std/fmt/colors.ts'
import { oakCors } from "https://deno.land/x/cors/mod.ts";


class Server {
    #app: Application
    constructor() {
        this.#app = new Application()
        this.middlewares()
        this.routes()
        
    }

    middlewares() {
        this.#app.use(oakCors())
        this.#app.use(async (ctx: Context, next) => {
            await next()
            const rt = ctx.response.headers.get("X-Response-Time");
            console.log(colors.cyan(`${ctx.request.method} ${ctx.request.url} - ${rt}`));
        });
    }


    routes() {
        this.#app.use(usersRouter.routes())
        this.#app.use(authRouter.routes())
    }

    async listen() {
        await this.#app.listen({
            port: 4000
        })
    }
}

export {
    Server,
}

