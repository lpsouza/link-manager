import { connect, disconnect } from "mongoose";

export class DB {
    private static instance: DB;

    public static getInstance(): DB {
        if (!DB.instance) {
            DB.instance = new DB();
        }
        return DB.instance;
    }

    public async start() {
        connect(process.env.CONNECTION_STRING);
    }

    public async stop() {
        await disconnect();
    }
}
