"use client";

import { createContext, useContext, useState } from "react";

const LayoutContext = createContext();

export function LayoutProvider({ children }) {
	const [layoutData, setLayoutData] = useState({
		layoutId: null,
		userId: null,
		currentPage: "1",
		pages: [], // Array of pages with their components
		availablePages: null,
	});

	const updateLayoutData = (newData) => {
		console.log("LayoutContext: Updating layout data with:", newData);
		setLayoutData((prev) => {
			const updated = { ...prev, ...newData };
			console.log("LayoutContext: Updated layout data:", updated);
			return updated;
		});
	};

	return (
		<LayoutContext.Provider value={{ layoutData, updateLayoutData }}>
			{children}
		</LayoutContext.Provider>
	);
}

export function useLayout() {
	const context = useContext(LayoutContext);
	if (!context) {
		throw new Error("useLayout must be used within a LayoutProvider");
	}
	return context;
}
