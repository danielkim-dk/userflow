export default function LayoutPreview({ layout }) {
	if (!layout) return null;

	return (
		<div className="flex-1 mt-8">
			<h2 className="text-xl font-semibold mb-4">
				Layout Preview: {layout.layout_name}
			</h2>
			<div className="grid grid-cols-2 gap-6">
				{layout.layout_pages.map((page) => (
					<div
						key={page.page_number}
						className="border rounded-lg p-4"
					>
						<h3 className="text-lg font-semibold mb-4">
							Page {page.page_number}
						</h3>
						<div className="space-y-2">
							{page.components.map((component) => (
								<div
									key={component}
									className="p-2 bg-gray-50 rounded"
								>
									{component}
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
