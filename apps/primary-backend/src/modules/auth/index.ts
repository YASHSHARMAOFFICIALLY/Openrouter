import {Elysia,Cookie, status} from 'elysia'
import { AuthModel } from './models'
import { AuthService } from './service'
import jwt from "@elysiajs/jwt"

export const app = new Elysia({prefix:"auth"})
    .use(
        jwt({
            name:'jwt',
            secret:process.env.JWT_SECRET!, 
           
            
        })
    )



    .post("/sign-up",async ({body,status})=>{
        console.log("yash")
        try {
                    const userId = await AuthService.signup(body.email,body.password);
                     return {
                    id:userId
        }

        }catch(e){
            console.log(e)
            return status(400,{
                message: "Error while Signing up"
            })
        }

    },{
        body:AuthModel.signupSchema,
        response:{
            200:AuthModel.SignupResponseSchema,
            400:AuthModel.signupFailedSchema
        }
    })




    .post("/sign-in",async ({jwt,body,status,cookie:{auth}})=>{
        const {correctCredentials,userId} = await AuthService.signin(body.email,body.password)
        console.log("yash")
        if(correctCredentials&& userId){
            const token = await jwt.sign({userId})
            if(!auth){
                auth = new Cookie("auth",{})
            }
            auth.set({
                value: token,
                httpOnly: true,
                maxAge: 7 * 86400,
            })
            return {
               token
            }
            }else{
                return status(403,{
                    message:"incorrect creidentials"
                })
            }
        
        },
            {
        body: AuthModel.signinSchema,
        response: {
            200: AuthModel.SigninResponseSchema,
            403: AuthModel.SigninFailedSchema
        }
    })
        .resolve(async ({ cookie: { auth }, status, jwt}) => {
        if (!auth) {
            return status(401)
        }

        const decoded = await jwt.verify(auth.value as string);

        if (!decoded || !decoded.userId) {
            return status(401)
        }

        return {
            userId: decoded.userId as string
        }
    })

    // .get("/profile",async({userId,status})=>{
    //     const userData = await AuthService.getUserDetail(Number(userId))
    //     if(!userData){
    //         return status(403,{
    //             message:"Error While fetching user details"
    //         })
    //     }
    //     return userData
    // },{
    //     response:{
    //         200:AuthModel.profileResponseSchema,
    //         403:AuthModel.profileResponseErrorSchema
    //     }
    // })
        
      
       
    