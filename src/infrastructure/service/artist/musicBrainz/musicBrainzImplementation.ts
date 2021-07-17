import { MUSIC_BRAINZ_URL } from '@core/constants'
import { ArtistMusicBrainz, MusicBrainzArtistResponse } from './types'
import { Injectable } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'

@Injectable()
export class MusicBrainzImplementation {
  private readonly _axios: AxiosInstance

  constructor() {
    this._axios = axios.create({ baseURL: MUSIC_BRAINZ_URL })
  }

  async getMBIDFromArtists(artists: string[]): Promise<ArtistMusicBrainz[]> {
    const endpoints = this.generateEndpoints(artists)
    const res = await Promise.all(endpoints.map(endpoint => this.getMBID(endpoint)))

    return res
  }

  private generateEndpoints(artists: string[]): string[] {
    return artists.map(name => `?query=artist:${name}&fmt=json`)
  }

  private async getMBID(endpoint: string): Promise<ArtistMusicBrainz> {
    const response = await this._axios.get<MusicBrainzArtistResponse>(endpoint)

    const { id: mbid, name } = response.data.artists[0]

    return {
      mbid,
      name
    }
  }
}
