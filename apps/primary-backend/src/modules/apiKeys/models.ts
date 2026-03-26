import {t} from "elysia";
export namespace ApiKeyModel {


    //1. phele create api
    export const CrateApiKeySchema = t.Object({
        name:t.String()
    })
    export type createApiKeySchema = typeof CrateApiKeySchema.static


    //APi key bana uska response 
    export const createAPiKeyResponse = t.Object({
        id:t.String(),
        apiKey:t.String()
    })

    export type  createApiKeyResponse = typeof createAPiKeyResponse.static

    //Api ka update kon karega mai hi karunga

     export const updateApiKeySchema = t.Object({
        id: t.String(),
        disabled: t.Boolean()
    })

    export type updateApiKeySchema = typeof updateApiKeySchema.static;

    //Api update kiya toh uska response. 
     export const updateApiKeyResponseSchema = t.Object({
        message: t.Literal("Updated api key successfully")
    })

    export type updateApiKeyResponseSchema = typeof updateApiKeyResponseSchema.static;

    //Disable karta hu 
     export const disableApiKeyResponseFailedSchema = t.Object({
        message: t.Literal("Updating api key unsuccessful")
    })

    export type disableApiKeyResponseFailedSchema = typeof disableApiKeyResponseFailedSchema.static;


    //delete api key 


      export const deleteApiKeyResponseSchema = t.Object({
        message: t.Literal("Api key deleted successfully")
    })

    export type deleteApiKeyResponseSchema = typeof deleteApiKeyResponseSchema.static;

    export const deleteApiKeyResponseFailedSchema = t.Object({
        message: t.Literal("Api key deletetion failed")
    })

    export type deleteApiKeyResponseFailedSchema = typeof deleteApiKeyResponseFailedSchema.static;



    //2 get api karta hu 

    export const getApiKeysResponseSchema = t.Object({
        apiKeys:t.Array(t.Object({
            id:t.String(),
            apiKey:t.String(),
            name: t.String(),
            creditsConsumed: t.Number(),
            lastUsed: t.Nullable(t.Date()),
            disabled: t.Boolean()

        }))
    })
    export type getApiKeysResponseSchema = typeof getApiKeysResponseSchema.static;



}
   