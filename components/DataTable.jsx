"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export function DataTable({ data }) {
	if (!data || data.length === 0) {
		return <div>No users found</div>;
	}

	console.log("data from datatable", data);
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Email</TableHead>
						<TableHead>About Me</TableHead>
						<TableHead>Date of Birth</TableHead>
						<TableHead>Address</TableHead>
						<TableHead>Layout</TableHead>
						<TableHead>Current Page</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((user) => (
						<TableRow key={user.id}>
							<TableCell>{user.email}</TableCell>
							<TableCell>
								{user.formData?.about_me || "Not provided"}
							</TableCell>
							<TableCell>
								{user.formData?.dob || "Not provided"}
							</TableCell>
							<TableCell>
								{user.formData?.address || "Not provided"}
							</TableCell>
							<TableCell>
								{user.layout?.layout_name || "Unknown Layout"}
							</TableCell>
							<TableCell>{user.current_page}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
