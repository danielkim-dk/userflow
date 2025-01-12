import { supabase } from "../utils/supabaseClient";

// Auth functions
export async function getCurrentUser() {
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();
	if (error) throw error;
	return user;
}

export async function signInWithEmail(email, password) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) throw error;
	return { data };
}

export async function signUpWithEmail(email, password) {
	// First try to sign up
	const { data: authData, error: authError } = await supabase.auth.signUp({
		email,
		password,
	});

	if (authError) throw authError;

	if (authData.user) {
		// Get default layout
		const { data: defaultLayout, error: layoutError } = await supabase
			.from("layouts")
			.select("id")
			.eq("is_default", true)
			.single();

		if (layoutError) throw layoutError;
		if (!defaultLayout) throw new Error("No default layout found");

		// Create user profile with default layout
		const { error: profileError } = await supabase.from("users").insert([
			{
				id: authData.user.id,
				layout_id: defaultLayout.id,
				email,
				current_page: "1", // Start at page 1
			},
		]);

		if (profileError) throw profileError;
	}

	return { data: authData };
}

// User data functions
export async function getUserProfile(userId) {
	if (!userId) throw new Error("User ID is required");

	// First get user data
	const { data: userData, error: userError } = await supabase
		.from("users")
		.select("id, email, layout_id, current_page")
		.eq("id", userId)
		.single();

	if (userError) throw userError;
	if (!userData) throw new Error("User profile not found");

	// Then get layout data with components
	const { data: layoutData, error: layoutError } = await supabase
		.from("layout_pages")
		.select("page_number, components")
		.eq("layout_id", userData.layout_id)
		.order("page_number");

	if (layoutError) throw layoutError;
	if (!layoutData || layoutData.length === 0)
		throw new Error("Layout data not found");

	// Make sure current_page is valid
	const current_page = userData.current_page?.toString() || "1";
	const isValidPage =
		layoutData.some(
			(page) => page.page_number.toString() === current_page
		) || current_page === "success";

	if (!isValidPage) {
		await updateUserCurrentPage(userId, "1");
		userData.current_page = "1";
	}

	return {
		id: userId,
		email: userData.email,
		current_page: userData.current_page,
		layout: {
			id: userData.layout_id,
			pages: layoutData,
		},
	};
}

export async function updateUserCurrentPage(userId, currentPage) {
	if (!userId) throw new Error("User ID is required");

	const { error } = await supabase
		.from("users")
		.update({ current_page: currentPage.toString() })
		.eq("id", userId);

	if (error) throw error;
}

// Form data functions
export async function saveFormData(userId, component, data) {
	if (!userId) throw new Error("User ID is required");
	if (!component) throw new Error("Component name is required");

	switch (component) {
		case "about_me": {
			const { error } = await supabase
				.from("about_me")
				.upsert({ id: userId, text: data.text })
				.eq("id", userId);
			if (error) throw error;
			break;
		}
		case "address": {
			const { error } = await supabase
				.from("address")
				.upsert({
					id: userId,
					address_line_1: data.address1 || "",
					address_line_2: data.address2 || "",
					city: data.city || "",
					state: data.state || "",
					zipcode: data.zip || "",
				})
				.eq("id", userId);
			if (error) throw error;
			break;
		}
		case "dob": {
			const { error } = await supabase
				.from("dob")
				.upsert({
					id: userId,
					month: data.month,
					day: data.day,
					year: data.year,
				})
				.eq("id", userId);
			if (error) throw error;
			break;
		}
		default:
			throw new Error(`Unknown component type: ${component}`);
	}
}

export async function getAllUsersData() {
	// Get all users with their layout info
	const { data: users, error: usersError } = await supabase.from("users")
		.select(`
			id,
			email,
			current_page,
			layout_id,
			layout:layout_id (
				layout_name,
				is_default
			)
		`);

	if (usersError) throw usersError;

	// Get data for each user from all tables
	const usersWithData = await Promise.all(
		users.map(async (user) => {
			// Get about_me data
			const { data: aboutMe } = await supabase
				.from("about_me")
				.select("text")
				.eq("id", user.id)
				.single();

			// Get address data
			const { data: address } = await supabase
				.from("address")
				.select("address_line_1, address_line_2, city, state, zipcode")
				.eq("id", user.id)
				.single();

			// Get dob data
			const { data: dob } = await supabase
				.from("dob")
				.select("month, day, year")
				.eq("id", user.id)
				.single();

			// Format address and dob for display
			const formattedAddress = address
				? `${address.address_line_1}${
						address.address_line_2
							? `, ${address.address_line_2}`
							: ""
				  }, ${address.city}, ${address.state} ${address.zipcode}`
				: null;

			const formattedDob = dob
				? `${dob.month} ${dob.day}, ${dob.year}`
				: null;

			return {
				...user,
				formData: {
					about_me: aboutMe ? aboutMe.text : null,
					address: formattedAddress,
					dob: formattedDob,
				},
			};
		})
	);

	return usersWithData;
}

// Layout management functions
export async function getAllLayouts() {
	const { data, error } = await supabase
		.from("layouts")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) throw error;
	return data;
}

export async function getLayoutDetails(layoutId) {
	const { data, error } = await supabase
		.from("layouts")
		.select(
			`
			id,
			layout_name,
			created_at,
			is_default,
			layout_pages (
				page_number,
				components
			)
		`
		)
		.eq("id", layoutId)
		.single();

	if (error) throw error;
	return data;
}

export async function createLayout({ name, pages }) {
	// First create the layout
	const { data: layoutData, error: layoutError } = await supabase
		.from("layouts")
		.insert([{ layout_name: name, is_default: false }])
		.select()
		.single();

	if (layoutError) throw layoutError;

	// Then create the pages
	const layoutPages = Object.entries(pages).map(
		([pageNumber, components]) => ({
			layout_id: layoutData.id,
			page_number: parseInt(pageNumber),
			components,
		})
	);

	const { error: pagesError } = await supabase
		.from("layout_pages")
		.insert(layoutPages);

	if (pagesError) throw pagesError;

	return layoutData;
}

export async function setDefaultLayout(currentDefaultId, newDefaultId) {
	// Set current default to false
	if (currentDefaultId) {
		const { error: resetError } = await supabase
			.from("layouts")
			.update({ is_default: false })
			.eq("id", currentDefaultId);

		if (resetError) throw resetError;
	}

	// Set new layout as default
	const { error: updateError } = await supabase
		.from("layouts")
		.update({ is_default: true })
		.eq("id", newDefaultId);

	if (updateError) throw updateError;

	// Return the updated layout details
	return getLayoutDetails(newDefaultId);
}
