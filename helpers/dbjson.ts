import * as path from "https://deno.land/std/path/mod.ts";
import type { User, UserJSON } from '../types/users.ts';


interface MethodsJSON {
  readJSON(): Promise<UserJSON>;
  writeJSON(data: unknown[]): Promise<void>;
}

class Dbjson implements MethodsJSON {
  private jsonPath: string;

  constructor(relativePathNameJSON: string) {
    this.jsonPath = path.join(Deno.cwd(), `${relativePathNameJSON}`);
  }

  async readJSON(): Promise<UserJSON> {
    const usersTemplate: UserJSON = {
      users: [],
    };
      
    try {
      const users = await Deno.readTextFile(this.jsonPath);
      if (users.length === 0) {
        await Deno.writeTextFile(
          this.jsonPath,
          JSON.stringify(usersTemplate, null, 4),
        );
        return usersTemplate;
      }
        return JSON.parse(users) as UserJSON;
        
    } catch (_err) {
      await Deno.writeTextFile(this.jsonPath, JSON.stringify(usersTemplate, null, 4));
      return usersTemplate;
    }
  }

    async writeJSON(data: User[]) {
    const newUser: UserJSON = {
      users: data,
    };
    await Deno.writeTextFile(this.jsonPath, JSON.stringify(newUser, null, 4));
  }
    
    menu() {
        const option = prompt(`
(1) Añadir usuarios
(2) Eliminar un usuario
(3) Listar todos los datos
(4) Actualizar
(5) Salir
Opcion:`)
        console.log('');
        return Number(option)
    }
}

export { Dbjson }