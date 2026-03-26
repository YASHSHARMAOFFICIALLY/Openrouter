import {t} from "elysia";
export namespace ApiKeyModel {

    export const CrateApiKeySchema = t.Object({
        name:t.String()
    })

    export type createApiKeySchema = typeof CrateApiKeySchema.static

    export const disableApiKeySchema = t.Object({
        id:t.String()
    })

    export type disableApiKeySchema = typeof disableApiKeySchema.static

    export const createAPiKeyResponse = t.Object({
        id:t.String(),
        apiKey:t.String()
    })

    export type  createApiKeyResponse = typeof createAPiKeyResponse.static

    export const disableApiKeyResponseSchema = t.Object({
        id:t.Literal("Disabled api key sucessfully")

    })

    export type disableApiKeyResponseSchema = typeof disableApiKeyResponseSchema.static

    export const getApiKeysResponseSchema = t.Object({
        name:t.String(),
        apiKey:t.String(),
        lastUsed:t.Date(),
        creditConsumed:t.Number(),
   

    })
    export type getApiKeysResponseSchema = typeof getApiKeysResponseSchema.static

     export const DeleteApiKeyResponseSchema = t.Object({
        id:t.Literal("Deleted api key sucessfully")
        
    })

    export type DeleteApiKeyResponseSchema = typeof DeleteApiKeyResponseSchema.static
}