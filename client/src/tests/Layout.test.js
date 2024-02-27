import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import AppLayout from "../components/AppLayout";

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: jest.fn(),
}));

describe("AppLayout", () => {
  const user = {
    name: "John Doe",
  };

  const logout = jest.fn();

  beforeEach(() => {
    useAuth0.mockReturnValue({
      user,
      isLoading: false,
      logout,
    });
  });

  test("renders loading state when isLoading is true", () => {
    useAuth0.mockReturnValueOnce({
      isLoading: true,
    });

    render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders the app layout with user data", () => {
    render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>
    );

    expect(screen.getByText("Movie Reviews")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("My Reviews")).toBeInTheDocument();
    expect(screen.getByText("Auth Debugger")).toBeInTheDocument();
    expect(screen.getByText(`Welcome 👋 ${user.name}`)).toBeInTheDocument();
  });

  test("calls logout when LogOut button is clicked", () => {
    render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("LogOut"));

    expect(logout).toHaveBeenCalledWith({
      returnTo: window.location.origin,
    });
  });
});