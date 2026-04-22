import { cookies } from "next/headers"

export async function POST() {
  const cookieStore = await cookies()

  cookieStore.delete("access_token")
  cookieStore.delete("is_loggedin")
  cookieStore.delete("accessToken")

  return Response.json({ success: true })
}
