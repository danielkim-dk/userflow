export const metadata = {
	title: "Userflow App",
	description: "A userflow template",
};

export default function UserLayout({ children }) {
	return (
		<main className="h-screen flex flex-col items-center">{children}</main>
	);
}
