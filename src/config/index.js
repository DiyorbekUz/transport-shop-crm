import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.join(process.cwd(), ".env") })

export const STAFF_CONFIG = {
    PAGINATION: {
        LIMIT: 10,
        PAGE: 1
    }
}
export const BRANCH_CONFIG = {
    PAGINATION: {
        LIMIT: 10,
        PAGE: 1
    }
}
export const TRANSPORT_CONFIG = {
    PAGINATION: {
        LIMIT: 10,
        PAGE: 1
    }
}