import SignIn from "@/components/SignIn";
import Image from "next/image";

export default function Home() {
	return (
		<div className="flex flex-col h-screen items-center justify-center">
			<SignIn />
		</div>
	);
}
