import { FanArtImplementation } from '@infrastructure/service/artist/fanArt/fanArtImplementation'
import { LastFmImplementation } from '@infrastructure/service/artist/lastFm/LastFmImplementation'
import { LastFmArtist } from '@infrastructure/service/artist/lastFm/types'
import { MusicBrainzImplementation } from '@infrastructure/service/artist/musicBrainz/musicBrainzImplementation'
import { TopArtists } from './topArtists'
import { FanArtImage } from '@infrastructure/service/artist/fanArt/types'
import { generateLastFmArtistWithMBID } from '@utilsTest/generateLastFmArtistWithMBID'
import { generateLastFmArtistWithoutMBID } from '@utilsTest/generateLastFmArtistWithoutMBID'
import { ArtistMusicBrainz } from '@infrastructure/service/artist/musicBrainz/types'
import * as faker from 'faker'

describe('useCase-topArtist', () => {
  const lastFmImplementation = new LastFmImplementation()
  const musicBrainzImplementation = new MusicBrainzImplementation()
  const fanArtImplementation = new FanArtImplementation()
  const topArtist = new TopArtists(lastFmImplementation, musicBrainzImplementation, fanArtImplementation)

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getTopArtists', () => {
    it("shouldn't get mbid when isn't necessary but should get image", async () => {
      const lastReturnValue: LastFmArtist[] = [generateLastFmArtistWithMBID()]
      const imageUrl = faker.image.imageUrl()
      const fanArtImage: FanArtImage[] = [
        {
          mbid: lastReturnValue[0].mbid,
          image: imageUrl
        }
      ]
      const shouldReturn: LastFmArtist[] = [{ ...lastReturnValue[0], image: imageUrl }]

      lastFmImplementation.getTopArtists = jest.fn().mockResolvedValue(lastReturnValue)
      musicBrainzImplementation.getMBIDFromArtists = jest.fn().mockResolvedValue([])
      fanArtImplementation.getArtistImage = jest.fn().mockResolvedValue(fanArtImage)

      const returned = await topArtist.getTopArtists()

      expect(lastFmImplementation.getTopArtists).toHaveBeenCalledWith('ricardobr001')
      expect(musicBrainzImplementation.getMBIDFromArtists).toHaveBeenCalledWith([])
      expect(fanArtImplementation.getArtistImage).toHaveBeenCalledWith([lastReturnValue[0].mbid])

      expect(returned).toEqual(shouldReturn)
    })

    it('should get mbid when is necessary and also get the image', async () => {
      const lastReturnValue: LastFmArtist[] = [generateLastFmArtistWithoutMBID()]
      const imageUrl = faker.image.imageUrl()
      const mbidMusicBrainzReturned = faker.datatype.uuid()

      const artistMusicBrainz: ArtistMusicBrainz[] = [
        {
          mbid: mbidMusicBrainzReturned,
          name: lastReturnValue[0].name
        }
      ]

      const fanArtImage: FanArtImage[] = [
        {
          mbid: artistMusicBrainz[0].mbid,
          image: imageUrl
        }
      ]
      const shouldReturn: LastFmArtist[] = [{ ...lastReturnValue[0], image: imageUrl, mbid: mbidMusicBrainzReturned }]

      lastFmImplementation.getTopArtists = jest.fn().mockResolvedValue(lastReturnValue)
      musicBrainzImplementation.getMBIDFromArtists = jest.fn().mockResolvedValue(artistMusicBrainz)
      fanArtImplementation.getArtistImage = jest.fn().mockResolvedValue(fanArtImage)

      const returned = await topArtist.getTopArtists()

      expect(lastFmImplementation.getTopArtists).toHaveBeenCalledWith('ricardobr001')
      expect(musicBrainzImplementation.getMBIDFromArtists).toHaveBeenCalledWith([lastReturnValue[0].name])
      expect(fanArtImplementation.getArtistImage).toHaveBeenCalledWith([mbidMusicBrainzReturned])

      expect(returned).toEqual(shouldReturn)
    })

    it("should return image not found when mbid isn't founded", async () => {
      const lastReturnValue: LastFmArtist[] = [generateLastFmArtistWithoutMBID()]
      const imageUrl = 'assets/img/rockbandnotfound.png'
      const mbidMusicBrainzReturned = ''

      const artistMusicBrainz: ArtistMusicBrainz[] = [
        {
          mbid: mbidMusicBrainzReturned,
          name: lastReturnValue[0].name
        }
      ]

      const fanArtImage: FanArtImage[] = [
        {
          mbid: artistMusicBrainz[0].mbid,
          image: imageUrl
        }
      ]
      const shouldReturn: LastFmArtist[] = [{ ...lastReturnValue[0], image: imageUrl, mbid: mbidMusicBrainzReturned }]

      lastFmImplementation.getTopArtists = jest.fn().mockResolvedValue(lastReturnValue)
      musicBrainzImplementation.getMBIDFromArtists = jest.fn().mockResolvedValue(artistMusicBrainz)
      fanArtImplementation.getArtistImage = jest.fn().mockResolvedValue(fanArtImage)

      const returned = await topArtist.getTopArtists()

      expect(lastFmImplementation.getTopArtists).toHaveBeenCalledWith('ricardobr001')
      expect(musicBrainzImplementation.getMBIDFromArtists).toHaveBeenCalledWith([lastReturnValue[0].name])
      expect(fanArtImplementation.getArtistImage).toHaveBeenCalledWith([])

      expect(returned).toEqual(shouldReturn)
    })

    it('should return image not found when mbid founded is from a different artist', async () => {
      const lastReturnValue: LastFmArtist[] = [generateLastFmArtistWithoutMBID()]
      const imageUrl = 'assets/img/rockbandnotfound.png'

      const artistMusicBrainz: ArtistMusicBrainz[] = [
        {
          mbid: faker.datatype.uuid(),
          name: faker.name.findName()
        }
      ]

      const fanArtImage: FanArtImage[] = [
        {
          mbid: lastReturnValue[0].mbid,
          image: imageUrl
        }
      ]
      const shouldReturn: LastFmArtist[] = [{ ...lastReturnValue[0], image: imageUrl }]

      lastFmImplementation.getTopArtists = jest.fn().mockResolvedValue(lastReturnValue)
      musicBrainzImplementation.getMBIDFromArtists = jest.fn().mockResolvedValue(artistMusicBrainz)
      fanArtImplementation.getArtistImage = jest.fn().mockResolvedValue(fanArtImage)

      const returned = await topArtist.getTopArtists()

      expect(lastFmImplementation.getTopArtists).toHaveBeenCalledWith('ricardobr001')
      expect(musicBrainzImplementation.getMBIDFromArtists).toHaveBeenCalledWith([lastReturnValue[0].name])
      expect(fanArtImplementation.getArtistImage).toHaveBeenCalledWith([])

      expect(returned).toEqual(shouldReturn)
    })

    it("should return image not found when mbid exists but image isn't founded", async () => {
      const lastReturnValue: LastFmArtist[] = [generateLastFmArtistWithMBID()]
      const imageUrl = 'assets/img/rockbandnotfound.png'

      const fanArtImage: FanArtImage[] = [
        {
          mbid: faker.datatype.uuid(),
          image: imageUrl
        }
      ]
      const shouldReturn: LastFmArtist[] = [{ ...lastReturnValue[0], image: imageUrl }]

      lastFmImplementation.getTopArtists = jest.fn().mockResolvedValue(lastReturnValue)
      musicBrainzImplementation.getMBIDFromArtists = jest.fn().mockResolvedValue([])
      fanArtImplementation.getArtistImage = jest.fn().mockResolvedValue(fanArtImage)

      const returned = await topArtist.getTopArtists()

      expect(lastFmImplementation.getTopArtists).toHaveBeenCalledWith('ricardobr001')
      expect(musicBrainzImplementation.getMBIDFromArtists).toHaveBeenCalledWith([])
      expect(fanArtImplementation.getArtistImage).toHaveBeenCalledWith([lastReturnValue[0].mbid])

      expect(returned).toEqual(shouldReturn)
    })

    it("should return image not found when mbid is founded but image isn't founded", async () => {
      const lastReturnValue: LastFmArtist[] = [generateLastFmArtistWithoutMBID()]
      const imageUrl = 'assets/img/rockbandnotfound.png'
      const mbidMusicBrainzReturned = faker.datatype.uuid()

      const artistMusicBrainz: ArtistMusicBrainz[] = [
        {
          mbid: mbidMusicBrainzReturned,
          name: lastReturnValue[0].name
        }
      ]

      const fanArtImage: FanArtImage[] = [
        {
          mbid: faker.datatype.uuid(),
          image: imageUrl
        }
      ]
      const shouldReturn: LastFmArtist[] = [{ ...lastReturnValue[0], image: imageUrl, mbid: mbidMusicBrainzReturned }]

      lastFmImplementation.getTopArtists = jest.fn().mockResolvedValue(lastReturnValue)
      musicBrainzImplementation.getMBIDFromArtists = jest.fn().mockResolvedValue(artistMusicBrainz)
      fanArtImplementation.getArtistImage = jest.fn().mockResolvedValue(fanArtImage)

      const returned = await topArtist.getTopArtists()

      expect(lastFmImplementation.getTopArtists).toHaveBeenCalledWith('ricardobr001')
      expect(musicBrainzImplementation.getMBIDFromArtists).toHaveBeenCalledWith([lastReturnValue[0].name])
      expect(fanArtImplementation.getArtistImage).toHaveBeenCalledWith([mbidMusicBrainzReturned])

      expect(returned).toEqual(shouldReturn)
    })
  })
})
