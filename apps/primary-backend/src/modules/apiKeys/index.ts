import jwt from "@elysiajs/jwt";
import Elysia, { status } from "elysia";
import { ApiKeyModel } from "./models";
import { ApiKeyService } from "./service";

export const app = new Elysia({prefix:"api-keys"})
.use(
    jwt({
        name:'jwt',
        secret : process.env.JWT_SECRET!

    })
)
// )
    // .resolve(
    //     async function verifyToken ({cookie:{auth},status,jwt}) => {

    //     if(!auth ){
    //         return status(401)
    //     }
    //     const decoded = jwt.verify(auth.value as string)

    //     if(!decoded || !decoded.userId){
    //         return status(401)

    //     }
    //     return {
    //         userId:decoded.userId as string
    //     }
    //     })

.post("/",async({userId,body})=>{
   const {apiKey,id}  = await ApiKeyService.createApiKey(userId,Number(body.name))
   return{
    id,
    apiKey
   }

},{
    body:ApiKeyModel.CrateApiKeySchema,
    response:{
        200:ApiKeyModel.createAPiKeyResponse
    }
})

.get("/",()=>{
    const apikeys = await ApiKeyService.getApiKeys(Number(userId));
    return{
        apikeys
    }
},{
    response:{
        200:ApiKeyModel.getApiKeysResponseSchema
    }
})
.post("/disable",()=>{

})
.delete("/",()=>{

})