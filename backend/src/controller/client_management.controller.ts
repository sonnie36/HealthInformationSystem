import { Request, Response } from "express";
import { registerClient,getClients,getClientById, searchClients, updateClient} from "../service/client_management.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const registerClientController = async (req:AuthRequest, res:Response) => {
  try {
    const  userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized. user not found" });
      return;
    }
    const client = await registerClient(req.body, userId);
    res.status(201).json({ message: "Client registered successfully", client });
  } catch (error) {
    console.error("Error registering client:", error);
    res.status(500).json({ message: "Failed to register client" });
  }
};

export const getClientsController = async (req:Request, res:Response) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const result = await getClients({}, Number(page), Number(pageSize));
    res.status(200).json({ message: "Clients fetched successfully", data: result });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Failed to fetch clients" });
  }
};

export const getClientByIdController = async (req:Request, res:Response) => {
  try {
    const client = await getClientById(req.params.id);
    if (!client) {
       res.status(404).json({ message: "Client not found" });
       return;
    }
    res.status(200).json({ message: "Client fetched successfully", client });
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ message: "Failed to fetch client" });
  }
};

export const updateClientController = async (req:Request, res:Response) => {
  try {
    const client = await updateClient(req.params.id, req.body);
    res.status(200).json({ message: "Client updated successfully", client });
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({ message: "Failed to update client" });
  }
};

export const searchClientsController = async (req:Request, res:Response) => {
  try {
    const { query } = req.query;
    if (!query) {
       res.status(400).json({ message: "Search query is required" });
        return;
    }
    const clients = await searchClients(query as string);
    res.status(200).json({ message: "Clients search completed", clients });
  } catch (error) {
    console.error("Error searching clients:", error);
    res.status(500).json({ message: "Failed to search clients" });
  }
};
