// import { render, screen } from "@testing-library/react";
// import { describe, it, expect } from "vitest";
// import DashboardContent from "@/features/dashboard/components/dashboard-content";
// import { server } from "./mocks/server";
// import { http, HttpResponse } from "msw";

// describe("Dashboard Content", () => {
// 	it("renders tournament when tournaments exist", async () => {
// 		render(<DashboardContent />);

// 		expect(await screen.findByText("Active Tournaments")).toBeInTheDocument();
// 		expect(await screen.findByText("Test Tournament")).toBeInTheDocument();
// 	});

// 	it("renders empty dashboard when no tournaments exist", async () => {
// 		server.use(
// 			http.get("http://localhost:3000/api/tournaments", () => {
// 				return HttpResponse.json([], { status: 200 });
// 			})
// 		);

// 		render(<DashboardContent />);

// 		expect(
// 			await screen.findByText("There's nothing here!")
// 		).toBeInTheDocument();
// 		expect(await screen.findByText("Let's fix that.")).toBeInTheDocument();
// 		expect(await screen.findByRole("button")).toBeInTheDocument();
// 	});

// 	it("renders error message on api error", async () => {
// 		server.use(
// 			http.get("http://localhost:3000/api/tournaments", () => {
// 				return HttpResponse.json(null, { status: 400 });
// 			})
// 		);

// 		render(<DashboardContent />);

// 		expect(
// 			await screen.findByText(
// 				"An unexpected error occurred while loading your tournaments. Please try again later."
// 			)
// 		).toBeInTheDocument();
// 	});
// });
