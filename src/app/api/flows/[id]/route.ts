
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const res = await query('SELECT data FROM flows WHERE id = $1', [id]);

        if (res.rows.length > 0) {
            return NextResponse.json(res.rows[0].data);
        }

        return NextResponse.json(null, { status: 404 });
    } catch (error) {
        console.error('DB Error:', error);
        return NextResponse.json({ error: 'Failed to fetch flow' }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const data = await req.json();
        const { nodes, edges } = data;

        // Update flow
        await query(
            'UPDATE flows SET data = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [JSON.stringify({ nodes, edges }), id]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DB Error:', error);
        return NextResponse.json({ error: 'Failed to save flow' }, { status: 500 });
    }
}
