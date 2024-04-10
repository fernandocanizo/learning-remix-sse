import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"

import { json } from "@remix-run/node"
import { useActionData, useLoaderData, Form } from "@remix-run/react"

import { db } from "~/only.server/db"
import { userCookie } from "~/only.server/cookie"
import { emitter } from "~/only.server/emitter"
import { useEventStream } from "@remix-sse/client"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authorId = await userCookie.parse(request.headers.get("cookie"))
  const messages = await db.message.findMany()

  return json({ messages, authorId })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()

  const message = formData.get("message")
  const authorId = Number(formData.get("author_id"))

  if (message && authorId && typeof message === "string") {
    try {
      const dbMessage = await db.message.create({ data: { content: message, authorId, } })
      emitter.emit("message", dbMessage)
      return json(null, { status: 201 })

    } catch (error) {
      if (error instanceof Error) {
        return json({ error: error.message }, { status: 400 })
      }
      throw error
    }
  }

  return json({ error: "No message received" }, { status: 400 })
}

export default function Chat() {
  const { messages, authorId } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  const newMessage = useEventStream("/chat/sse", {
    returnLatestOnly: true,
  })
  console.debug({newMessage})

  return (
    <>
      <Form method="post">
        <input type="hidden" name="author_id" id="author_id" value={authorId} />
        <label>Message
          <input type="text" name="message" id="message" required />
        </label>
        <button>Send</button>
      </Form>

      <ul>
        {messages.map(message => {
          return <li key={message.id}>{message.content}</li>
        })}
      </ul>

      { actionData?.error && (
        <p>{actionData.error}</p>
      )}
    </>
  )
}
