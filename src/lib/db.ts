import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:PTDKwsGsPRqtdAClGELtHhbYuUIePGOI@ballast.proxy.rlwy.net:11528/railway",
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
