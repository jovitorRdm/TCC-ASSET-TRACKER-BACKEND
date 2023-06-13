import { Router } from 'express';
import { CreateServicesController } from '../../../controllers/service/CreateEventController';
import { ChangeServiceStatusController } from '../../../controllers/service/ChangeEventStatusController';
import { ListServicesController } from '../../../controllers/service/ListEventController';
import { UpdateServicesController } from '../../../controllers/service/UpdateEventController';

const ServiceRoutes = Router();

const CreateServiceController = new CreateServicesController();
const changeServiceStatusController = new ChangeServiceStatusController();
const ListServiceController = new ListServicesController();
const UpdateServiceController = new UpdateServicesController();

ServiceRoutes.post('/', CreateServiceController.handle);
ServiceRoutes.get('/', ListServiceController.handle)
ServiceRoutes.put('/:id', UpdateServiceController.handle);
ServiceRoutes.patch('/:id', changeServiceStatusController.handle);

export { ServiceRoutes }
