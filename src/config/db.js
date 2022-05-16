import pg from 'pg'

const pool = new pg.Pool({
    user: process.env.PG_USER,
    port: process.env.PG_PORT,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    // connectionString: process.env.PG_CONNECTION_STRING
})

async function db(query, ...params) {
    const client = await pool.connect()

    try {
        const { rows } = await client.query(query, params.length ? params : null)
        return rows
    } catch (error) {
        console.log("DATABASE ERROR: ", error.message)
        throw new Error(error.message)
    } finally {
        client.release()
    }
}

export default db