import Header from "../components/Header";

import {render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

let mockIsAuthenticated = false;
const mockLoginWithRedirect = jest.fn();
const mockUseNavigate = jest.fn();

jest.mock("@auth0/auth0-react", () => ({
	...jest.requireActual("@auth0/auth0-react"),
	Auth0Provider: ({ children }) => children,
	useAuth0: () => {
	  return {
		isLoading: false,
		user: { sub: "foobar" },
		isAuthenticated: mockIsAuthenticated,
		loginWithRedirect: mockLoginWithRedirect,
	  };
	},
  }));
  
  jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useNavigate: () => {
	  return mockUseNavigate;
	},
  }));

	
test("render Header copy and Login and Signup Buttons", () => {
	render(
		<MemoryRouter initialEntries={["/"]}>
			<Header />
		</MemoryRouter>
	);
	expect(screen.getByText("Log In")).toBeInTheDocument();
	expect(screen.getByText("Sign Up")).toBeInTheDocument();
});

test("login button calls loginWithRedirect", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Header />
    </MemoryRouter>
  );

  const loginButton = screen.getByText("Log In");
  await userEvent.click(loginButton);

  expect(mockLoginWithRedirect).toHaveBeenCalled();
});


test("renders Profile button when user is authenticated", () => {
  mockIsAuthenticated = true;
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Header />
    </MemoryRouter>
  );

  expect(screen.getByText("Profile")).toBeInTheDocument();
});


test("enter Profile button navigates to /app", async () => {
  mockIsAuthenticated = true;
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Header />
    </MemoryRouter>
  );

  const profileButton = screen.getByText("Profile");
  await userEvent.click(profileButton);

  expect(mockUseNavigate).toHaveBeenCalledWith("/app");
});