"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getAllUsersData } from "@/services/authService";
import UserTable from "@/components/data/UserTable";
import RefreshButton from "@/components/data/RefreshButton";

export default function DataPage() {
	const { toast } = useToast();
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const fetchUsers = async () => {
		setIsLoading(true);
		try {
			const data = await getAllUsersData();
			setUsers(data);
		} catch (error) {
			toast({
				title: "Error fetching users",
				description: error.message,
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	return (
		<div className="w-full p-8">
			<h1 className="text-2xl font-bold mb-6">User Data</h1>
			<RefreshButton onClick={fetchUsers} isLoading={isLoading} />
			<UserTable users={users} />
		</div>
	);
}
