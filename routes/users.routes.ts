import { Router, RouterMiddleware } from 'https://deno.land/x/oak/mod.ts'
import * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts'
import { Dbjson } from '../helpers/dbjson.ts'
import isAuth from '../middlewares/isAuth.ts'
import { create, verify } from 'https://deno.land/x/djwt/mod.ts'
import { privateKey } from '../helpers/generateJWT.ts';

const router = new Router()
const dbjson = new Dbjson('./db/users.json')

const { users } = await dbjson.readJSON()


router.get('/users', isAuth, (ctx) => {
   
    ctx.response.body = {
        users
    }
})

router.get('/users/:id', (ctx) => {
    console.log('user =>',);

    const { id } = ctx.params


    const userFound = users.find(user => user.id === id)

    if (!userFound) {
        ctx.response.body = {
            msg:"El usuario no existe"
        }
    }

    ctx.response.body = {
       user: userFound
    }
})


router.post('/users', async (ctx) => {

    // const bodyData = ctx.request.body({ 'type': 'form' })
    const bodyData = ctx.request.body()
    
    // const formData = await bodyData.value
    const { username, password } = await bodyData.value

    // const username = formData.get('username') as string
    // const password = formData.get('password') as string

    console.log(username, password);
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = {
        username: username.toLowerCase(),
        password: passwordHash,
        id: crypto.randomUUID()
    }
    users.push(newUser)
    await dbjson.writeJSON(users)

    ctx.response.body = users
})


export default router