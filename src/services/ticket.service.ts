import { TicketPrice } from "@/interfaces/ticket.interface";
import prisma from "@databases/postgresClient"

class TicketService {

    public async getTicket(id: any) {
        const results = await prisma.$queryRaw`SELECT id, spaceid, effectivedate, expectedexpirydate, booked FROM tickets t WHERE t.spaceid = ${id}`;
        return results;
    }
    public async insertTicket(spaceID: number, expectedexpirydate: Date) {
        const results: number = await prisma.$executeRaw`INSERT INTO tickets (spaceid, expectedexpirydate, booked) VALUES (${spaceID}, (TO_TIMESTAMP(${expectedexpirydate}, 'YYYY-MM-DD HH:MI:SS')), TRUE)`;
        return results;
    }

    public async updateTicket(ticketID: number, expectedexpirydate: Date) {
        const results: number = await prisma.$executeRaw`UPDATE tickets SET expectedexpirydate=(TO_TIMESTAMP(${expectedexpirydate}, 'YYYY-MM-DD HH:MI:SS')) WHERE id = ${Number(ticketID)}`;
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
