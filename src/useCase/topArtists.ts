import { IMAGE_NOT_FOUND, LAST_FM_USER } from '@core/constants'
import { Artist } from '@domain/entity/artist'
import { MusicBrainzImplementation } from '@infrastructure/service/artist/musicBrainz/musicBrainzImplementation'
import { Injectable } from '@nestjs/common'
import { shuffleByReference } from '@utils/shuffleByReference'
import { LastFmImplementation } from '@infrastructure/service/artist/lastFm/LastFmImplementation'
import { ArtistMusicBrainz } from '@infrastructure/service/artist/musicBrainz/types'
import { FanArtImplementation } from '@infrastructure/service/artist/fanArt/fanArtImplementation'
import { FanArtImage } from '@infrastructure/service/artist/fanArt/types'

const START_ARRAY = 0
const ARRAY_LEN = 3
const INDEX_NOT_FOUND = -1
const EMPTY_MBID = ''
@Injectable()
export class TopArtists {
  constructor(
    private readonly lastFmImplementation: LastFmImplementation,
    private readonly musicBrainzImplementation: MusicBrainzImplementation,
    private readonly fanArtImplementation: FanArtImplementation
  ) {}

  async getTopArtists(): Promise<Artist[]> {
    const res = await this.lastFmImplementation.getTopArtists(LAST_FM_USER)
    shuffleByReference(res)
    const slicedArr = res.slice(START_ARRAY, ARRAY_LEN)

    const artistsWithoutMBID = await this.findMBIDForArtistsWithoutIt(slicedArr)
    const artistsWithMBID = this.addMBIDToArtistsArray(slicedArr, artistsWithoutMBID)
    const artistsWithMBIDAndImages = await this.getArtistsImage(artistsWithMBID)

    return artistsWithMBIDAndImages
  }

  private async findMBIDForArtistsWithoutIt(artistsArr: Artist[]): Promise<ArtistMusicBrainz[]> {
    const artistsWithoutMBID = artistsArr.filter(artist => artist.mbid === '')
    const aristsNames = artistsWithoutMBID.map(artist => artist.name)
    const arrOfArtistsWithMBID = await this.musicBrainzImplementation.getMBIDFromArtists(aristsNames)

    return arrOfArtistsWithMBID
  }

  private addMBIDToArtistsArray(artistsArr: Artist[], musicBrainzArr: ArtistMusicBrainz[]): Artist[] {
    return artistsArr.map(artist => {
      if (artist.mbid !== EMPTY_MBID) {
        return artist
      }

      const index = musicBrainzArr.findIndex(musicBrainzArtist => artist.name === musicBrainzArtist.name)

      if (index === INDEX_NOT_FOUND) {
        return artist
      }

      const { mbid } = musicBrainzArr[index]
      return { ...artist, mbid }
    })
  }

  private async getArtistsImage(artistsArr: Artist[]): Promise<Artist[]> {
    const artistsWithMBID = artistsArr.filter(artist => artist.mbid !== EMPTY_MBID)
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
        return artist
      }

      const { image } = fanArtImagesArr[index]
      return { ...artist, image }
    })
  }
}
