import { Elysia } from "elysia";
import { app as authApp } from "./modules/auth";
import {app as apiKeyApp} from "./modules/apiKeys"

const app = new Elysia()
  .use(authApp)
  .use(apiKeyApp)
  .listen(3000)


console.log(
  `🦊 Elysia is runningggg at ${app.server?.hostname}:${app.server?.port}`
);

