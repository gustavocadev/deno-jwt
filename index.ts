import { Server } from "./server.ts"

const server = new Server()

console.log('listening at port 4000');
await server.listen()