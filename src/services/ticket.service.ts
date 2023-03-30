import prisma from "@databases/postgresClient"

class TicketService {
    
    public async getTicket(ticketID: number) {
        const results = await prisma.$queryRaw`SELECT * FROM lots`;
        return results;
    }
    public async insertTicket(spaceID: number, expectedexpirydate: Date) {
        const results = await prisma.$queryRaw`SELECT * FROM lots`;
        return results;
    }
}

export default TicketService;