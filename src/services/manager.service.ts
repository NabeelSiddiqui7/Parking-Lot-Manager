import prisma from "@databases/postgresClient"
import { Manager, ManagerAuth } from "@interfaces/manager.interface"
class ManagerService {

    public async getManagers() {
        const results: Manager[] = await prisma.$queryRaw<Manager>`SELECT name, username FROM managers`;
        return results;
    }
    public async insertManager(userName: string, name: string, password: string) {
        const results: number = await prisma.$executeRaw`INSERT INTO managers (name, username, password) VALUES (${name}, ${userName}, ${password})`;
        return results;
    }

    public async deleteManager(username: string) {
        const results: number = await prisma.$executeRaw`DELETE FROM managers WHERE username LIKE ${username}`;
        return results;
    }

    public async getManagerAuth(username: string) {
        const results: ManagerAuth[] = await prisma.$queryRaw<ManagerAuth>`SELECT username, password FROM managers WHERE username LIKE ${username}`;
        return results;
    }
}

export default ManagerService;