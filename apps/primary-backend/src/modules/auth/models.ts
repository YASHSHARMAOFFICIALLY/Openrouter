import {t} from 'elysia'

export namespace AuthModel {
    export const signinSchema = t.Object({
        email:t.String(),
        password:t.String()

    })
    export type signInSchema = typeof signinSchema.static

    export const SigninResponseSchema = t.Object({
        token:t.String()
    })

    export type SigninResponseSchema = typeof SigninResponseSchema.static;

    export const SigninFailedSchema = t.Object({
        message:t.Literal("error")
    })
    
    export type SigninFailedSchema = typeof SigninFailedSchema.static;


    //Signup 

    export const signupSchema = t.Object({
        email:t.String(),
        password:t.String()

    })
    export type signupSchema = typeof signupSchema.static

   export  const SignupResponseSchema = t.Object({
        id:t.String()
    })

    export const signupFailedSchema = t.Object({
        message:t.Literal("error")
    })

    export type SignupResponseSchema = typeof SignupResponseSchema.static;

    export type SignupFailedSchema = typeof signupFailedSchema.static;

}