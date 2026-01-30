
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        // Ensure table exists with name column
        await query(`
      CREATE TABLE IF NOT EXISTS flows (
        id SERIAL PRIMARY KEY,
        title TEXT,
        data JSONB,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // Get all flows for dashboard
        const res = await query('SELECT id, title, updated_at FROM flows ORDER BY updated_at DESC');

        return NextResponse.json({ flows: res.rows });
    } catch (error) {
        console.error('DB Error:', error);
        return NextResponse.json({ error: 'Failed to fetch flows' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, nodes, edges } = body;

        // Create new flow
        const res = await query(
            'INSERT INTO flows (title, data) VALUES ($1, $2) RETURNING id',
            [title, JSON.stringify({ nodes, edges })]
        );

        return NextResponse.json({ id: res.rows[0].id });
    } catch (error) {
        console.error('DB Error:', error);
        return NextResponse.json({ error: 'Failed to create flow' }, { status: 500 });
    }
}
