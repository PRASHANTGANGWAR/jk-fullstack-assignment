import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
// import "@testing-library/jest-dom/extend-expect";
import CustomModal from "./modal";
jest.mock("../assets/images/Blog.png", () => "test-image");

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
    useSearchParams: jest.fn(() => [{ get: jest.fn() }]),
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  }));
  

describe("CustomModal Component", () => {
  const mockOnClose = jest.fn();
  const mockSetFun = jest.fn();
  
  const renderComponent = (open: boolean) =>
    render(
      <BrowserRouter>
        <CustomModal open={open} onClose={mockOnClose} setToken={mockSetFun} />
      </BrowserRouter>
    );

  it("renders correctly when open", () => {
    renderComponent(true);
    expect(screen.getByText("Sign in to Continue")).toBeInTheDocument();
  });

  it("closes the modal when close button is clicked", () => {
    renderComponent(true);
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("renders the Sign in with Google link", () => {
    renderComponent(true);
    const googleLink = screen.getByText("Sign in with Google");
    expect(googleLink).toBeInTheDocument();
    expect(googleLink.closest("a")).toHaveAttribute("href", `${import.meta.env.VITE_API_URL}/google`);
  });

  it("does not render when modal is closed", () => {
    renderComponent(false);
    expect(screen.queryByText("Sign in to Continue")).not.toBeInTheDocument();
  });
});
