import {prisma} from "db"
const API_KEY_LENGTH = 32
const ALPHABET_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
export abstract class ApiKeyService {
    static createRandomApiKey(){
        let suffix = ""
        for (let i = 0;i<API_KEY_LENGTH;i++){
            suffix += ALPHABET_SET[Math.floor(Math.random()*ALPHABET_SET.length)]
        }
        return `sk-or -${suffix}`
    }


    static async createApiKey(name: string, userId: number): Promise<{
        id: string,
        apiKey: string
    }> {

        const apiKey = ApiKeyService.createRandomApiKey();
        const apiKeyDb = await prisma.apiKey.create({
            data: {
                name, 
                apiKey,
                userId
            }
        })

        return {
            id: apiKeyDb.id.toString(),
            apiKey
        }
    }


     static async getApiKeys(userId: number) {
        const apiKeys = await prisma.apiKey.findMany({
            where: {
                userId: userId,
                deleted: false
            }
        })

        return apiKeys.map(apiKey => ({
            id: apiKey.id.toString(),
            apiKey: apiKey.apiKey,
            name: apiKey.name,
            credisConsumed: apiKey.creditsConsumed,
            lastUsed: apiKey.lastUsed,
            disabled: apiKey.disbaled
        }))
    }

    static async updateApiKeyDisabled(apiKeyId: number, userId: number, disabled: boolean) {
        await prisma.apiKey.update({
            where: {
                id: apiKeyId,
                userId
            },
            data: {
                disabled
            }
        })
    }

     static async delete(id: number, userId: number) {
        await prisma.apiKey.update({
            where: {
                id,
                userId
            },
            data: {
                deleted: true
            }
        })
    }
}



    
    
}