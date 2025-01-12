import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ComponentList({ 
	pageId, 
	components = [], 
	addableComponents, 
	onAddComponent, 
	onRemoveComponent 
}) {
	const renderComponentList = () => {
		return components.length > 0 ? (
			components.map((component) => (
				<div
					key={component}
					className="flex items-center justify-between p-2"
				>
					<span>{component}</span>
					<Button
						variant="destructive"
						size="sm"
						onClick={() => onRemoveComponent(pageId, component)}
					>
						Remove
					</Button>
				</div>
			))
		) : (
			<div className="text-gray-500">No components added yet</div>
		);
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-semibold">Components</h3>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">Add Component</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>
							Available Components
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{addableComponents.map((component) => (
							<DropdownMenuItem
								key={component}
								onClick={() =>
									onAddComponent(pageId, component)
								}
							>
								{component}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="space-y-2">{renderComponentList()}</div>
		</div>
	);
}
