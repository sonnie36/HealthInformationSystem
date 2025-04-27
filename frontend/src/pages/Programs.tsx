
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { endpoint } from "../../Utils/endpoint";
import axios from "axios";

interface Program {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  createdBy: {
    id: string;
    fullName: string;
  };
}

const navItems = [
  { href: "/", title: "Dashboard" },
  { href: "/programs", title: "Programs" },
  { href: "/clients", title: "Clients" },
  { href: "/enrollments", title: "Enrollments" },
];

const Programs = () => {
  const { toast } = useToast();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const token = localStorage.getItem('token') || '';

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${endpoint}/program/all`, {headers });

      if (!response.data) {
        throw new Error("No data found");
      }

      const data = await response.data.data;
      setPrograms(data);

      console.log("Fetched programs:", data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message || "Failed to load programs. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${endpoint}/program/create`, formData, { headers });

      if (!response.data) {
        throw new Error('Failed to create program');
      }

      fetchPrograms();
      setIsCreateModalOpen(false);
      toast({
        title: "Success",
        description: response.data.message || "Program created successfully",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Error",
        description:  error.response.data.message ||"Failed to create program. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleEditProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProgram) return;

    try {
      const response = await axios.put(`${endpoint}/program/update/${currentProgram.id}`,formData, {headers});

      if (!response.data) {
        throw new Error('Failed to update program');
      }
      setIsEditModalOpen(false);
      fetchPrograms();
      toast({
        title: "Success",
        description: response.data.message || "Program updated successfully",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message || "Failed to update program. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleDeleteProgram = async () => {
    if (!currentProgram) return;

    try {
      const response = await axios.delete(`${endpoint}/program/delete/${currentProgram.id}`, {headers});
      fetchPrograms();
      setIsDeleteModalOpen(false);
      toast({
        title: "Success",
        description: response.data.message || "Program deleted successfully",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message ||"Failed to delete program. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const openEditModal = (program: Program) => {
    setCurrentProgram(program);
    setFormData({
      name: program.name,
      description: program.description || "",
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (program: Program) => {
    setCurrentProgram(program);
    setIsDeleteModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-healthcare-primary">Programs Management</h1>
          <Button 
            onClick={() => setIsCreateModalOpen(true)} 
            className="bg-healthcare-primary text-white"
          >
            <Plus size={16} className="mr-2" /> New Program
          </Button>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>All Programs</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">Loading programs...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programs.length > 0 ? (
                    programs.map((program) => (
                      <TableRow key={program.id}>
                        <TableCell className="font-medium">{program.name}</TableCell>
                        <TableCell>{program.description || "No description"}</TableCell>
                        <TableCell>{new Date(program.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{program.createdBy.fullName}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openEditModal(program)}
                            >
                              <Pencil size={16} className="text-healthcare-primary" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openDeleteModal(program)}
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">No programs found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Program Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Program</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateProgram} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Program Name</label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                rows={4} 
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-healthcare-primary text-white">Create Program</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Program Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Program</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditProgram} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit-name" className="text-sm font-medium">Program Name</label>
              <Input 
                id="edit-name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
              <Textarea 
                id="edit-description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                rows={4} 
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-healthcare-primary text-white">Update Program</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete the program "{currentProgram?.name}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDeleteProgram}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Programs;
