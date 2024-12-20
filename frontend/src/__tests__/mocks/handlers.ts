import { http, HttpResponse } from "msw";
import { mockTournament } from ".";

export const handlers = [
	http.post("/api/tournaments", () => {
		return HttpResponse.json(mockTournament, { status: 201 });
	}),
	http.get("/api/tournaments", () => {
		return HttpResponse.json([mockTournament], { status: 200 });
	}),
	http.delete("/api/tournaments/:id", () => {
		return HttpResponse.json([], { status: 200 });
	}),
	http.patch("/api/tournaments/:id", () => {
		return HttpResponse.json({message: "Successful", result: [{...mockTournament, name: "Updated Tournament"}]}, { status: 200 });
	}),
];
