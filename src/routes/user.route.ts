import { Prisma } from '@prisma/client';
import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { Route } from '@interfaces/route.interface';
import LotService from '@services/lot.service';
import TicketService from '@services/ticket.service';
import { ParkingLot, ParkingLotAvalibility, ParkingLotRate } from '@/interfaces/lot.interface';
import { Ticket, TicketPrice } from '@interfaces/ticket.interface';

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
            const lotID: number = 1;
            const data: ParkingLotAvalibility = {
                booked: await this.lotService.getBookedSpaces(lotID),
                spaces: await this.lotService.getAllSpaces(lotID)
            }
            res.send(data);
        });
        // get all lots info
        this.router.get(`${this.path}/lots`, async (req: Request, res: Response, next: NextFunction) => {
            const sortField: string = ""
            const data:ParkingLot[] = await this.lotService.getLots(sortField);
            res.send(data);
        });

        // get rate of a lot
        this.router.get(`${this.path}/rate`, async (req: Request, res: Response, next: NextFunction) => {
            const lotID: number = 1;
            const data: any = await this.lotService.getRate(lotID);
            if (data) {
                res.send(data);
            } else {
                next(new HttpException(402, 'No such lot exists'));
            }
        });

        // book ticket
        this.router.post(`${this.path}/ticket`, async (req: Request, res: Response, next: NextFunction) => {
            const spaceID: number = 1;
            const expectedexpirydate: number = Date.now();
            const result: number = await this.ticketService.insertTicket(spaceID, expectedexpirydate);
            if (result) {
                res.send(result);
            }
            else {
                next(new HttpException(500, 'Unable to insert ticket'))
            }

        });

        //expire ticket
        this.router.put(`${this.path}/ticket`, async (req: Request, res: Response, next: NextFunction) => {
            const ticketID: number = 4;
            if (await this.ticketService.updateTicket(ticketID)) {
                const results: any= await this.ticketService.getTicketPrice(ticketID);
                res.send(results);
            } else {
                next(new HttpException(402, 'No such ticket exists'));
            }

        });

        // get ticket info
        this.router.get(`${this.path}/ticket`, async (req: Request, res: Response, next: NextFunction) => {
            const ticketID: number = 2;
            const data: any = await this.ticketService.getTicket(ticketID);
            if (data) {
                res.send(data);
            } else {
                next(new HttpException(402, 'No such lot exists'));
            }
        });
    }
}

export default UserRoute;