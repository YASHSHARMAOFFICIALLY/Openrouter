import {prisma} from "db"
export abstract class AuthService {
    static async signup(email:string,password:string):Promise<string>{
        console.log("Creating user...")
        const user = await prisma.user.create({
            
            data:{
                email,
                password,
               name:""
            }
        })
        return user.id.toString() 
        

    }
    
     static async signin(email:string,password:string):Promise<string>{
        return "token"
     }
}