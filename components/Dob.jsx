"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useFormContext } from "@/context/FormContext";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

const Dob = () => {
	const [date, setDate] = useState(new Date());
	const { updateFormState } = useFormContext();

	useEffect(() => {
		if (date) {
			updateFormState("dob", {
				month: format(date, "MMMM"),
				day: format(date, "d"),
				year: format(date, "yyyy")
			});
		}
	}, [date, updateFormState]);

	const handleSelect = (newDate) => {
		setDate(newDate);
	};

	return (
		<div className="flex gap-4 items-center p-4">
			<Label htmlFor="dob">Date of Birth</Label>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant={"outline"}
						className={cn(
							"w-[280px] justify-start text-left font-normal",
							!date && "text-muted-foreground"
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{date ? format(date, "PPP") : <span>Pick a date</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<Calendar
						mode="single"
						selected={date}
						onSelect={handleSelect}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default Dob;
