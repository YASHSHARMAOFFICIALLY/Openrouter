import {prisma} from "db"
import jwt from "jsonwebtoken"
export abstract class AuthService {
    static async signup(email:string,password:string):Promise<string>{
        console.log("Creating user...")
        const user = await prisma.user.create({
            
            data:{
                email,
                password:await Bun.password.hash(password),
               name:""
            }
        })
        return user.id.toString() 
        

    }
    
     static async signin(email:string,password:string):Promise<string>{
      const user = await prisma.user.findFirst({
        where:{
            email
        }
      })
      if(user){
        const match = await Bun.password.verify(password,user.password)
        if(match){
            const token = jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRET!)
            return token

        }else{
            throw new Error("Invalid credentials");
        }
      } else {
        throw new Error("User not found");
      }
     }
}