import { UserPlus } from "lucide-react";
import { Button } from "./ui/button";

const FloatingMenu = () => {
	return (
		<Button
			size="lg"
			className="fixed right-6 bottom-20 z-50 rounded-full shadow-lg"
			onClick={() => {
				console.log("Floating button clicked");
			}}
		>
			<UserPlus className="h-8 w-8" />
		</Button>
	);
};
export default FloatingMenu;
