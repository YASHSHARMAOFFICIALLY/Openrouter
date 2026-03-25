import {t} from 'elysia'

export namespace AuthModel {
    const signinSchema = t.Object({
        email:t.String(),
        password:t.String()

    })
    export type signInSchema = typeof signinSchema.static

    const SigninResponseSchema = t.Object({
        token:t.String()
    })

    export type SigninResponseSchema = typeof SigninResponseSchema.static;

}