import {prisma} from "db"
const API_KEY_LENGTH = 32
const ALPHABET_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
export abstract class ApiKeyService {
    

    
    static createRandomApiKey(){
        let suffixKey = "";
        for(let i = 0;i<API_KEY_LENGTH;i++){
            const randomIndex = Math.floor(Math.random() * ALPHABET_SET.length)
            suffixKey += ALPHABET_SET[randomIndex]
        }
        return `sk-or-v1-${suffixKey}`

        static async createApiKey(name:string,userId:number):Promise<
        {
            id:string,
            apiKey:string
        }>{
            const apiKey = ApiKeyService.createRandomApiKey()
            const apiKeydb = await prisma.apiKey.create({
                data:{
                    name,
                    apiKey,
                    userId 
                    
                }
            })
            return {
                id:apiKeydb.id.toString(),
                apiKey

            }
        }

    

    static async getApiKeys(userId:number){
        const apiKeys = await prisma.apiKey.findMany({
            where:{
                userId:userId
            }
        })
        return(apiKeys).map(apiKey => ({
            id:apiKey.id,
            name:apiKey.name,
            creditConsumed:apiKey.creditConsumed,
            lastused:apiKey.lastUsed,
        }))
    }


}
}