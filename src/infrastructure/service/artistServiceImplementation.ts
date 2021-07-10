import { LAST_FM_ARTIST_LIMIT, LAST_FM_URL } from '@core/constants'
import { LAST_FM_API_KEY } from '@core/environments'
import { Artist } from '@domain/entity/artist'
import { artistServiceContract } from '@domain/service/artistServiceContract'
import { LastFmTopArtistResponse } from '@infrastructure/types/lastFmTopArtistResponse'
import { Injectable } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'

@Injectable()
export class ArtistServiceImplementation implements artistServiceContract {
  private readonly _axios: AxiosInstance

  constructor() {
    this._axios = axios.create({ baseURL: LAST_FM_URL })
  }

  async getTopArtists(username: string): Promise<Artist[]> {
    const res = await this._axios.get<LastFmTopArtistResponse>(
      `/?method=user.gettopartists&` +
        `user=${username}&` +
        `api_key=${LAST_FM_API_KEY}&` +
        `limit=${LAST_FM_ARTIST_LIMIT}&` +
        `format=json`
    )

    return this.formatLastFmResposeToDomainResponse(res.data)
  }

  private formatLastFmResposeToDomainResponse(response: LastFmTopArtistResponse): Artist[] {
    return response.topartists.artist.map(
      (elem): Artist => {
        const { name, playcount, mbid, image } = elem

        return {
          image: image[0]['#text'],
          mbid,
          name,
          playcount: Number(playcount)
        }
      }
    )
  }
}
