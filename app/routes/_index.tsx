import type { ActionFunctionArgs } from "@remix-run/node"

import { json, redirect } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"

import { userCookie } from "~/only.server/cookie"

export const loader = async () => {
  const users = [
    { name: "conan", id: 5 },
    { name: "groucho", id: 4 },
  ]

  return json({ users })
}

export const action = async ({ request}: ActionFunctionArgs) => {
  const formData = await request.formData()
  const authorId = formData.get("authorId")

  return redirect("/chat", {
    headers: {
      "Set-Cookie": await userCookie.serialize(authorId),
    }
  })
}

export default function App() {
  const ld = useLoaderData<typeof loader>()

  return (
    <Form method="post">
      <label htmlFor="authorId">Who are you?
        <select name="authorId" id="authorId">
          <option value="">--Please choose an option--</option>
          { ld.users.length && ld.users.map(u => (<option key={u.id} value={u.id}>{u.name}</option>)) }
        </select>
      </label>

      <input type="submit" value="Send" />
    </Form>
  )
}
