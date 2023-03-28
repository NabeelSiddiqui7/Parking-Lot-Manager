import { Prisma } from '@prisma/client';
import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { Route } from '@interfaces/route.interface';

class UserRoute implements Route {
    public router: Router = Router();
    public path: string = '/user';

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        // get avalible spots in a lot
        this.router.get(`${this.path}/lot`, (req: Request, res: Response) => { });
        // get all lot info
        this.router.get(`${this.path}/lots`, (req: Request, res: Response) => { });
        
        // get rate of a lot
        this.router.get(`${this.path}/rate`, (req: Request, res: Response) => { });
        
        // book ticket
        this.router.post(`${this.path}/ticket`, (req: Request, res: Response) => { });
        // get ticket info
        this.router.get(`${this.path}/ticket`, (req: Request, res: Response) => { });
    }
}

export default UserRoute;