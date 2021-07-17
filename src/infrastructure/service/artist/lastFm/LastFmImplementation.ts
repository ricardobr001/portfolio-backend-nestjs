import { LAST_FM_ARTIST_LIMIT, LAST_FM_URL } from '@core/constants'
import { LAST_FM_API_KEY } from '@core/environments'
import { LastFmArtist, LastFmTopArtistResponse } from './types'
import { Injectable } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'

@Injectable()
export class LastFmImplementation {
  private readonly _axios: AxiosInstance

  constructor() {
    this._axios = axios.create({ baseURL: LAST_FM_URL })
  }

  async getTopArtists(username: string): Promise<LastFmArtist[]> {
    const res = await this._axios.get<LastFmTopArtistResponse>(
      `/?method=user.gettopartists&` +
        `user=${username}&` +
        `api_key=${LAST_FM_API_KEY}&` +
        `limit=${LAST_FM_ARTIST_LIMIT}&` +
        `format=json`
    )

    return this.formatLastFmResposeToDomainResponse(res.data)
  }

  private formatLastFmResposeToDomainResponse(response: LastFmTopArtistResponse): LastFmArtist[] {
    return response.topartists.artist.map(elem => {
      const { name, playcount, mbid, image } = elem

      return {
        image: image[0]['#text'],
        mbid,
        name,
        playcount: Number(playcount)
      }
    })
  }
}
