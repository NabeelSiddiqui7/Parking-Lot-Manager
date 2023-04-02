import { Prisma } from '@prisma/client';
import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { Route } from '@interfaces/route.interface';
import LotService from '@services/lot.service';
import TicketService from '@services/ticket.service';
import ManagerService from '@services/manager.service';
import { ParkingLotAvalibility, ParkingLotRate, ParkingRate } from '@interfaces/lot.interface';
import { Manager, ManagerAuth } from "@interfaces/manager.interface"

class ManagerRoute implements Route {
    public router: Router = Router();
    public path: string = '/manager';
    public lotService: LotService = new LotService();
    public ticketService: TicketService = new TicketService();
    public managerService: ManagerService = new ManagerService();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        // get current rates for all lots
        this.router.get(`${this.path}/rates`, async (req: Request, res: Response, next: NextFunction) => {
            const result: ParkingLotRate[] = await this.lotService.getRates();
            res.send(result);
        });
        // // insert rate for a lot
        // this.router.post(`${this.path}/rate`, async (req: Request, res: Response, next: NextFunction) => { });

        // update rate for a lot
        this.router.put(`${this.path}/rate`, async (req: Request, res: Response, next: NextFunction) => { });

        // get all lot info
        this.router.get(`${this.path}/lots`, async (req: Request, res: Response, next: NextFunction) => {
            const result: any = await this.lotService.getLots();
            res.send(result);
        });
        // insert a lot info
        // this.router.post(`${this.path}/lots`, async (req: Request, res: Response, next: NextFunction) => {
        //     const lotname: string = "mynewlot";
        //     const lotlength: number = 4;
        //     const lotwidth: number = 4;
        //     const lotlocation: string = "idk";
        //     const lotrate: number = 1.2;
        //     const lotovertimerate = 2.5;
        //     const result = await this.lotService.insertLot(lotname, lotlength, lotwidth, lotlocation, lotrate, lotovertimerate);
        //     if (result) {
        //         res.send("New lot created");
        //     }
        //     else {
        //         next(new HttpException(402, "Lot Name already exists"));
        //     }
        // });

        // delete a lot
        this.router.delete(`${this.path}/lots`, async (req: Request, res: Response, next: NextFunction) => {
            const lotname: string = "myfirstlot";
            const results: number = await this.lotService.deleteLot(lotname);
            if (results) {
                res.send(`${lotname} was deleted`);
            } else {
                next(new HttpException(402, "No such lot"));
            }
        });

        // get map of lot
        this.router.get(`${this.path}/lot`, async (req: Request, res: Response, next: NextFunction) => {
            const lotid: number = 1;
            const data: ParkingLotAvalibility = {
                booked: await this.lotService.getBookedSpaces(lotid),
                unavalible: await this.lotService.getAllSpaces(lotid)
            }
            res.send(data);
        });

        // update lot map
        this.router.post(`${this.path}/lot`, async (req: Request, res: Response, next: NextFunction) => {
            const spaceid: number = 1;
            const avalibility: boolean = false;
            if (await this.lotService.updateSpace(spaceid, avalibility)) {
                res.send("Space Updated");
            } else {
                next(new HttpException(402, "Space does not exist"));
            }
        });

        // get usage of a lot
        // please use /manager/lot to calculate in frontend
        this.router.get(`${this.path}/usage`, async (req: Request, res: Response, next: NextFunction) => { });

        // get all manager names
        this.router.get(`${this.path}/managers`, async (req: Request, res: Response, next: NextFunction) => {
            const results: Manager[] = await this.managerService.getManagers();
            res.send(results)
        });
        // insert a managers info
        this.router.post(`${this.path}/managers`, async (req: Request, res: Response, next: NextFunction) => {
            const managername: string = "saud";
            const managerusername: string = "saudr";
            const managerpassword: string = "paswrd";
            if (await this.managerService.insertManager(managerusername, managername, managerpassword)) {
                res.send("Manager Created");
            } else {
                next(new HttpException(402, "Failed to insert manager"));
            }
        });
        // update a managers info
        this.router.put(`${this.path}/managers`, async (req: Request, res: Response, next: NextFunction) => { });

        // delete a manager
        this.router.delete(`${this.path}/managers`, async (req: Request, res: Response, next: NextFunction) => {
            const managerusername = "saudr";
            if (await this.managerService.deleteManager(managerusername)) {
                res.send("Manager Delete Successful");
            } else {
                next(new HttpException(402, "Failed to delete manager"));
            }
        });

        // authenticate a manager
        this.router.post(`${this.path}/login`, async (req: Request, res: Response, next: NextFunction) => {
            const { username, password } = req.body;
          
            const result = await this.managerService.getManagerAuth(username);
          
            if (result.length === 0 || result[0].password !== password) {
              return next(new HttpException(403, "Invalid username or password"));
            } else {
              res.send("Manager authenticated");
            }
          });
    }
}

export default ManagerRoute;