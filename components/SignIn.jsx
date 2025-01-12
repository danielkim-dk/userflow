"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as authService from "@/services/authService";
import { useLayout } from "@/context/LayoutContext";

const SignIn = () => {
	const router = useRouter();
	const { updateLayoutData } = useLayout();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isLoading) return;

		setError("");
		setIsLoading(true);

		try {
			// Validate password
			if (password.length < 6) {
				setError("Password must be at least 6 characters long");
				setIsLoading(false);
				return;
			}

			// Try to sign in
			let userData;
			try {
				const { data } = await authService.signInWithEmail(
					email,
					password
				);
				if (!data?.user) throw new Error("Sign in failed");

				// Get user profile
				userData = await authService.getUserProfile(data.user.id);
				console.log("Got user profile:", userData);
			} catch (signInError) {
				console.log("Sign in failed, trying signup:", signInError);

				// If sign in fails, try to sign up
				const { data } = await authService.signUpWithEmail(
					email,
					password
				);
				if (!data?.user) throw new Error("Sign up failed");

				// Get user profile after signup
				userData = await authService.getUserProfile(data.user.id);
				console.log("Got user profile after signup:", userData);
			}

			if (!userData) {
				throw new Error("Failed to load user profile");
			}

			// Update layout data
			const layoutData = {
				userId: userData.id,
				layoutId: userData.layout.id,
				currentPage: userData.current_page,
				pages: userData.layout.pages,
				availablePages: userData.layout.pages.map((page) =>
					page.page_number.toString()
				),
			};
			console.log("Updating layout data:", layoutData);
			updateLayoutData(layoutData);

			// Navigate to current page
			console.log("Navigating to page:", userData.current_page);
			router.push(`/${userData.current_page}`);
		} catch (error) {
			console.error("Authentication error:", error);
			setError(error.message || "An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="border border-black p-4 rounded-xl w-[80%] max-w-[400px] shadow-2xl"
		>
			<Label htmlFor="email">Email</Label>
			<Input
				className="mb-4"
				type="email"
				id="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Enter your email"
				required
			/>

			<Label htmlFor="password">Password</Label>
			<Input
				className="mb-4"
				type="password"
				id="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Enter your password"
				required
			/>

			{error && <div className="text-red-500 mb-4">{error}</div>}

			<Button type="submit" disabled={isLoading} className="w-full">
				{isLoading ? "Loading..." : "Sign In"}
			</Button>
		</form>
	);
};

export default SignIn;
