"use client";

import { memo, useEffect } from "react";
import type { LoadingOverLayProps } from "@/types";

const LoadingOverlay = ({ isLoading = false }: LoadingOverLayProps) => {
	useEffect(() => {
		if (isLoading) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isLoading]);

	if (!isLoading) return null;

	return (
		<div className="loading-overlay fixed inset-0 z-50 flex items-center justify-center bg-overlay px-4 py-6 backdrop-blur-sm">
			<div className="loading-container flex w-full max-w-xs flex-col items-center space-y-4 sm:max-w-sm sm:space-y-6">
				<div className="flex space-x-2 sm:space-x-3">
					{[0, 1, 2, 3, 4].map((index) => (
						<div
							key={index}
							className="loading-dot h-3 w-3 rounded-full bg-foreground/70 sm:h-4 sm:w-4"
							style={{
								animationDelay: `${index * 0.1}s`,
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default memo(LoadingOverlay);
