import { ParkingLot, ParkingLotRate, ParkingSpace } from "@interfaces/lot.interface";
import prisma from "@databases/postgresClient"

class LotService {

    public async getLot(lotID: number) {
        const results: ParkingLot[] = await prisma.$queryRaw<ParkingLot>`SELECT name, location, length, width FROM lots l WHERE l.lotid = ${lotID}`;
        if (results.length) {
            return results[0];
        }
        return null;
    }

    public async getLots() {
        const results: ParkingLot[] = await prisma.$queryRaw<ParkingLot>`SELECT * FROM lots`;
        return results;
    }

    public async getRate(lotID: number) {
        const results: ParkingLotRate[] = await prisma.$queryRaw<ParkingLotRate>`SELECT rate, overtimerate FROM rates r WHERE r.expirydate IS NULL AND r.lotID = ${lotID}`;
        if (results.length) {
            return results[0];
        }
        return null;
    }

    public async getBookedSpaces(lotID: number) {
        const results: ParkingSpace[] = await prisma.$queryRaw<ParkingSpace>`SELECT id, 0 avalible FROM spaces s WHERE avalible AND lotid = ${lotID} AND id NOT IN (SELECT spaceid FROM tickets t WHERE t.expirydate IS NULL)`;
        return results;
    }

    public async getUnavalibleSpaces(lotID:number) {
        const results: ParkingSpace[] = await prisma.$queryRaw<ParkingSpace>`SELECT id, avalible FROM spaces s WHERE NOT avalible AND lotid = ${lotID}`;
        return results;
    }
}

export default LotService;