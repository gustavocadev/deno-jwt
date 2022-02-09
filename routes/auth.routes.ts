import { Router } from 'https://deno.land/x/oak/mod.ts'
import { Dbjson } from '../helpers/dbjson.ts'
import type { UserJSON, User } from '../types/users.ts';
import * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts';
import { generateJWT, privateKey } from '../helpers/generateJWT.ts';


const router = new Router()
const dbjson = new Dbjson('./db/users.json')
const { users } = await dbjson.readJSON()


router.post('/login', async (ctx) => {

    // const bodyData = ctx.request.body({ type: 'form' })
    
    const body = ctx.request.body()
    const { password, username } = await body.value
    // const formData = await bodyData.value

    // const username = formData.get('username')
    // const password = formData.get('password') as string


    const dbHasUsername = users.find((user: User) => user.username === username) 
    // verify is the user exists
    if (!dbHasUsername) {
        return ctx.response.body = {
            msg: "the username doesn't exists :("
        }
    }

    const ispasswordMatch = await bcrypt.compare(password, dbHasUsername.password)
     // verify is the password matches
    if (!ispasswordMatch) {
          return ctx.response.body = {
            msg: "the password doesn't match :("
        }
    }

    const jwt = await generateJWT(dbHasUsername?.id as string)


    const user = {
        username,
        token: jwt,
    }

    ctx.response.body = {
        user
    }
})


export default router