import { Router } from "express";
import {
  ChangeEventSalonsStatusController,
  CreateEventsSalonsController,
  ListEventSalonsController,
  UpdateEventSalonsController,
} from "../../../controllers/EventSalons";

const eventSalonsRoutes = Router();

const createEventSalonsController = new CreateEventsSalonsController();
const listEventSalonsController = new ListEventSalonsController();
const updateEventSalonsController = new UpdateEventSalonsController();
const changeEventSalonsStatusController =
  new ChangeEventSalonsStatusController();

eventSalonsRoutes.post("/", createEventSalonsController.handle);
eventSalonsRoutes.get("/", listEventSalonsController.handle);
eventSalonsRoutes.put("/:id", updateEventSalonsController.handle);
eventSalonsRoutes.patch("/:id", changeEventSalonsStatusController.handle);

export { eventSalonsRoutes };
