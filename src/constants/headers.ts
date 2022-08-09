import { Request } from "express";

const HEADERS = {
    LOCATION: {
        NAME: 'location',
        CREATE: (request: Request, id: string) => `${request.get('host')}/${id}`
    }
    
}

export default HEADERS;