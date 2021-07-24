import { EMPTY_MBID, IMAGE_NOT_FOUND, INDEX_NOT_FOUND } from '@core/constants'
import { Artist } from '@domain/entity/artist'
import { FanArtImplementation } from '@infrastructure/service/artist/fanArt/fanArtImplementation'
import { FanArtImage } from '@infrastructure/service/artist/fanArt/types'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindImageUseCase {
  constructor(private readonly fanArtImplementation: FanArtImplementation) {}

  public async getArtistsImage(artistsArr: Artist[]): Promise<Artist[]> {
    const artistsWithMBID = artistsArr.filter(artist => artist.mbid !== EMPTY_MBID)

    if (!artistsWithMBID.length) {
      return this.addEmptyImageToArtists(artistsArr)
    }

    const mbids = artistsWithMBID.map(artist => artist.mbid)
    const artistsWithImage = await this.fanArtImplementation.getArtistImage(mbids)

    return this.addImageToArtistArray(artistsArr, artistsWithImage)
  }

  private addImageToArtistArray(artistsArr: Artist[], fanArtImagesArr: FanArtImage[]): Artist[] {
    return artistsArr.map(artist => {
      if (artist.mbid === EMPTY_MBID) {
        return { ...artist, image: IMAGE_NOT_FOUND }
      }

      const index = fanArtImagesArr.findIndex(fanArtImage => artist.mbid === fanArtImage.mbid)

      if (index === INDEX_NOT_FOUND) {
        return { ...artist, image: IMAGE_NOT_FOUND }
      }

      const { image } = fanArtImagesArr[index]
      return { ...artist, image }
    })
  }

  private addEmptyImageToArtists(artistsArr: Artist[]): Artist[] {
    return artistsArr.map(artist => ({ ...artist, image: IMAGE_NOT_FOUND }))
  }
}
