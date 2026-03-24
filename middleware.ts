import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const isPublic = process.env.NEXT_PUBLIC_MODE === 'true'
  if (isPublic) return NextResponse.next()

  const expectedUser = process.env.BASIC_AUTH_USERNAME
  const expectedPass = process.env.BASIC_AUTH_PASSWORD
  if (!expectedUser || !expectedPass) return NextResponse.next()

  const auth = request.headers.get('authorization')
  if (auth) {
    const [scheme, encoded] = auth.split(' ')
    if (scheme === 'Basic' && encoded) {
      const expected = btoa(`${expectedUser}:${expectedPass}`)
      if (encoded === expected) {
        return NextResponse.next()
      }
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="tabilog"' },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
