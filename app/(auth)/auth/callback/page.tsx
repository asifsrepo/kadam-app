import { Suspense } from "react";
import LoadingOverlay from "~/LoadingOverlay";
import AuthCallbackClient from "./AuthCallbackClient";

const AuthCallbackPage = () => {
	return (
		<>
			<LoadingOverlay isLoading />
			<Suspense>
				<AuthCallbackClient />
			</Suspense>
		</>
	);
};

export default AuthCallbackPage;
