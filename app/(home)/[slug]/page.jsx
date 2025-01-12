"use client";

import { useRouter, useParams } from "next/navigation";
import AboutMe from "@/components/AboutMe";
import AddressForm from "@/components/AddressForm";
import Dob from "@/components/Dob";
import { Button } from "@/components/ui/button";
import { useFormContext, FormProvider } from "@/context/FormContext";
import SuccessPage from "@/components/Success";
import { useEffect, useState } from "react";
import ProgressBar from "@/components/ProgressBar";
import { useLayout } from "@/context/LayoutContext";
import * as authService from "@/services/authService";

const COMPONENTS = {
	about_me: AboutMe,
	address: AddressForm,
	dob: Dob,
};

function PageContent() {
	const router = useRouter();
	const params = useParams();
	const { formState } = useFormContext();
	const page = params.slug;
	const { layoutData, updateLayoutData } = useLayout();
	const [isNavigating, setIsNavigating] = useState(false);

	console.log("Page render - layoutData:", layoutData);
	console.log("Current page:", page);

	// Redirect if needed
	useEffect(() => {
		console.log("Navigation effect - layoutData:", layoutData);
		console.log("Navigation effect - page:", page);

		if (!layoutData?.userId || isNavigating) return;

		const currentPage = layoutData.currentPage?.toString();
		if (currentPage && page !== currentPage) {
			console.log("Redirecting from", page, "to", currentPage);
			router.push(`/${currentPage}`);
		}
	}, [layoutData, page, isNavigating]);

	const handleNext = async () => {
		if (isNavigating || !layoutData?.userId) return;

		try {
			setIsNavigating(true);
			const pageIndex = parseInt(page) - 1;
			const currentComponents = layoutData.pages[pageIndex]?.components;

			if (!currentComponents) {
				console.error("No components found for page:", page);
				return;
			}

			// Save form data for each component on the current page
			for (const component of currentComponents) {
				if (formState[component]) {
					await authService.saveFormData(
						layoutData.userId,
						component,
						formState[component]
					);
				}
			}

			// Calculate next page
			const nextPage = parseInt(page) + 1;
			const newPage =
				nextPage <= layoutData.pages.length
					? nextPage.toString()
					: "success";

			console.log("Updating current page to:", newPage);

			// Update database
			await authService.updateUserCurrentPage(layoutData.userId, newPage);

			// Update layout context
			updateLayoutData({
				...layoutData,
				currentPage: newPage,
			});

			// Navigate to next page
			router.push(`/${newPage}`);
		} catch (error) {
			console.error("Error in handleNext:", error);
		} finally {
			setIsNavigating(false);
		}
	};

	// Show loading state
	if (!layoutData?.userId) {
		console.log("No layout data yet, showing loading...");
		return (
			<div className="flex justify-center items-center min-h-screen">
				Loading...
			</div>
		);
	}

	// Show success page
	if (page === "success" && layoutData.currentPage === "success") {
		return (
			<div className="flex flex-col w-[100vw] items-center justify-center bg-white">
				<ProgressBar progress={100} />
				<div className="flex flex-col w-[80%] max-w-[800px] items-center justify-center border border-black mt-8 rounded-xl shadow-xl">
					<SuccessPage />
				</div>
			</div>
		);
	}

	// Get current page components
	const pageIndex = parseInt(page) - 1;
	console.log("Page index:", pageIndex);
	console.log("Layout pages:", layoutData.pages);
	console.log("Current page data:", layoutData.pages[pageIndex]);

	const currentComponents = layoutData.pages[pageIndex]?.components;
	console.log("Current components:", currentComponents);

	if (!currentComponents) {
		console.log("No components found for page:", pageIndex);
		return (
			<div className="flex justify-center items-center min-h-screen">
				Loading components...
			</div>
		);
	}

	// Calculate progress
	const progress = ((pageIndex + 1) / layoutData.pages.length) * 100;

	return (
		<div className="flex flex-col w-[100vw] items-center justify-center bg-white">
			<ProgressBar progress={progress} />
			<div className="flex flex-col w-[80%] max-w-[800px] items-center justify-center border border-black mt-8 rounded-xl shadow-xl">
				{currentComponents.map((comp, index) => {
					console.log("Rendering component:", comp);
					const Component = COMPONENTS[comp];
					console.log("Found component:", Component);
					return Component ? (
						<div
							key={index}
							className="flex flex-col w-full items-center justify-center"
						>
							<Component />
						</div>
					) : (
						console.log("No component found for:", comp)
					);
				})}
				<Button
					onClick={handleNext}
					disabled={isNavigating}
					className="m-4"
				>
					{isNavigating ? "Saving..." : "Next"}
				</Button>
			</div>
		</div>
	);
}

export default function Page() {
	return (
		<FormProvider>
			<PageContent />
		</FormProvider>
	);
}
