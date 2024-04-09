import type { MetaFunction } from "@remix-run/node"

import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useEventSource } from "remix-utils/sse/react"

export const meta: MetaFunction = () => {
  return [
    { title: "SSE Demo" },
    { name: "description", content: "A pet project to learn server-sent events with Remix" },
  ]
}

export async function loader() {
  return json({ time: new Date().toISOString() })
}

export default function Time() {
  const loaderData = useLoaderData<typeof loader>()
  const time = useEventSource("/sse-time", { event: "time" }) ?? loaderData.time

  return (
    <time dateTime={time}>
      {new Date(time).toLocaleTimeString("en", {
        minute: "2-digit",
        second: "2-digit",
        hour: "2-digit",
      })}
    </time>
  )
}
