import { FanArtImplementation } from '@infrastructure/service/artist/fanArt/fanArtImplementation'
import { LastFmImplementation } from '@infrastructure/service/artist/lastFm/LastFmImplementation'
import { LastFmArtist } from '@infrastructure/service/artist/lastFm/types'
import { MusicBrainzImplementation } from '@infrastructure/service/artist/musicBrainz/musicBrainzImplementation'
import { TopArtists } from './topArtists'
import { FanArtImage } from '@infrastructure/service/artist/fanArt/types'
import { generateLastFmArtistWithMBID } from '@utilsTest/generateLastFmArtistWithMBID'
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
  })
})
