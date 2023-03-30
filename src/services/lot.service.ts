import { ParkingLotRate } from "@interfaces/lot.interface";
import prisma from "@databases/postgresClient"

class LotService {

    public async getLot(lotID: number) {
        const results = await prisma.$queryRaw`SELECT * FROM lots l WHERE l.lotid = ${lotID}`;
        return results;
    }

    public async getLots() {
        const results = await prisma.$queryRaw`SELECT * FROM lots`;
        console.log(results);
        return results;
    }

    public async getRate(lotID: number) {
        const results = await prisma.$queryRaw<ParkingLotRate>`SELECT rate,overtimerate FROM rates r WHERE r.expirydate IS NULL AND r.lotID = ${lotID}`;
        return results;
    }
}

export default LotService;