import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { enableFetchMocks } from "jest-fetch-mock";
import Profile from "../components/Profile";

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
    { name: 'Iris',
      email: '123456@gmail.com'}
  )
);

test("render user data", async () => {
render(
  <MemoryRouter initialEntries={["/"]}>
    <Profile />
  </MemoryRouter>
);

const name = await screen.findByText("😃 Name: Iris");
const email = await screen.findByText("📧 Email: 123456@gmail.com");

expect(name).toBeInTheDocument();
expect(email).toBeInTheDocument();
});	