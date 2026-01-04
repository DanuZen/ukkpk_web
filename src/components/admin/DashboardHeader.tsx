import { User } from "@supabase/supabase-js";
import { Search, Bell, LogOut, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface RecentActivity {
  id: string;
  title: string;
  type: 'article' | 'news';
  created_at: string;
}

interface DashboardHeaderProps {
  title: string;
  user: User | null;
  onSignOut: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

export const DashboardHeader = ({
  title,
  user,
  onSignOut,
  activePage,
  onNavigate
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [viewedActivities, setViewedActivities] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const { data: recentArticles } = await supabase
          .from('articles')
          .select('id, title, created_at')
          .order('created_at', { ascending: false })
          .limit(3);

        const { data: recentNews } = await supabase
          .from('news')
          .select('id, title, created_at')
          .order('created_at', { ascending: false })
          .limit(3);

        const combined: RecentActivity[] = [
          ...(recentArticles || []).map(a => ({ ...a, type: 'article' as const })),
          ...(recentNews || []).map(n => ({ ...n, type: 'news' as const }))
        ]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

        setRecentActivity(combined);
      } catch (error) {
        // Error silently handled
      }
    };

    fetchRecentActivity();
    
    // Load viewed activities from localStorage
    const viewed = localStorage.getItem('viewedActivities');
    if (viewed) {
      setViewedActivities(JSON.parse(viewed));
    }
  }, []);
  
  // Update unread count based on viewed activities
  useEffect(() => {
    const unviewed = recentActivity.filter(
      activity => !viewedActivities.includes(`${activity.type}-${activity.id}`)
    );
    setUnreadCount(unviewed.length);
  }, [recentActivity, viewedActivities]);
  
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };
  
  return (
    <header className="sticky top-0 z-50 flex h-14 sm:h-16 items-center gap-2 border-b bg-white shadow-sm px-3 sm:px-4 md:px-6">
      {/* Sidebar Trigger */}
      <SidebarTrigger className="text-gray-700 hover:bg-primary hover:text-white transition-colors rounded-md flex-shrink-0 h-9 w-9" />
      
      {/* Search Bar - Hidden on tablet, visible on desktop */}
      <div className="relative hidden lg:flex flex-1 max-w-md xl:max-w-lg">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input 
          placeholder="Cari..." 
          className="w-full pl-8 pr-2 h-10 text-sm bg-gray-50 border-gray-200 focus:bg-white" 
        />
      </div>

      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")} 
          className="group flex items-center justify-center h-9 w-9 md:hover:w-auto md:hover:px-3 text-gray-600 hover:bg-primary hover:text-white transition-all duration-300 flex-shrink-0" 
          title="Kembali ke Website"
        >
          <ExternalLink className="h-4 w-4 transition-transform duration-300 md:group-hover:-translate-x-1" />
          <span className="hidden md:block max-w-0 overflow-hidden whitespace-nowrap opacity-0 md:group-hover:max-w-[100px] md:group-hover:ml-2 md:group-hover:opacity-100 transition-all duration-300">
            Lihat Website
          </span>
        </Button>

        <DropdownMenu open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="group flex items-center justify-center h-9 w-9 md:hover:w-auto md:hover:px-3 text-gray-600 hover:bg-primary hover:text-white transition-all duration-300 flex-shrink-0 relative"
            >
              <Bell className="h-4 w-4 transition-transform duration-300 md:group-hover:-translate-x-1" />
              <span className="hidden md:block max-w-0 overflow-hidden whitespace-nowrap opacity-0 md:group-hover:max-w-[100px] md:group-hover:ml-2 md:group-hover:opacity-100 transition-all duration-300">
                Notifikasi
              </span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-semibold">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="font-semibold text-base">Aktivitas Terbaru</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {recentActivity.filter(activity => !viewedActivities.includes(`${activity.type}-${activity.id}`)).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <p className="text-sm font-medium text-gray-500">Tidak ada aktivitas terbaru</p>
              </div>
            ) : (
              <div className="py-1">
                {recentActivity
                  .filter(activity => !viewedActivities.includes(`${activity.type}-${activity.id}`))
                  .map((activity) => (
                  <DropdownMenuItem 
                    key={`${activity.type}-${activity.id}`} 
                    className="flex flex-col items-start gap-2 p-3 cursor-pointer focus:bg-gray-50 hover:bg-gray-50"
                    onClick={() => {
                      // Mark as viewed
                      const activityKey = `${activity.type}-${activity.id}`;
                      const newViewed = [...viewedActivities, activityKey];
                      setViewedActivities(newViewed);
                      localStorage.setItem('viewedActivities', JSON.stringify(newViewed));
                      
                      // Navigate
                      const url = activity.type === 'article' 
                        ? `/artikel/${activity.id}` 
                        : `/berita/${activity.id}`;
                      navigate(url);
                      setIsNotificationOpen(false);
                    }}
                  >
                    <div className="flex items-start gap-2 w-full">
                      <Badge 
                        variant={activity.type === 'article' ? 'default' : 'secondary'} 
                        className="text-[10px] px-2 py-0.5 flex-shrink-0"
                      >
                        {activity.type === 'article' ? 'Artikel' : 'Berita'}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {activity.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(activity.created_at), "d MMM yyyy, HH:mm", { locale: id })}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};