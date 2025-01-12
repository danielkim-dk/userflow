"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "./ui/textarea";
import { useFormContext } from "@/context/FormContext";

const AboutMe = () => {
	const [text, setText] = useState("");
	const { updateFormState } = useFormContext();

	useEffect(() => {
		updateFormState("about_me", { text });
	}, [text, updateFormState]);

	return (
		<div className="flex flex-col items-center justify-center border border-black p-4 m-4 w-full">
			<h1>About Me</h1>
			<Textarea value={text} onChange={(e) => setText(e.target.value)} />
		</div>
	);
};

export default AboutMe;
