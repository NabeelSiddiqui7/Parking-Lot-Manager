export interface ParkingLot {
    id: number,
    name: string,
    location: string,
    length: number,
    width: number
}

export interface ParkingSpace {
    spaceid: number,
    avalible: boolean
}

export interface ParkingRate {
    rate: number,
    overtimerate: number
}

export interface ParkingLotAvalibility {
    booked: ParkingSpace[],
    spaces: ParkingSpace[]
}

export interface ParkingLotRate {
    id: number,
    name: string,
    length: number,
    width: number,
    location: string,
    rate: number,
    overtimerate: number
}