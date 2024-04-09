import type { ActionFunctionArgs } from "@remix-run/node"

import { json } from "@remix-run/node"
import { useActionData, useLoaderData, Form } from "@remix-run/react"

import { db } from "~/only.server/db"

const authorId = 5 // this should come from "login"

export const loader = async () => {
  const messages = await db.message.findMany()
  return json({ messages })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()

  const message = formData.get("message")

  if (message && typeof message === "string") {
    try {
      await db.message.create({ data: { content: message, authorId, } })
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
  const { messages } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  return (
    <>
      <Form method="post">
        <label htmlFor="message">Message</label>
        <input type="text" name="message" id="message" required />
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
