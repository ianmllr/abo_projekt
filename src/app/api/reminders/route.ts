import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const {email, daysBefore} = await req.json()

    if (!email || !daysBefore) {
        return NextResponse.json({error: 'Missing fields'}, {status: 400})
    }

    const sendAt = new Date()
    sendAt.setMonth(sendAt.getMonth() + 6)
    sendAt.setDate(sendAt.getDate() - daysBefore)

    await sql` 
        INSERT INTO reminders (email, daysBefore, send_at)
        VALUES (${email}, ${daysBefore}, ${sendAt.toISOString()})
    `

    return NextResponse.json({success: true, sendAt: sendAt.toISOString()})
}

