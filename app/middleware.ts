import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Redirect to this page if not authenticated
  },
});

export const config = {
  matcher: ["/dashboard", "/settings"], // Specify the routes to protect
};
