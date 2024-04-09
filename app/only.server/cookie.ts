import { createCookie } from "@remix-run/node"

export const userCookie = createCookie("_chat_userId")
