import { LastFmImplementation } from '@infrastructure/service/artist/lastFm/LastFmImplementation'
import { LastFmArtist } from '@infrastructure/service/artist/lastFm/types'
import { TopArtistsUseCase } from './topArtistsUseCase'
import { generateLastFmArtistWithMBID } from '@utilsTest/generateLastFmArtistWithMBID'
import { FindArtistsMBIDUseCase } from '@useCase/findArtistsMBID/findArtistsMBIDUseCase'
import { FindImageUseCase } from '@useCase/findImage/findImageUseCase'
import { MusicBrainzImplementation } from '@infrastructure/service/artist/musicBrainz/musicBrainzImplementation'
import { FanArtImplementation } from '@infrastructure/service/artist/fanArt/fanArtImplementation'

describe('useCase-topArtist', () => {
  const musicBrainzImplementation = new MusicBrainzImplementation()
  const fanArtImplementation = new FanArtImplementation()

  const lastFmImplementation = new LastFmImplementation()
  const findArtistsMBIDUseCase = new FindArtistsMBIDUseCase(musicBrainzImplementation)
  const findImageUseCase = new FindImageUseCase(fanArtImplementation)

  const topArtistUseCase = new TopArtistsUseCase(lastFmImplementation, findArtistsMBIDUseCase, findImageUseCase)

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getTopArtists', () => {
    it('should call the logics to recover mbid and image of artists', async () => {
      const lastReturnValue: LastFmArtist[] = [generateLastFmArtistWithMBID()]
      const shouldReturn: LastFmArtist[] = [{ ...lastReturnValue[0] }]

      lastFmImplementation.getTopArtists = jest.fn().mockResolvedValue(lastReturnValue)
      findArtistsMBIDUseCase.findMBIDForArtistsWithoutIt = jest.fn().mockResolvedValue(lastReturnValue)
      findImageUseCase.getArtistsImage = jest.fn().mockResolvedValue(lastReturnValue)

      const returned = await topArtistUseCase.getTopArtists()

      expect(lastFmImplementation.getTopArtists).toHaveBeenCalledWith('ricardobr001')
      expect(findArtistsMBIDUseCase.findMBIDForArtistsWithoutIt).toHaveBeenCalledTimes(1)
      expect(findArtistsMBIDUseCase.findMBIDForArtistsWithoutIt).toHaveBeenCalledWith(lastReturnValue)
      expect(findImageUseCase.getArtistsImage).toHaveBeenCalledTimes(1)
      expect(findImageUseCase.getArtistsImage).toHaveBeenCalledWith(lastReturnValue)
      expect(returned).toEqual(shouldReturn)
    })
  })
})
