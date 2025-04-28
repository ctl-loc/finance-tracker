// auth middleware
export { default } from "next-auth/middleware";

// export function middleware(req: NextRequest) {
//     // authMiddleware(req);
//     const res = NextResponse.next();
//     return res;
// }

export const config = {
    matcher: "/",
};
