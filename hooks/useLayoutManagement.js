import { useLayout } from "@/context/LayoutContext";
import * as authService from "@/services/authService";

export function useLayoutManagement() {
	const { updateLayoutData } = useLayout();

	const fetchLayoutData = async (layoutId, userId) => {
		try {
			const [layoutPages, userData] = await Promise.all([
				authService.getLayoutPages(layoutId),
				authService.getUserLayout(userId)
			]);

			// Check if layoutPages exists and has data
			if (!layoutPages || layoutPages.length === 0) {
				console.error("No layout pages found for layoutId:", layoutId);
				return {
					pages: [],
					availablePages: [],
					currentPage: userData?.current_page || 1
				};
			}

			const pages = layoutPages.map((page) => ({
				pageNumber: page.page_number,
				components: page.components,
			}));

			const availablePages = layoutPages.map((page) => page.page_number);

			return {
				pages,
				availablePages,
				currentPage: userData?.current_page || pages[0]?.pageNumber || 1,
			};
		} catch (error) {
			console.error("Error fetching layout pages:", error);
			return null;
		}
	};

	const handleUserLayout = async (userId) => {
		try {
			const userData = await authService.getUserLayout(userId);
			let layoutId;

			if (!userData?.layout_id) {
				const defaultLayout = await authService.getDefaultLayout();
				if (!defaultLayout) {
					throw new Error("No default layout found");
				}
				layoutId = defaultLayout.id;
				await authService.updateUserLayout(userId, layoutId);
			} else {
				layoutId = userData.layout_id;
			}

			const layoutData = await fetchLayoutData(layoutId, userId);
			if (!layoutData) {
				throw new Error("Failed to fetch layout data");
			}

			updateLayoutData({
				...layoutData,
				layoutId,
				userId,
				currentPage: layoutData.currentPage,
			});

			return layoutData;
		} catch (error) {
			console.error("Error handling user layout:", error);
			throw error; // Propagate the error to handle it in SignIn component
		}
	};

	return {
		fetchLayoutData,
		handleUserLayout,
	};
}
