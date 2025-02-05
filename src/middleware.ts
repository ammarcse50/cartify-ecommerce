import { cookies } from "next/headers"
import { NextResponse } from "next/server"


export const middleware = async (request) => {

    const token = await cookies().get("next-auth.session-token")
    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()

}

export const config = {
    matcher: ["/cart", "/dashboard"]
}