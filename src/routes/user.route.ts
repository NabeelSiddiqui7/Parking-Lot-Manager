import { Prisma } from '@prisma/client';
import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { Route } from '@interfaces/route.interface';
import LotService from '@services/lot.service';
import TicketService from '@services/ticket.service';
import { ParkingLotRate } from '@/interfaces/lot.interface';
import { Ticket } from '@interfaces/ticket.interface';

class UserRoute implements Route {
    public router: Router = Router();
    public path: string = '/user';
    public lotService: LotService = new LotService();
    public ticketService: TicketService = new TicketService();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        // get avalible spots in a lot
        this.router.get(`${this.path}/lot`, async (req: Request, res: Response) => {

        });
        // get all lot info
        this.router.get(`${this.path}/lots`, async (req: Request, res: Response) => {
            const data = await this.lotService.getLots();
            res.send(data);
        });

        // get rate of a lot
        this.router.get(`${this.path}/rate`, async (req: Request, res: Response, next: NextFunction) => {
            const lotID: number = 2;
            const data: ParkingLotRate[] = await this.lotService.getRate(lotID);
            if (data.length) {
                res.send(data);
            } else {
                next(new HttpException(500,'No such lot exists'));
            }
        });

        // book ticket
        this.router.post(`${this.path}/ticket`, async (req: Request, res: Response) => { });
        // get ticket info
        this.router.get(`${this.path}/ticket`, async (req: Request, res: Response) => {
            const ticketID: number = 2;
            const data: Ticket = await this.ticketService.getTicket(ticketID);
            if (data) {
                res.send(data);
            } else {
                next('No such lot exists');
            }
        });
    }
}

export default UserRoute;