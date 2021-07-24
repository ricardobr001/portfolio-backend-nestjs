import { LAST_FM_USER } from '@core/constants'
import { Artist } from '@domain/entity/artist'
import { Injectable } from '@nestjs/common'
import { shuffleByReference } from '@utils/shuffleByReference'
import { LastFmImplementation } from '@infrastructure/service/artist/lastFm/LastFmImplementation'
import { FindArtistsMBIDUseCase } from '@useCase/findArtistsMBID/findArtistsMBIDUseCase'
import { FindImageUseCase } from '@useCase/findImage/findImageUseCase'

const START_ARRAY = 0
const ARRAY_LEN = 3

@Injectable()
export class TopArtistsUseCase {
  constructor(
    private readonly lastFmImplementation: LastFmImplementation,
    private readonly findArtistsMBIDUseCase: FindArtistsMBIDUseCase,
    private readonly findImageUseCase: FindImageUseCase
  ) {}

  async getTopArtists(): Promise<Artist[]> {
    const res = await this.lastFmImplementation.getTopArtists(LAST_FM_USER)
    shuffleByReference(res)
    const slicedArr = res.slice(START_ARRAY, ARRAY_LEN)

    const artistsWithMBID = await this.findArtistsMBIDUseCase.findMBIDForArtistsWithoutIt(slicedArr)
    const artistsWithMBIDAndImages = await this.findImageUseCase.getArtistsImage(artistsWithMBID)

    return artistsWithMBIDAndImages
  }
}
