"use client";

import { createContext, useContext, useState, useCallback } from "react";

const FormContext = createContext({});

export function FormProvider({ children }) {
	const [formState, setFormState] = useState({
		about_me: {},
		address: {},
		dob: {},
	});

	const updateFormState = useCallback((componentName, state) => {
		setFormState((prev) => ({
			...prev,
			[componentName]: state,
		}));
	}, []); // Empty dependency array since it doesn't depend on any values

	return (
		<FormContext.Provider value={{ formState, updateFormState }}>
			{children}
		</FormContext.Provider>
	);
}

export const useFormContext = () => useContext(FormContext);
