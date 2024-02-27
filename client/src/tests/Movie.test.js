import Movie from "../components/Movie";
import { NA_POSTER_URL } from "../constants";

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { enableFetchMocks } from "jest-fetch-mock";

enableFetchMocks();

jest.mock("@auth0/auth0-react", () => ({
  ...jest.requireActual("@auth0/auth0-react"),
  Auth0Provider: ({ children }) => children,
  useAuth0: () => {
    return {
      isLoading: false,
      user: { sub: "foobar" },
      isAuthenticated: false,
      loginWithRedirect: jest.fn(),
    };
  },
}));
  
jest.mock("../AuthTokenContext", () => ({
  useAuthToken: () => {
    return { accessToken: "123" };
  },
}));

fetch.mockResponse(
    JSON.stringify(
      { imbdId: 'tt123456', 
				title: 'Fake Movie', 
        year: 2023,
        posterURL: NA_POSTER_URL, 
        reviews: []},
    )
  );

test("render movie data", async () => {
	render(
		<MemoryRouter initialEntries={["/"]}>
      <Movie />
    </MemoryRouter>
	);

	const imbdId = await screen.findByText("tt123456");
	const title = await screen.findByText("Fake Movie");
	
	expect(imbdId).toBeInTheDocument();
	expect(title).toBeInTheDocument();
});	