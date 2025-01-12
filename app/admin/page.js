"use client";

import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";
import {
	getAllLayouts,
	getLayoutDetails,
	createLayout,
	setDefaultLayout,
} from "@/services/authService";
import LayoutSelector from "@/components/admin/LayoutSelector";
import CreateLayoutSheet from "@/components/admin/CreateLayoutSheet";
import LayoutPreview from "@/components/admin/LayoutPreview";

// Constants
const PAGES = {
	PAGE_ONE: 1,
	PAGE_TWO: 2,
};

const addableComponents = ["about_me", "address", "dob"];

const AdminPage = () => {
	const { toast } = useToast();
	const [layouts, setLayouts] = useState([]);
	const [selectedLayout, setSelectedLayout] = useState(null);
	const [currentDefaultId, setCurrentDefaultId] = useState(null);
	const [pageComponents, setPageComponents] = useState({
		[PAGES.PAGE_ONE]: [],
		[PAGES.PAGE_TWO]: [],
	});
	const [newLayoutName, setNewLayoutName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	useEffect(() => {
		const fetchLayouts = async () => {
			try {
				const data = await getAllLayouts();
				setLayouts(data);
				const defaultLayout = data.find((layout) => layout.is_default);
				if (defaultLayout) {
					const details = await getLayoutDetails(defaultLayout.id);
					setSelectedLayout(details);
					setCurrentDefaultId(defaultLayout.id);
				} else if (data.length > 0) {
					const details = await getLayoutDetails(data[0].id);
					setSelectedLayout(details);
				}
			} catch (error) {
				toast({
					title: "Error fetching layouts",
					description: error.message,
					variant: "destructive",
				});
			}
		};

		fetchLayouts();
	}, [toast]);

	const handleLayoutChange = async (layoutId) => {
		try {
			setIsLoading(true);
			const updatedLayout = await setDefaultLayout(
				currentDefaultId,
				layoutId
			);
			setSelectedLayout(updatedLayout);
			setCurrentDefaultId(layoutId);

			// Refresh layouts to update is_default status
			const newLayouts = await getAllLayouts();
			setLayouts(newLayouts);

			toast({
				title: "Default layout updated",
				description: `${updatedLayout.layout_name} is now the default layout`,
			});
		} catch (error) {
			toast({
				title: "Error updating default layout",
				description: error.message,
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddComponent = (pageId, component) => {
		setPageComponents((prev) => ({
			...prev,
			[pageId]: [...prev[pageId], component],
		}));
	};

	const handleRemoveComponent = (pageId, componentToRemove) => {
		setPageComponents((prev) => ({
			...prev,
			[pageId]: prev[pageId].filter(
				(component) => component !== componentToRemove
			),
		}));
	};

	const handleSaveLayout = async () => {
		try {
			if (!newLayoutName.trim()) {
				toast({
					title: "Error",
					description: "Please enter a layout name",
					variant: "destructive",
				});
				return;
			}

			const pages = {};
			Object.entries(pageComponents).forEach(([pageId, components]) => {
				if (components.length > 0) {
					pages[pageId] = components;
				}
			});

			await createLayout(newLayoutName, pages);
			const newLayouts = await getAllLayouts();
			setLayouts(newLayouts);
			setNewLayoutName("");
			setPageComponents({
				[PAGES.PAGE_ONE]: [],
				[PAGES.PAGE_TWO]: [],
			});
			setIsSheetOpen(false);
			toast({
				title: "Success",
				description: "Layout created successfully",
			});
		} catch (error) {
			toast({
				title: "Error creating layout",
				description: error.message,
				variant: "destructive",
			});
		}
	};

	return (
		<div className="p-8 w-full">
			<h1 className="text-2xl font-bold mb-6">Admin Page</h1>
			<div className="flex w-full justify-around flex-col gap-4">
				<LayoutSelector
					layouts={layouts}
					selectedLayout={selectedLayout}
					onLayoutChange={handleLayoutChange}
					isLoading={isLoading}
				/>
				<CreateLayoutSheet
					isOpen={isSheetOpen}
					onOpenChange={setIsSheetOpen}
					newLayoutName={newLayoutName}
					onNameChange={setNewLayoutName}
					pageComponents={pageComponents}
					addableComponents={addableComponents}
					onAddComponent={handleAddComponent}
					onRemoveComponent={handleRemoveComponent}
					onSave={handleSaveLayout}
					PAGES={PAGES}
				/>
			</div>
			<LayoutPreview layout={selectedLayout} />
		</div>
	);
};

export default AdminPage;
