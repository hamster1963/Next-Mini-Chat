import { NextResponse, NextRequest } from 'next/server'

export async function GET(req: NextRequest, res: NextResponse) {
  return new NextResponse(null, {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}
