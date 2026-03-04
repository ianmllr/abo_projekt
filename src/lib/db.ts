import { neon } from '@neondatabase/serverless'

export function sql(
    strings: TemplateStringsArray,
    ...values: unknown[]
) {
    const client = neon(process.env.DATABASE_URL!)
    return client(strings, ...values)
}
