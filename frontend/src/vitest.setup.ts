/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup, renderHook } from "@testing-library/react";
import { server } from "./__tests__/mocks/server";
import { useTournamentStore } from "./stores/tournament-store";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());

// Run cleanup after each test case (e.g. clearing jsdom, stores)
afterEach(() => {
	const { result } = renderHook(() => useTournamentStore());
	result.current.tournaments = [];

	cleanup();
	server.resetHandlers();
});
