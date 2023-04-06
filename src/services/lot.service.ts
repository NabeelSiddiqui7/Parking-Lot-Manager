import { ParkingLot, ParkingLotRate, ParkingRate, ParkingSpace } from "@interfaces/lot.interface";
import prisma from "@databases/postgresClient"

class LotService {
    public async insertLot(name: string, length: number, width: number, location: string, rate: number, overtimerate: number, managerusername: string) {
        let result: number = await prisma.$executeRaw`INSERT INTO lots (name, length, width, location, managerusername) VALUES (${name},${length},${width},${location}, ${managerusername})`;
        result = await prisma.$executeRaw`INSERT INTO rates (lotid, rate, overtimerate) VALUES ((SELECT id FROM lots WHERE name LIKE ${name}), ${rate}, ${overtimerate})`;
        if (result) {
            for (let indexLength = 0; indexLength < length; indexLength++) {
                for (let indexWidth = 0; indexWidth < width; indexWidth++) {
                    result = await prisma.$executeRaw`INSERT INTO spaces (lotid, lengthlocation, widthlocation) VALUES ((SELECT id FROM lots WHERE name LIKE ${name}), ${indexLength}, ${indexWidth})`;
                    if (!result) {
                        return result;
                    }
                }
            }
        }
        return result;
    }

    public async getLot(lotID: number) {
        const results: ParkingLot[] = await prisma.$queryRaw<ParkingLot[]>`SELECT id, name, location, length, width FROM lots l WHERE l.lotid = ${lotID}`;
        if (results.length) {
            return results[0];
        }
        return null;
    }

    public async deleteLot(lotid: string) {
        const rmRates: number = await prisma.$executeRaw`DELETE FROM rates WHERE lotid = ${parseInt(lotid)}`;
        const rmSpaces: number = await prisma.$executeRaw`DELETE FROM spaces WHERE lotid = ${parseInt(lotid)}`;
        const results: number = await prisma.$executeRaw`DELETE FROM lots WHERE id = ${parseInt(lotid)}`;

        return results;
    }

    public async getLots(sortField: string, order: "ASC" | "DESC") {
        let results: ParkingLot[];
        if (sortField == "name" && order == "ASC") {
            results = await prisma.$queryRaw<ParkingLot[]>`SELECT l1.id, l1.name, l1.location, r.rate, l1.length, l1.width, 
            (SELECT count(*) FROM spaces s JOIN lots l2 ON s.lotid = l2.id WHERE l2.id = l1.id AND s.id NOT IN (SELECT spaceid FROM tickets t WHERE expirydate IS NULL))::INTEGER, 
            l1.managerusername, 
            COALESCE(
            (SELECT SUM(price) FROM
                (SELECT t.id, s.lotid,
                    CASE
                        WHEN t.expirydate <= t.expectedexpirydate 
                        THEN (DATE_PART('day', t.expirydate - t.effectivedate) * 24 + DATE_PART('hour', t.expirydate - t.effectivedate)) * 60 + DATE_PART('minute', t.expirydate - t.effectivedate) * r.rate
                        ELSE (DATE_PART('day', t.expirydate - t.effectivedate) * 24 + DATE_PART('hour', t.expirydate - t.effectivedate)) * 60 + DATE_PART('minute', t.expirydate - t.effectivedate) * r.rate + (DATE_PART('day', t.expectedexpirydate - t.expirydate) * 24 + DATE_PART('hour', t.expectedexpirydate - t.expirydate)) * 60 + DATE_PART('minute', t.expectedexpirydate - t.expirydate) * r.overtimerate
                    END AS price
                FROM tickets t
                JOIN spaces s ON t.spaceid = s.id
                JOIN rates r ON s.lotid = r.lotid AND t.effectivedate BETWEEN r.effectivedate AND COALESCE(r.expirydate, CURRENT_TIMESTAMP)
                WHERE s.lotid = l1.id) subquery), 0) AS revenue
            FROM lots l1 
            JOIN rates r ON l1.id = r.lotid 
            ORDER BY l1.name ASC`;
        }
        else if (sortField == "name" && order == "DESC") {
            results = await prisma.$queryRaw<ParkingLot[]>`SELECT l1.id, l1.name, l1.location, r.rate, l1.length, l1.width, 
            (SELECT count(*) FROM spaces s JOIN lots l2 ON s.lotid = l2.id WHERE l2.id = l1.id AND s.id NOT IN (SELECT spaceid FROM tickets t WHERE expirydate IS NULL))::INTEGER, 
            l1.managerusername, 
            COALESCE(
            (SELECT SUM(price) FROM
                (SELECT t.id, s.lotid,
                    CASE
                        WHEN t.expirydate <= t.expectedexpirydate 
                        THEN (DATE_PART('day', t.expirydate - t.effectivedate) * 24 + DATE_PART('hour', t.expirydate - t.effectivedate)) * 60 + DATE_PART('minute', t.expirydate - t.effectivedate) * r.rate
                        ELSE (DATE_PART('day', t.expirydate - t.effectivedate) * 24 + DATE_PART('hour', t.expirydate - t.effectivedate)) * 60 + DATE_PART('minute', t.expirydate - t.effectivedate) * r.rate + (DATE_PART('day', t.expectedexpirydate - t.expirydate) * 24 + DATE_PART('hour', t.expectedexpirydate - t.expirydate)) * 60 + DATE_PART('minute', t.expectedexpirydate - t.expirydate) * r.overtimerate
                    END AS price
                FROM tickets t
                JOIN spaces s ON t.spaceid = s.id
                JOIN rates r ON s.lotid = r.lotid AND t.effectivedate BETWEEN r.effectivedate AND COALESCE(r.expirydate, CURRENT_TIMESTAMP)
                WHERE s.lotid = l1.id) subquery), 0) AS revenue
            FROM lots l1 
            JOIN rates r ON l1.id = r.lotid 
            ORDER BY l1.name DESC`;
        }

        else if (sortField == "location" && order == "ASC") {
            results = await prisma.$queryRaw<ParkingLot[]>`SELECT l1.id, l1.name, l1.location, r.rate, l1.length, l1.width, 
            (SELECT count(*) FROM spaces s JOIN lots l2 ON s.lotid = l2.id WHERE l2.id = l1.id AND s.id NOT IN (SELECT spaceid FROM tickets t WHERE expirydate IS NULL))::INTEGER, 
            l1.managerusername, 
            COALESCE(
            (SELECT SUM(price) FROM
                (SELECT t.id, s.lotid,
                    CASE
                        WHEN t.expirydate <= t.expectedexpirydate 
                        THEN (DATE_PART('day', t.expirydate - t.effectivedate) * 24 + DATE_PART('hour', t.expirydate - t.effectivedate)) * 60 + DATE_PART('minute', t.expirydate - t.effectivedate) * r.rate
                        ELSE (DATE_PART('day', t.expirydate - t.effectivedate) * 24 + DATE_PART('hour', t.expirydate - t.effectivedate)) * 60 + DATE_PART('minute', t.expirydate - t.effectivedate) * r.rate + (DATE_PART('day', t.expectedexpirydate - t.expirydate) * 24 + DATE_PART('hour', t.expectedexpirydate - t.expirydate)) * 60 + DATE_PART('minute', t.expectedexpirydate - t.expirydate) * r.overtimerate
                    END AS price
                FROM tickets t
                JOIN spaces s ON t.spaceid = s.id
                JOIN rates r ON s.lotid = r.lotid AND t.effectivedate BETWEEN r.effectivedate AND COALESCE(r.expirydate, CURRENT_TIMESTAMP)
                WHERE s.lotid = l1.id) subquery), 0) AS revenue
            FROM lots l1 
            JOIN rates r ON l1.id = r.lotid 
            ORDER BY l1.location ASC`;
        }

        else {
            results = await prisma.$queryRaw<ParkingLot[]>`SELECT l1.id, l1.name, l1.location, r.rate, l1.length, l1.width, 
            (SELECT count(*) FROM spaces s JOIN lots l2 ON s.lotid = l2.id WHERE l2.id = l1.id AND s.id NOT IN (SELECT spaceid FROM tickets t WHERE expirydate IS NULL))::INTEGER, 
            l1.managerusername, 
            COALESCE(
            (SELECT SUM(price) FROM
                (SELECT t.id, s.lotid,
                    CASE
                        WHEN t.expirydate <= t.expectedexpirydate 
                        THEN (DATE_PART('day', t.expirydate - t.effectivedate) * 24 + DATE_PART('hour', t.expirydate - t.effectivedate)) * 60 + DATE_PART('minute', t.expirydate - t.effectivedate) * r.rate
                        ELSE (DATE_PART('day', t.expirydate - t.effectivedate) * 24 + DATE_PART('hour', t.expirydate - t.effectivedate)) * 60 + DATE_PART('minute', t.expirydate - t.effectivedate) * r.rate + (DATE_PART('day', t.expectedexpirydate - t.expirydate) * 24 + DATE_PART('hour', t.expectedexpirydate - t.expirydate)) * 60 + DATE_PART('minute', t.expectedexpirydate - t.expirydate) * r.overtimerate
                    END AS price
                FROM tickets t
                JOIN spaces s ON t.spaceid = s.id
                JOIN rates r ON s.lotid = r.lotid AND t.effectivedate BETWEEN r.effectivedate AND COALESCE(r.expirydate, CURRENT_TIMESTAMP)
                WHERE s.lotid = l1.id) subquery), 0) AS revenue
            FROM lots l1 
            JOIN rates r ON l1.id = r.lotid 
            ORDER BY l1.location DESC`;
        }

        return results;
    }

    public async getRate(lotID: number) {
        const results: ParkingRate[] = await prisma.$queryRaw<ParkingRate[]>`SELECT rate, overtimerate FROM rates r WHERE r.expirydate IS NULL AND r.lotID = ${lotID}`;
        if (results.length) {
            return results[0];
        }
        return null;
    }

    public async getRates() {
        const results: ParkingLotRate[] = await prisma.$queryRaw<ParkingLotRate[]>`SELECT l.id, l.name, l.length, l.width, l.location, r.rate, r.overtimerate FROM lots l JOIN rates r ON l.id = r.id AND r.expirydate IS NULL`;
        return results;
    }

    public async getBookedSpaces(lotID: number) {
        const results: ParkingSpace[] = await prisma.$queryRaw<ParkingSpace[]>`SELECT id, 0 avalible FROM spaces s WHERE avalible AND lotid = ${lotID} AND id IN (SELECT spaceid FROM tickets t WHERE t.expirydate IS NULL)`;
        return results;
    }

    public async getUnavalibleSpaces(lotID: number) {
        const results: ParkingSpace[] = await prisma.$queryRaw<ParkingSpace[]>`SELECT id, avalible, lengthlocation, widthlocation FROM spaces s WHERE NOT avalible AND lotid = ${lotID}`;
        return results;
    }

    public async getAllSpaces(lotID: number) {
        const results: ParkingSpace[] = await prisma.$queryRaw<ParkingSpace[]>`SELECT id, avalible, lengthlocation, widthlocation FROM spaces s WHERE lotid = ${lotID}`;
        return results;
    }

    public async updateSpace(spaceID: number, avalible: boolean) {
        const results: number = await prisma.$executeRaw`UPDATE spaces SET avalible=${avalible} WHERE id=${spaceID}`;
        return results;

    }
}

export default LotService;