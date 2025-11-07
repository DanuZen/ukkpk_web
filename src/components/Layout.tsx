import { ReactNode } from "react";
import { Navigation } from "./Navigation";
import { BreakingNews } from "./BreakingNews";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <BreakingNews />
      <main>{children}</main>
      <Footer />
    </div>
  );
};
