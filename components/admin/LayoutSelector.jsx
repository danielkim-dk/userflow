import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LayoutSelector({ layouts, selectedLayout, onLayoutChange, isLoading }) {
	return (
		<div className="w-[300px]">
			<h2 className="text-xl font-semibold mb-4">Choose Layout</h2>
			<Select
				value={selectedLayout?.id?.toString()}
				onValueChange={onLayoutChange}
				disabled={isLoading}
			>
				<SelectTrigger>
					<SelectValue placeholder="Select Layout" />
				</SelectTrigger>
				<SelectContent>
					{layouts.map((layout) => (
						<SelectItem
							key={layout.id}
							value={layout.id.toString()}
						>
							{layout.layout_name}
							{layout.is_default && " (Default)"}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
