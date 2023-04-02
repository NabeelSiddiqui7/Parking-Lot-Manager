import { ParkingLot, ParkingLotRate, ParkingRate, ParkingSpace } from "@interfaces/lot.interface";
import prisma from "@databases/postgresClient"

class LotService {
    public async insertLot(name: string, length: number, width: number, location: string, rate: number, overtimerate: number) {
        let result: number = await prisma.$executeRaw`INSERT INTO lots (name, length, width, location) VALUES (${name},${length},${width},${location})`;
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

    public async deleteLot(lotName: string) {
        const results: number = await prisma.$executeRaw`DELETE FROM lots WHERE name LIKE ${lotName}`;


        return results;
    }

    public async getLots(sortField: string, order: "ASC" | "DESC") {
        let results: ParkingLot[];
        if (sortField == "ASC") {
            results = await prisma.$queryRaw<ParkingLot[]>`
SELECT
	l1.id,
	l1.name,
	l1.location,
	r.rate,
	l1.length,
	l1.width,
	(
	SELECT
		count(*)
	FROM
		spaces s
	JOIN lots l2 ON
		s.lotid = l2.id AND avalible
	WHERE
		l2.id = l1.id
		AND s.id NOT IN (
		SELECT
			spaceid
		FROM
			tickets t
		WHERE
			expirydate IS NULL))
FROM
	lots l1
JOIN rates r ON
	l1.id = r.lotID
ORDER BY
	l1.name ASC`;
        }
        else {
            results = await prisma.$queryRaw<ParkingLot[]>`
SELECT
    l1.id,
    l1.name,
    l1.location,
    r.rate,
    l1.length,
    l1.width,
    (
    SELECT
        count(*)
    FROM
        spaces s
    JOIN lots l2 ON
        s.lotid = l2.id AND avalible
    WHERE
        l2.id = l1.id
        AND s.id NOT IN (
        SELECT
            spaceid
        FROM
            tickets t
        WHERE
            expirydate IS NULL))
FROM
    lots l1
JOIN rates r ON
    l1.id = r.lotID
ORDER BY
    l1.name ASC`;
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