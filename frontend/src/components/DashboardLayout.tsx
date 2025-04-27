import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, Users, ClipboardList, LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    color: "text-healthcare-purple-600"
  },
  {
    title: "Programs",
    icon: FileText,
    href: "/programs",
    color: "text-healthcare-purple-500"
  },
  {
    title: "Clients",
    icon: Users,
    href: "/clients",
    color: "text-healthcare-purple-400"
  },
  {
    title: "Enrollments",
    icon: ClipboardList,
    href: "/enrollments",
    color: "text-healthcare-purple-300"
  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleNavigation = (href: string) => {
    navigate(href);
    if (isMobile) setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
      variant: "success"
    });
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-healthcare-purple-50 to-white">
        {/* Mobile Sidebar Trigger */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-40 p-2 rounded-md bg-white shadow-md text-healthcare-purple-800 hover:bg-healthcare-purple-50 transition-colors md:hidden"
            aria-label="Open sidebar"
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>
        )}

        {/* Mobile Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        {isMobile && (
          <div 
            className={`fixed inset-y-0 left-0 w-[250px] bg-white/80 backdrop-blur-sm border-r border-healthcare-purple-100 z-50 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="px-4 py-6 h-full flex flex-col">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-healthcare-purple-800">HealthCare</h1>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-full hover:bg-healthcare-purple-100"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5 text-healthcare-purple-800" />
                </button>
              </div>
              
              <div className="mt-8 space-y-2 flex-1">
                {menuItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className={`flex w-full items-center px-4 py-2 text-healthcare-gray hover:text-healthcare-purple-800 hover:bg-healthcare-purple-100 rounded-lg transition-colors group ${item.color}`}
                  >
                    <item.icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    <span className="transition-opacity duration-200">
                      {item.title}
                    </span>
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-healthcare-gray hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors group mt-auto"
                >
                  <LogOut className="w-5 h-5 mr-3 text-healthcare-purple-500 group-hover:text-destructive" />
                  <span className="transition-opacity duration-200">
                    Logout
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sidebar className="border-r border-healthcare-purple-100 bg-white/80 backdrop-blur-sm">
            <SidebarContent>
              <div className="px-4 py-6">
                <h1 className="text-2xl font-bold text-healthcare-purple-800">HealthCare</h1>
                <div className="mt-8 space-y-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => handleNavigation(item.href)}
                      className={`flex w-full items-center px-4 py-2 text-healthcare-gray hover:text-healthcare-purple-800 hover:bg-healthcare-purple-100 rounded-lg transition-colors group ${item.color}`}
                    >
                      <item.icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                      <span className="transition-opacity duration-200">
                        {item.title}
                      </span>
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-healthcare-gray hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors group mt-auto"
                  >
                    <LogOut className="w-5 h-5 mr-3 text-healthcare-purple-500 group-hover:text-destructive" />
                    <span className="transition-opacity duration-200">
                      Logout
                    </span>
                  </button>
                </div>
              </div>
            </SidebarContent>
            <SidebarTrigger className="absolute top-4 right-[-12px] z-50" />
          </Sidebar>
        )}

        <main className="flex-1 overflow-auto bg-white/70 backdrop-blur-sm">
          <div className="p-4 md:p-8 mt-16 md:mt-0">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}