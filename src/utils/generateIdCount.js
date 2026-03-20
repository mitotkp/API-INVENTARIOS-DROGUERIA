import crypto from 'crypto'; 

export class uuidGenerator {
    static nuevoUUID() {
        return crypto.randomUUID().toUpperCase(); 
    }
}