export interface ParkingLot {
    name: string,
    location: string,
    length: number,
    width: number
}

export interface ParkingSpace {
    spaceid: number,
    avalible: boolean
}

export interface ParkingLotRate {
    rate: number,
    overtimerate: number
}

export interface ParkingLotAvalibility {
    booked: ParkingSpace[],
    unavalible: ParkingSpace[]
}