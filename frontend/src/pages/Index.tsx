/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { MainNav } from "@/components/MainNav";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FileText, Users, ClipboardList } from "lucide-react";
import { endpoint } from "../../Utils/endpoint";
import axios from "axios";

const navItems = [
  { href: "/", title: "Dashboard" },
  { href: "/programs", title: "Programs" },
  { href: "/clients", title: "Clients" },
  { href: "/enrollments", title: "Enrollments" },
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    programCount: 0,
    clientCount: 0,
    enrollmentCount: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token') || '';

  const headers =  {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      const programsResponse = await axios.get(`${endpoint}/program/all`, {
        headers: headers,
      });

      const clientsResponse = await axios.get(`${endpoint}/clients/all`, {
        headers: headers,
      });

      const enrollmentsResponse = await axios.get(`${endpoint}/enrollments/all`, {
        headers: headers,
      });
      console.log("programsResponse", programsResponse.data);
      console.log("clientsResponse", clientsResponse.data);
      console.log("enrollmentsResponse", enrollmentsResponse.data);

      const programs = programsResponse.data.data;
      const clients = clientsResponse.data.data.clients;
      const enrollments = enrollmentsResponse.data.enrollments;

      // Calculate success rate (completed enrollments / total enrollments)
      const completedEnrollments = enrollments.filter((e: any) => e.status === 'COMPLETED').length;
      const successRate = enrollments.length > 0 
        ? Math.round((completedEnrollments / enrollments.length) * 100) 
        : 0;

      setStats({
        programCount: programs.length,
        clientCount: clients.length,
        enrollmentCount: enrollments.length,
        successRate
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        {/* <MainNav items={navItems} /> */}
        
        {loading ? (
          <div className="flex justify-center p-4">Loading dashboard data...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card 
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white" 
              onClick={() => handleCardClick("/programs")}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-healthcare-gray">Total Programs</h3>
                <FileText className="text-healthcare-primary h-6 w-6" />
              </div>
              <p className="text-3xl font-bold text-healthcare-primary">{stats.programCount}</p>
            </Card>
            
            <Card 
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white" 
              onClick={() => handleCardClick("/clients")}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-healthcare-gray">Active Clients</h3>
                <Users className="text-healthcare-primary h-6 w-6" />
              </div>
              <p className="text-3xl font-bold text-healthcare-primary">{stats.clientCount}</p>
            </Card>
            
            <Card 
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white" 
              onClick={() => handleCardClick("/enrollments")}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-healthcare-gray">Enrollments</h3>
                <ClipboardList className="text-healthcare-primary h-6 w-6" />
              </div>
              <p className="text-3xl font-bold text-healthcare-primary">{stats.enrollmentCount}</p>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-healthcare-gray">Success Rate</h3>
                <div className="rounded-full bg-blue-100 p-2">
                  <span className="text-[#2196F3] text-xs font-bold">%</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-[#2196F3]">{stats.successRate}%</p>
            </Card>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6 bg-white">
            <h2 className="text-lg font-semibold text-healthcare-primary mb-4">Recent Activities</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-healthcare-primary pl-4 py-1">
                <p className="text-sm font-medium">New client registered</p>
                <p className="text-xs text-gray-500">Today, 10:30 AM</p>
              </div>
              <div className="border-l-4 border-healthcare-secondary pl-4 py-1">
                <p className="text-sm font-medium">Program status updated</p>
                <p className="text-xs text-gray-500">Yesterday, 3:45 PM</p>
              </div>
              <div className="border-l-4 border-healthcare-success pl-4 py-1">
                <p className="text-sm font-medium">Client enrolled in Malaria Program</p>
                <p className="text-xs text-gray-500">Apr 24, 2025, 9:15 AM</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white">
            <h2 className="text-lg font-semibold text-healthcare-primary mb-4">System Overview</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Active Programs</span>
                  <span className="font-medium">{stats.programCount}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-healthcare-primary rounded-full" 
                    style={{ width: `${stats.programCount > 0 ? 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Active Clients</span>
                  <span className="font-medium">{stats.clientCount}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-healthcare-secondary rounded-full" 
                    style={{ width: `${Math.min(stats.clientCount / 5 * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Success Rate</span>
                  <span className="font-medium">{stats.successRate}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-healthcare-success rounded-full" 
                    style={{ width: `${stats.successRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Index;
