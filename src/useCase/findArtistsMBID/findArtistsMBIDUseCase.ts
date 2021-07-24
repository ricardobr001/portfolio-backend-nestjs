import { EMPTY_MBID, INDEX_NOT_FOUND } from '@core/constants'
import { Artist } from '@domain/entity/artist'
import { MusicBrainzImplementation } from '@infrastructure/service/artist/musicBrainz/musicBrainzImplementation'
import { ArtistMusicBrainz } from '@infrastructure/service/artist/musicBrainz/types'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindArtistsMBIDUseCase {
  constructor(private readonly musicBrainzImplementation: MusicBrainzImplementation) {}

  public async findMBIDForArtistsWithoutIt(artistsArr: Artist[]): Promise<Artist[]> {
    const artistsWithoutMBID = artistsArr.filter(artist => artist.mbid === '')

    if (!artistsWithoutMBID.length) {
      return artistsArr
    }

    const artistsNames = artistsWithoutMBID.map(artist => artist.name)
    const arrOfArtistsWithMBID = await this.musicBrainzImplementation.getMBIDFromArtists(artistsNames)

    return this.addMBIDToArtistsArray(artistsArr, arrOfArtistsWithMBID)
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
}
