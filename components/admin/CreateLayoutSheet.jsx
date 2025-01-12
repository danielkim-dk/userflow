import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import ComponentList from "./ComponentList";

export default function CreateLayoutSheet({
	isOpen,
	onOpenChange,
	newLayoutName,
	onNameChange,
	pageComponents,
	addableComponents,
	onAddComponent,
	onRemoveComponent,
	onSave,
	PAGES,
}) {
	return (
		<Sheet open={isOpen} onOpenChange={onOpenChange}>
			<SheetTrigger asChild>
				<Button>Create New Layout</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Create New Layout</SheetTitle>
					<SheetDescription>
						Configure pages and components for your new layout
					</SheetDescription>
				</SheetHeader>
				<div className="space-y-6 py-4">
					<div>
						<Input
							id="layoutName"
							placeholder="Enter layout name"
							value={newLayoutName}
							onChange={(e) => onNameChange(e.target.value)}
						/>
					</div>
					<div className="space-y-4">
						{Object.values(PAGES).map((pageId) => (
							<div
								key={pageId}
								className="border rounded-lg p-4"
							>
								<h3 className="text-lg font-semibold mb-4">
									Page {pageId}
								</h3>
								<ComponentList
									pageId={pageId}
									components={pageComponents[pageId]}
									addableComponents={addableComponents}
									onAddComponent={onAddComponent}
									onRemoveComponent={onRemoveComponent}
								/>
							</div>
						))}
					</div>
					<Button onClick={onSave} className="w-full">
						Save Layout
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
