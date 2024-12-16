import React from "react";
import { BrowserRouter } from "react-router";

interface AppProviderProps {
	children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
	return <BrowserRouter>{children}</BrowserRouter>;
};
