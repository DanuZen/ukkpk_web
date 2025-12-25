import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface DashboardPageHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  children?: ReactNode;
}

export const DashboardPageHeader = ({ title, subtitle, icon: Icon, children }: DashboardPageHeaderProps) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-6 w-6 text-primary animate-fade-in" />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-0.5 sm:mt-1">{subtitle}</p>
        </div>
      </div>
      {children && (
        <div className="flex-shrink-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
          {children}
        </div>
      )}
    </div>
  );
};
