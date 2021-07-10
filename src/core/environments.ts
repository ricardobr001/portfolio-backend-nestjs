import { config } from 'dotenv'

const envFile = '.env'
const { parsed } = config({ path: envFile })

export const NODE_PORT = Number(parsed.NODE_PORT)
export const FANART_TV_API_KEY = parsed.FANART_TV_API_KEY
export const GENIUS_ACCESS_TOKEN = parsed.GENIUS_ACCESS_TOKEN
export const LAST_FM_API_KEY = parsed.LAST_FM_API_KEY
