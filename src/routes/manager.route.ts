import { Prisma } from '@prisma/client';
import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { Route } from '@interfaces/route.interface';

class ManagerRoute implements Route {
    public router: Router = Router();
    public path: string = '/manager';

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        //get current rates for all lots
        this.router.get(`${this.path}/rates`, (req: Request, res: Response) => { });
        // update rate for a lot
        this.router.post(`${this.path}/rate`, (req: Request, res: Response) => { });

        // get all lot info
        this.router.get(`${this.path}/lots`, (req: Request, res: Response) => { });
        // update a lots info
        this.router.post(`${this.path}/lots`, (req: Request, res: Response) => { });
        // delete a lot
        this.router.delete(`${this.path}/lots`, (req: Request, res: Response) => { });

        // get map of lot
        this.router.get(`${this.path}/lot`, (req: Request, res: Response) => { });

        // update lot map
        this.router.post(`${this.path}/lot`, (req: Request, res: Response) => { });

        // get usage of a lot
        this.router.get(`${this.path}/usage`, (req: Request, res: Response) => { });

        // get all manager names
        this.router.get(`${this.path}/managers`, (req: Request, res: Response) => { });
        // update a managers info
        this.router.post(`${this.path}/managers`, (req: Request, res: Response) => { });
        // delete a manager
        this.router.delete(`${this.path}/managers`, (req: Request, res: Response) => { });

        // authenticate a manager
        this.router.post(`${this.path}/login`, (req: Request, res: Response) => { });
    }
}

export default ManagerRoute;