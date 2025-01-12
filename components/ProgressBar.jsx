import React from "react";

const ProgressBar = ({ progress }) => {
	return (
		<div className="w-full h-3 bg-gray-200">
			<div
				className="h-full bg-primary transition-all duration-500 ease-in-out"
				style={{ width: `${progress}%` }}
			/>
		</div>
	);
};

export default ProgressBar;
