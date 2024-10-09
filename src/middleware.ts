import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log(req.nextauth.token);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (token) {
          return true;
        }
        return false;
      },
    },
  },
);

export const config = {
  matcher: ["/", "/trip/:path*", "/account/:path*"],
};
