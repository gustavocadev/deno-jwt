import { create } from 'https://deno.land/x/djwt/mod.ts'

 const privateKey = await crypto.subtle.generateKey(
        { name: 'HMAC', hash: 'SHA-512' },
        true,
        ['verify', 'sign']
    )

const generateJWT = async (id: string) => {
   

    const payload = {
        id
    }

    const jwt = await create({ 'alg': 'HS512' }, payload, privateKey)


    return jwt
}


export { generateJWT, privateKey }