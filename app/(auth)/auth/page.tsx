import type { Metadata } from "next";
import AuthClient from "./AuthClient";

export const metadata: Metadata = {
	title: "Sign In",
	description:
		"Sign in to your Kadam account to manage your store's debt tracking and customer relationships.",
	keywords: [
		"sign in",
		"authentication",
		"debt management",
		"store management",
		"customer tracking",
	],
	robots: {
		index: false,
		follow: false,
	},
};

const AuthPage = () => {
	return <AuthClient />;
};

export default AuthPage;
