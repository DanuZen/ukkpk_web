import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Navigation } from "./Navigation";
import { BreakingNews } from "./BreakingNews";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ScrollToTop />
      <Navigation />
      {!isHomePage && <BreakingNews />}
      <main className="flex-1 min-h-[calc(100vh-12rem)]">{children}</main>
      <Footer />
    </div>
  );
};
