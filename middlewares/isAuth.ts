import { Context } from 'https://deno.land/x/oak/mod.ts'
import { create, verify } from 'https://deno.land/x/djwt/mod.ts'
import { privateKey } from '../helpers/generateJWT.ts'
import { Dbjson } from '../helpers/dbjson.ts'

const dbjson = new Dbjson('./db/users.json')

const { users } = await dbjson.readJSON()

const isAuth = async (ctx: Context, next: any) => {

      try {
       

        const jwt = ctx.request.headers.get('x-token') as string

        if (!jwt) return ctx.response.body = {
            msg: "No hay json web token :("
        }

        const payload = await verify(jwt, privateKey)

        const userFound = users.find(user => user.id === payload?.id)

        if (!userFound) {
            return ctx.response.body = {
                error: "user not found "
            }
        }
        ctx.state.user = userFound

        await next()

    } catch (_error) {
        ctx.response.body = {
            error: "private key of the jwt is invalid"
        }
   }
}

export default isAuth