
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FileText, Pencil, Check, X } from "lucide-react";
import axios from "axios";
import { endpoint } from "../../Utils/endpoint";

interface ClientDetails {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  street: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  phone: string | null;
  email: string | null;
  medicalHistory: string | null;
  allergies: string[];
  registrationDate: string;
}

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
  clientId: string;
  enrolledById: string;
  enrollmentDate: string;
  status: "ACTIVE" | "COMPLETED" | "DROPPED";
  notes?: string | null;
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

const ClientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [client, setClient] = useState<ClientDetails | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [availablePrograms, setAvailablePrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>("");
  const [currentEnrollment, setCurrentEnrollment] = useState<Enrollment | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<"ACTIVE" | "COMPLETED" | "DROPPED">("ACTIVE");

  const token = localStorage.getItem('token') || '';
  const headers = {
    'Authorization': `Bearer ${token}`, 
    'Content-Type': 'application/json',
  };

  useEffect(() => {
    if (id) {
      fetchClientDetails();
      fetchClientEnrollments();
      fetchPrograms();
    }
  }, [id]);

  const fetchClientDetails = async () => {
    try {
      const response = await axios.get(`${endpoint}/clients/${id}`, { headers});
      const data =response.data.client;
      setClient(data);
      console.log("client profile",data);
    } catch (error) {
      toast({
        title: "Error",
        description:error.response.data.message || "Failed to load client details. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientEnrollments = async () => {
    try {
      const response = await axios.get(`${endpoint}/enrollments/client/${id}`, {headers});
      const data = response.data.enrollments;
      setEnrollments(data);
      if (data.length < 1) {
        toast({
          title: "Warning",
          description: "No enrollments found for this client.",
          variant: "warning",
        });
      }
      console.log("enrollment",data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message || "Failed to load enrollments. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${endpoint}/program/all`, {headers});
      const data = await response.data.data;
      setAvailablePrograms(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEnrollClient = async () => {
    if (!selectedProgramId) {
      toast({
        title: "Error",
        description: "Please select a program",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post(`${endpoint}/enrollments/enroll`, 
  {
          clientId: id,
          programId: selectedProgramId
        },
        {headers}
      );

      setIsEnrollModalOpen(false);
      fetchClientEnrollments();
      toast({
        title: "Success",
        description:response.data.message ||  "Client enrolled successfully",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enroll client. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const openUpdateStatusModal = (enrollment: Enrollment) => {
    setCurrentEnrollment(enrollment);
    setSelectedStatus(enrollment.status);
    setIsUpdateStatusModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!currentEnrollment) return;

    try {
      const response = await axios.put(`${endpoint}/enrollments/update/${currentEnrollment.id}`,        {
        clientId: id,
        programId: currentEnrollment.program.id,
        status: selectedStatus
      }, {headers});
      fetchClientEnrollments(); 
      setIsUpdateStatusModalOpen(false);
      toast({
        title: "Success",
        description: "Enrollment status updated successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-8">
          <MainNav items={navItems} />
          <div className="flex justify-center p-4">Loading client details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!client) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-8">
          <MainNav items={navItems} />
          <div className="flex justify-center p-4">Client not found</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-healthcare-primary">Client Profile</h1>
          <Button 
            variant="outline"
            onClick={() => navigate('/clients')}
          >
            Back to Clients
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 bg-white">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{client.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{new Date(client.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{client.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{client.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{client.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Registration Date</p>
                <p className="font-medium">{new Date(client.registrationDate).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 bg-white">
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Street</p>
                  <p className="font-medium">{client.street || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="font-medium">{client.city || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">State</p>
                  <p className="font-medium">{client.state || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Postal Code</p>
                  <p className="font-medium">{client.postalCode || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3 bg-white">
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Medical History</p>
                <p className="font-medium">{client.medicalHistory || "No medical history recorded"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Allergies</p>
                {client.allergies && client.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {client.allergies.map((allergy, index) => (
                      <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                        {allergy}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="font-medium">No allergies recorded</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3 bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Program Enrollments</CardTitle>
              <Button 
                onClick={() => setIsEnrollModalOpen(true)} 
                className="bg-healthcare-primary text-white"
              >
                Enroll in Program
              </Button>
            </CardHeader>
            <CardContent>
              {enrollments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Program Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enrollment Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText size={16} className="mr-2 text-healthcare-primary" />
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
                        <TableCell>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openUpdateStatusModal(enrollment)}
                          >
                            <Pencil size={16} className="mr-1" /> Update Status
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p>Client is not enrolled in any programs</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enroll Client Modal */}
      <Dialog open={isEnrollModalOpen} onOpenChange={setIsEnrollModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enroll in Program</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="program" className="text-sm font-medium">Select Program</label>
              <select
                id="program"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={selectedProgramId}
                onChange={(e) => setSelectedProgramId(e.target.value)}
              >
                <option value="">Select a program</option>
                {availablePrograms.map((program) => (
                  <option key={program.id} value={program.id}>{program.name}</option>
                ))}
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEnrollModalOpen(false)}>Cancel</Button>
              <Button 
                type="button" 
                onClick={handleEnrollClient} 
                className="bg-healthcare-primary text-white"
              >
                Enroll
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Status Modal */}
      <Dialog open={isUpdateStatusModalOpen} onOpenChange={setIsUpdateStatusModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Enrollment Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">Status</label>
              <select
                id="status"
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
              <Button type="button" variant="outline" onClick={() => setIsUpdateStatusModalOpen(false)}>
                <X size={16} className="mr-1" /> Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleUpdateStatus} 
                className="bg-healthcare-primary text-white"
              >
                <Check size={16} className="mr-1" /> Update
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ClientProfile;
