import { Elysia } from "elysia";
import { app as authApp } from "./modules/auth";

const app = new Elysia()
  .use(authApp)
  .get("/", () => "HYsh")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

