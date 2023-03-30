import { ParkingLot, ParkingLotRates, ParkingRate, ParkingSpace } from "@interfaces/lot.interface";
import prisma from "@databases/postgresClient"

class LotService {

    public async getLot(lotID: number) {
        const results: ParkingLot[] = await prisma.$queryRaw<ParkingLot>`SELECT id, name, location, length, width FROM lots l WHERE l.lotid = ${lotID}`;
        if (results.length) {
            return results[0];
        }
        return null;
    }

    public async deleteLot(lotName: string) {
        const results: number = await prisma.$executeRaw`DELETE FROM lots WHERE name LIKE ${lotName}`;
        return results;
    }

    public async getLots() {
        const results: ParkingLot[] = await prisma.$queryRaw<ParkingLot>`SELECT id, name, location, length, width FROM lots`;
        return results;
    }

    public async getRate(lotID: number) {
        const results: ParkingRate[] = await prisma.$queryRaw<ParkingRate>`SELECT rate, overtimerate FROM rates r WHERE r.expirydate IS NULL AND r.lotID = ${lotID}`;
        if (results.length) {
            return results[0];
        }
        return null;
    }

    public async getRates() {
        const results: ParkingLotRates[] = await prisma.$queryRaw<ParkingLotRate>`SELECT l.id, l.name, l.length, l.width, l.location, r.rate, r.overtimerate FROM lots l JOIN rates r ON l.id = r.id AND r.expirydate IS NULL`;
        return results;
    }

    public async getBookedSpaces(lotID: number) {
        const results: ParkingSpace[] = await prisma.$queryRaw<ParkingSpace>`SELECT id, 0 avalible FROM spaces s WHERE avalible AND lotid = ${lotID} AND id NOT IN (SELECT spaceid FROM tickets t WHERE t.expirydate IS NULL)`;
        return results;
    }

    public async getUnavalibleSpaces(lotID: number) {
        const results: ParkingSpace[] = await prisma.$queryRaw<ParkingSpace>`SELECT id, avalible FROM spaces s WHERE NOT avalible AND lotid = ${lotID}`;
        return results;
    }

    public async getAllSpaces(lotID: number) {
        const results: ParkingSpace[] = await prisma.$queryRaw<ParkingSpace>`SELECT id, avalible FROM spaces s WHERE lotid = ${lotID}`;
        return results;
    }

    public async updateSpace(spaceID: number, avalible: boolean) {
        const results: number = await prisma.$executeRaw`UPDATE spaces SET avalible=${avalible} WHERE id=${spaceID}`;
        return results;

    }
}

export default LotService;