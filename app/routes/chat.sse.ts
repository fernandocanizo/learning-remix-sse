import type { LoaderFunctionArgs } from "@remix-run/node"
import type { Message } from "@prisma/client"

import { EventStream } from "@remix-sse/server"

import { emitter } from "~/only.server/emitter"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return new EventStream(request, send => {
    const handleMessage = (message: Message) => {
      console.debug('>>> handleMessage', {message})
      send(JSON.stringify(message))
    }

    emitter.on("message", handleMessage)

    const clear = () => {
      emitter.off("message", handleMessage)
    }

    return clear
  })
}

