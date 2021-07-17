import { FANART_TV_URL, IMAGE_NOT_FOUND } from '@core/constants'
import { FANART_TV_API_KEY } from '@core/environments'
import { Injectable } from '@nestjs/common'
import { randomPositionBasedOnArrayLength } from '@utils/randomArrPosition'
import axios, { AxiosInstance } from 'axios'
import { FanArtEndpoint, FanArtImage, FanArtResponse } from './types'

@Injectable()
export class FanArtImplementation {
  private readonly _axios: AxiosInstance

  constructor() {
    this._axios = axios.create({ baseURL: FANART_TV_URL })
  }

  async getArtistImage(mbids: string[]): Promise<FanArtImage[]> {
    const endpoints = this.generateEndpoints(mbids)
    const res = await Promise.all(endpoints.map(endpoint => this.getImage(endpoint)))

    return res
  }

  private generateEndpoints(mbids: string[]): FanArtEndpoint[] {
    return mbids.map((mbid): FanArtEndpoint => ({ mbid, url: `/${mbid}&?api_key=${FANART_TV_API_KEY}&format=json` }))
  }

  private async getImage(endpoint: FanArtEndpoint): Promise<FanArtImage> {
    const { mbid, url } = endpoint

    try {
      const response = await this._axios.get<FanArtResponse>(url)
      const { artistbackground } = response.data
      const { url: image } = randomPositionBasedOnArrayLength(artistbackground)

      return {
        mbid,
        image
      }
    } catch (err) {
      return {
        mbid: mbid,
        image: IMAGE_NOT_FOUND
      }
    }
  }
}
