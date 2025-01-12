import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function RefreshButton({ onClick, isLoading }) {
	return (
		<Button
			onClick={onClick}
			disabled={isLoading}
			className="mb-4"
		>
			{isLoading ? (
				<>
					<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
					Refreshing...
				</>
			) : (
				"Refresh Data"
			)}
		</Button>
	);
}
