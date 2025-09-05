
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { 
  Map, 
  Calculator, 
  Settings, 
  Calendar, 
  UserCheck,
  Menu,
  X,
  Home
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("לא ניתן לטעון פרטי משתמש:", error);
      setUser(null); // Explicitly set user to null on error
    }
    setLoading(false);
  };

  const navigationItems = [
    {
      title: "מפת יישובים",
      url: createPageUrl("Dashboard"),
      icon: Map,
      roles: ['admin', 'user'] // כל המשתמשים
    },
    {
      title: "חישוב מרחקים",
      url: createPageUrl("DistanceCalculator"),
      icon: Calculator,
      roles: ['admin', 'user'] // כל המשתמשים
    },
    {
      title: "תיאום טכנאים",
      url: createPageUrl("Scheduling"),
      icon: UserCheck,
      roles: ['admin', 'user'] // כל המשתמשים
    },
    {
      title: "יומן וזמינות",
      url: createPageUrl("Calendar"),
      icon: Calendar,
      roles: ['admin', 'user'] // כל המשתמשים
    },
  ];

  const adminItems = [
    {
      title: "ניהול מערכת",
      url: createPageUrl("Management"),
      icon: Settings,
      roles: ['admin'] // רק מנהלים
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-green-50" dir="rtl">
        <Sidebar className="border-l border-blue-200 shadow-lg bg-white/80 backdrop-blur" side="right">
          <SidebarHeader className="border-b border-blue-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">ניהול שטח</h2>
                <p className="text-sm text-blue-600">מערכת תיאום טכנאים</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-sm font-semibold text-gray-700 px-3 py-2">
                תפריט ראשי
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems
                    .filter(item => !user || item.roles.includes(user.role))
                    .map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 rounded-xl mb-1 shadow-sm ${
                          location.pathname === item.url ? 'bg-blue-100 text-blue-700 shadow-md' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {user?.role === 'admin' && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-sm font-semibold text-gray-700 px-3 py-2">
                  ניהול מתקדם
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {adminItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-green-50 hover:text-green-700 transition-all duration-300 rounded-xl mb-1 shadow-sm ${
                            location.pathname === item.url ? 'bg-green-100 text-green-700 shadow-md' : ''
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>

          <SidebarFooter className="border-t border-blue-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.full_name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {user?.full_name || 'משתמש'}
                </p>
                <p className="text-xs text-blue-600 truncate">
                  {user?.role === 'admin' ? 'מנהל מערכת' : 'נציג שירות'}
                </p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur border-b border-blue-200 px-6 py-4 md:hidden shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-blue-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-gray-900">ניהול שטח</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
