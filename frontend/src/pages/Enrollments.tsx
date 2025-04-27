
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ClipboardList, Eye, Pencil, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {endpoint} from "../../Utils/endpoint"

interface Enrollment {
  id: string;
  program: {
    id: string;
    name: string;
    description?: string;
    createdAt?: string;
    createdById?: string;
  };
  client: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    street?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    phone?: string | null;
    email?: string | null;
    medicalHistory?: string | null;
    allergies?: string[] | null;
  };
  enrolledBy: {
    id: "6334d916-f543-4599-b0ea-a98f0a6aed82",
    fullName: string,
    role: "DOCTOR",
    createdAt: string
}
  clientId: string;
  enrolledById: string;
  enrollmentDate: string;
  status: "ACTIVE" | "COMPLETED" | "DROPPED";
  notes?: string | null;
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
}

interface Program {
  id: string;
  name: string;
}

const navItems = [
  { href: "/", title: "Dashboard" },
  { href: "/programs", title: "Programs" },
  { href: "/clients", title: "Clients" },
  { href: "/enrollments", title: "Enrollments" },
];

const Enrollments = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedProgramId, setSelectedProgramId] = useState<string>("");
  const [currentEnrollment, setCurrentEnrollment] = useState<Enrollment | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<"ACTIVE" | "COMPLETED" | "DROPPED">("ACTIVE");

  const token = localStorage.getItem('token') || '';
  const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
  }

  useEffect(() => {
    fetchEnrollments();
    fetchClients();
    fetchPrograms();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${endpoint}/enrollments/all`, {headers});
      const data = response.data.enrollments;
      setEnrollments(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message|| "Failed to load enrollments. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${endpoint}/clients/all`, {headers });
      const data = await response.data.data.clients;
      setClients(data);
      console.log("clients..",data)
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${endpoint}/program/all`, {headers});
      const data = await response.data.data
      console.log("programs..",data)
      setPrograms(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateEnrollment = async () => {
    if (!selectedClientId || !selectedProgramId) {
      toast({
        title: "Error",
        description: "Please select both a client and program",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post(`${endpoint}/enrollments/enroll`,{
          clientId: selectedClientId,
          programId: selectedProgramId
        },{headers}
      );
   
      fetchEnrollments();
      setIsCreateModalOpen(false);
      setSelectedClientId("");
      setSelectedProgramId("");
      toast({
        title: "Success",
        description: response.data.message||"Enrollment created successfully",
        variant: "success"
      });
    
    } catch (error) {
      toast({
        title: "Error",
        description:error.response.data.message || "Failed to create enrollment. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const openUpdateModal = (enrollment: Enrollment) => {
    setCurrentEnrollment(enrollment);
    setSelectedClientId(enrollment.client.id);
    setSelectedProgramId(enrollment.program.id);
    setSelectedStatus(enrollment.status);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateEnrollment = async () => {
    if (!currentEnrollment) return;

    try {
      const response = await axios.put(`${endpoint}/enrollments/update/${currentEnrollment.id}`,     {
        clientId: selectedClientId,
        programId: selectedProgramId,
        status: selectedStatus
      },{headers}
      );   
      setIsUpdateModalOpen(false);
      fetchEnrollments();
      toast({
        title: "Success",
        description: response.data.message || "Enrollment updated successfully",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update enrollment. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const viewClientProfile = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  const filteredEnrollments = enrollments.filter(
    enrollment =>
      enrollment.client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.program.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-healthcare-primary">Enrollments Management</h1>
          <Button 
            onClick={() => setIsCreateModalOpen(true)} 
            className="bg-healthcare-primary text-white"
          >
            <Plus size={16} className="mr-2" /> New Enrollment
          </Button>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>All Enrollments</span>
              <div className="relative w-1/3">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search enrollments..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">Loading enrollments...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Enrolled By</TableHead>
                    <TableHead>Enrollment Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEnrollments.length > 0 ? (
                    filteredEnrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell className="font-medium">
                          {enrollment.client.firstName} {enrollment.client.lastName}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <ClipboardList size={16} className="mr-2 text-healthcare-primary" />
                            {enrollment.program.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            enrollment.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            enrollment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {enrollment.status}
                          </span>
                        </TableCell>
                        <TableCell>{enrollment.enrolledBy.fullName}</TableCell>
                        <TableCell>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewClientProfile(enrollment.clientId)}
                            >
                              <Eye size={16} className="mr-1" /> Client
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openUpdateModal(enrollment)}
                            >
                              <Pencil size={16} className="mr-1" /> Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">No enrollments found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Enrollment Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Enrollment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="client" className="text-sm font-medium">Select Client</label>
              <select
                id="client"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>{client.firstName} {client.lastName}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="program" className="text-sm font-medium">Select Program</label>
              <select
                id="program"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={selectedProgramId}
                onChange={(e) => setSelectedProgramId(e.target.value)}
              >
                <option value="">Select a program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>{program.name}</option>
                ))}
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
              <Button 
                type="button" 
                onClick={handleCreateEnrollment} 
                className="bg-healthcare-primary text-white"
              >
                Create Enrollment
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Enrollment Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Enrollment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="update-client" className="text-sm font-medium">Client</label>
              <Input 
                id="update-client" 
                value={currentEnrollment ? `${currentEnrollment.client.firstName} ${currentEnrollment.client.lastName}` : ""} 
                disabled
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="update-program" className="text-sm font-medium">Program</label>
              <Input 
                id="update-program" 
                value={currentEnrollment ? currentEnrollment.program.name : ""} 
                disabled
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="update-status" className="text-sm font-medium">Status</label>
              <select
                id="update-status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as "ACTIVE" | "COMPLETED" | "DROPPED")}
              >
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="DROPPED">Dropped</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsUpdateModalOpen(false)}>Cancel</Button>
              <Button 
                type="button" 
                onClick={handleUpdateEnrollment} 
                className="bg-healthcare-primary text-white"
              >
                Update Enrollment
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Enrollments;
