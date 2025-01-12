"use client";

import React, { useState, useEffect } from "react";
import { useFormContext } from "@/context/FormContext";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const AddressForm = () => {
	const [address, setAddress] = useState({
		address1: "",
		address2: "",
		city: "",
		state: "",
		zip: "",
	});

	const { updateFormState } = useFormContext();

	useEffect(() => {
		updateFormState("address", address);
	}, [address, updateFormState]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setAddress((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<form className="flex flex-col gap-4 w-full max-w-xl p-6">
			<div className="flex flex-col gap-2">
				<Label htmlFor="address1">Address 1</Label>
				<Input
					type="text"
					id="address1"
					name="address1"
					value={address.address1}
					onChange={handleChange}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="address2">Address 2</Label>
				<Input
					type="text"
					id="address2"
					name="address2"
					value={address.address2}
					onChange={handleChange}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="city">City</Label>
				<Input
					type="text"
					id="city"
					name="city"
					value={address.city}
					onChange={handleChange}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="state">State</Label>
				<Input
					type="text"
					id="state"
					name="state"
					value={address.state}
					onChange={handleChange}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="zip">Zip Code</Label>
				<Input
					type="text"
					id="zip"
					name="zip"
					value={address.zip}
					onChange={handleChange}
				/>
			</div>
		</form>
	);
};

export default AddressForm;
