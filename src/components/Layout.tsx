import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Navigation } from "./Navigation";
import { BreakingNews } from "./BreakingNews";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {!isHomePage && <BreakingNews />}
      <main>{children}</main>
      <Footer />
    </div>
  );
};
