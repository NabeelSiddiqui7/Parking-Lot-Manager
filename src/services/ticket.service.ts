import { TicketPrice } from "@/interfaces/ticket.interface";
import prisma from "@databases/postgresClient"

class TicketService {

    public async getTicket(ticketID: number) {
        const results = await prisma.$queryRaw`SELECT id, spaceid, effectivedate, expirydate FROM tickets t WHERE t.id = ${ticketID}`;
        return results;
    }
    public async insertTicket(spaceID: number, expectedexpirydate: number) {
        const results: number = await prisma.$executeRaw`INSERT INTO tickets (spaceid, expectedexpirydate) VALUES (${spaceID}, ${expectedexpirydate})`;
        return results;
    }

    public async updateTicket(ticketID: number) {
        const results: number = await prisma.$executeRaw`UPDATE tickets SET expirydate=CURRENT_TIMESTAMP WHERE id = ${ticketID}`;
        return results;
    }

    public async getTicketPrice(ticketID: number) {
        const results: TicketPrice[] = await prisma.$queryRaw`
SELECT t.id,
    t.effectivedate,
    t.expectedexpirydate,
    t.expirydate,
    CASE
            WHEN t.expirydate <= t.expectedexpirydate THEN (Date_part('day', t.expirydate - t.effectivedate) * 24 + Date_part('hour', t.expirydate - t.effectivedate)) * 60 + Date_part('minute', t.expirydate - t.effectivedate) * r.rate
            ELSE (Date_part('day', t.expirydate - t.effectivedate) * 24 + Date_part('hour', t.expirydate - t.effectivedate)) * 60 + Date_part('minute', t.expirydate - t.effectivedate) * r.rate + (Date_part('day', t.expectedexpirydate - t.expirydate) * 24 + Date_part('hour', t.expectedexpirydate - t.expirydate)) * 60 + Date_part('minute', t.expectedexpirydate - t.expirydate) * r.overtimerate
    END price
FROM   tickets t
JOIN   spaces s
ON     t.spaceid = s.id
JOIN   rates r
ON     s.lotid = r.lotid
AND    t.effectivedate BETWEEN r.effectivedate AND COALESCE(r.expirydate, CURRENT_TIMESTAMP)
WHERE  t.id = ${ticketID}
`;
        if (results.length) {
            return results[0];
        }
        return null;
    }
}

export default TicketService;