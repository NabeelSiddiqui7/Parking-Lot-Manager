export interface Ticket {
    id: number,
    lotid: number,
    spaceid: number,
    effectivedate: Date,
    expectedexpirydate: Date
}

export interface TicketPrice {
    id: number,
    effectivedate: Date,
    expectedexpirydate: Date,
    price: number
}