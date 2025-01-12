"use client";
import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";

const SuccessPage = () => {
	const [confettiProps, setConfettiProps] = useState({
		numberOfPieces: 200,
		recycle: true,
		run: true,
		opacity: 1,
	});

	useEffect(() => {
		// After 3 seconds, start reducing pieces
		const timer = setTimeout(() => {
			setConfettiProps((prev) => ({
				...prev,
				numberOfPieces: 0,
				recycle: false,
			}));
		}, 5000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="flex flex-col h-[50%] w-screen items-center justify-center">
			<Confetti
				width={window.innerWidth}
				height={window.innerHeight}
				{...confettiProps}
			/>
			<div className="flex w-[50%] h-[300px] items-center justify-center font-bold text-4xl">
				Success
			</div>
		</div>
	);
};

export default SuccessPage;
