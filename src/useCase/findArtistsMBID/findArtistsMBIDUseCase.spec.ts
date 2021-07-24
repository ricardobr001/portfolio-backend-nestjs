import { Artist } from '@domain/entity/artist'
import { MusicBrainzImplementation } from '@infrastructure/service/artist/musicBrainz/musicBrainzImplementation'
import { generateLastFmArtistWithMBID } from '@utilsTest/generateLastFmArtistWithMBID'
import { FindArtistsMBIDUseCase } from './findArtistsMBIDUseCase'
import { generateLastFmArtistWithoutMBID } from '@utilsTest/generateLastFmArtistWithoutMBID'
import * as faker from 'faker'
import { ArtistMusicBrainz } from '@infrastructure/service/artist/musicBrainz/types'

describe('useCase-findArtistsMBIDUseCase', () => {
  const musicBrainzImplementation = new MusicBrainzImplementation()
  const findArtistsMBIDUseCase = new FindArtistsMBIDUseCase(musicBrainzImplementation)

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('findMBIDForArtistsWithoutIt', () => {
    it("shouldn't get mbid when artists already have mbid", async () => {
      const artistArr: Artist[] = [generateLastFmArtistWithMBID()]
      const shouldReturn: Artist[] = [{ ...artistArr[0] }]

      musicBrainzImplementation.getMBIDFromArtists = jest.fn().mockResolvedValue([])

      const returned = await findArtistsMBIDUseCase.findMBIDForArtistsWithoutIt(artistArr)

      expect(musicBrainzImplementation.getMBIDFromArtists).toHaveBeenCalledTimes(0)
      expect(returned).toEqual(shouldReturn)
    })

    it("should return artist with mbid when it's founded", async () => {
      const artistArr: Artist[] = [generateLastFmArtistWithoutMBID()]
      const mbidMusicBrainzReturned = faker.datatype.uuid()
      const musicBrainzReturnArr: ArtistMusicBrainz[] = [
        {
          mbid: mbidMusicBrainzReturned,
          name: artistArr[0].name
        }
      ]
      const shouldReturn: Artist[] = [{ ...artistArr[0], mbid: mbidMusicBrainzReturned }]

      musicBrainzImplementation.getMBIDFromArtists = jest.fn().mockResolvedValue(musicBrainzReturnArr)

      const returned = await findArtistsMBIDUseCase.findMBIDForArtistsWithoutIt(artistArr)

      expect(musicBrainzImplementation.getMBIDFromArtists).toHaveBeenCalledTimes(1)
      expect(musicBrainzImplementation.getMBIDFromArtists).toHaveBeenCalledWith([artistArr[0].name])
      expect(returned).toEqual(shouldReturn)
    })

    it("should return artist without mbid when it isn't founded", async () => {
      const artistArr: Artist[] = [generateLastFmArtistWithoutMBID()]
      const mbidMusicBrainzReturned = ''
      const musicBrainzReturnArr: ArtistMusicBrainz[] = [
        {
          mbid: mbidMusicBrainzReturned,
          name: artistArr[0].name
        }
      ]
      const shouldReturn: Artist[] = [{ ...artistArr[0] }]

      musicBrainzImplementation.getMBIDFromArtists = jest.fn().mockResolvedValue(musicBrainzReturnArr)

      const returned = await findArtistsMBIDUseCase.findMBIDForArtistsWithoutIt(artistArr)

      expect(musicBrainzImplementation.getMBIDFromArtists).toHaveBeenCalledTimes(1)
      expect(musicBrainzImplementation.getMBIDFromArtists).toHaveBeenCalledWith([artistArr[0].name])
      expect(returned).toEqual(shouldReturn)
    })

    it("should return the given artist when artist isn't founded", async () => {
      const artistArr: Artist[] = [generateLastFmArtistWithoutMBID()]
      const musicBrainzReturnArr: ArtistMusicBrainz[] = []
      const shouldReturn: Artist[] = [{ ...artistArr[0] }]

      musicBrainzImplementation.getMBIDFromArtists = jest.fn().mockResolvedValue(musicBrainzReturnArr)

      const returned = await findArtistsMBIDUseCase.findMBIDForArtistsWithoutIt(artistArr)

      expect(musicBrainzImplementation.getMBIDFromArtists).toHaveBeenCalledTimes(1)
      expect(musicBrainzImplementation.getMBIDFromArtists).toHaveBeenCalledWith([artistArr[0].name])
      expect(returned).toEqual(shouldReturn)
    })

    it("should return the given artist when already have mbid and another without mbid when it isn't founded", async () => {
      const artistArr: Artist[] = [generateLastFmArtistWithMBID(), generateLastFmArtistWithoutMBID()]
      const mbidMusicBrainzReturned = ''
      const musicBrainzReturnArr: ArtistMusicBrainz[] = [
        {
          mbid: mbidMusicBrainzReturned,
          name: artistArr[1].name
        }
      ]
      const shouldReturn: Artist[] = [{ ...artistArr[0] }, { ...artistArr[1] }]

      musicBrainzImplementation.getMBIDFromArtists = jest.fn().mockResolvedValue(musicBrainzReturnArr)

      const returned = await findArtistsMBIDUseCase.findMBIDForArtistsWithoutIt(artistArr)

      expect(musicBrainzImplementation.getMBIDFromArtists).toHaveBeenCalledTimes(1)
      expect(musicBrainzImplementation.getMBIDFromArtists).toHaveBeenCalledWith([artistArr[1].name])
      expect(returned).toEqual(shouldReturn)
    })
  })
})
