import { Artist } from '@domain/entity/artist'
import { FindImageUseCase } from './findImageUseCase'
import { FanArtImplementation } from '@infrastructure/service/artist/fanArt/fanArtImplementation'
import { generateLastFmArtistWithoutMBID } from '@utilsTest/generateLastFmArtistWithoutMBID'
import { generateLastFmArtistWithMBID } from '@utilsTest/generateLastFmArtistWithMBID'
import { FanArtImage } from '@infrastructure/service/artist/fanArt/types'
import * as faker from 'faker'

describe('useCase-findImageUseCase', () => {
  const fanArtImplementation = new FanArtImplementation()
  const findImageUseCase = new FindImageUseCase(fanArtImplementation)

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getArtistsImage', () => {
    it("should return image not found when artists don't have mbid", async () => {
      const artistArr: Artist[] = [generateLastFmArtistWithoutMBID()]
      const shouldReturn: Artist[] = [{ ...artistArr[0], image: 'assets/img/rockbandnotfound.png' }]

      fanArtImplementation.getArtistImage = jest.fn().mockResolvedValue([])

      const returned = await findImageUseCase.getArtistsImage(artistArr)

      expect(fanArtImplementation.getArtistImage).toHaveBeenCalledTimes(0)
      expect(returned).toEqual(shouldReturn)
    })
  })

  it('should return artist with image when mbid of the service is equal to artist mbid', async () => {
    const artistArr: Artist[] = [generateLastFmArtistWithMBID()]
    const fanArtImages: FanArtImage[] = [
      {
        mbid: artistArr[0].mbid,
        image: faker.image.imageUrl()
      }
    ]
    const shouldReturn: Artist[] = [{ ...artistArr[0], image: fanArtImages[0].image }]

    fanArtImplementation.getArtistImage = jest.fn().mockResolvedValue(fanArtImages)

    const returned = await findImageUseCase.getArtistsImage(artistArr)

    expect(fanArtImplementation.getArtistImage).toHaveBeenCalledTimes(1)
    expect(fanArtImplementation.getArtistImage).toHaveBeenCalledWith([artistArr[0].mbid])
    expect(returned).toEqual(shouldReturn)
  })

  it('should return artist with image not found when mbid of the service is different to artist mbid', async () => {
    const imageNotFound = 'assets/img/rockbandnotfound.png'
    const artistArr: Artist[] = [generateLastFmArtistWithMBID()]
    const fanArtImages: FanArtImage[] = [
      {
        mbid: faker.datatype.uuid(),
        image: faker.image.imageUrl()
      }
    ]
    const shouldReturn: Artist[] = [{ ...artistArr[0], image: imageNotFound }]

    fanArtImplementation.getArtistImage = jest.fn().mockResolvedValue(fanArtImages)

    const returned = await findImageUseCase.getArtistsImage(artistArr)

    expect(fanArtImplementation.getArtistImage).toHaveBeenCalledTimes(1)
    expect(fanArtImplementation.getArtistImage).toHaveBeenCalledWith([artistArr[0].mbid])
    expect(returned).toEqual(shouldReturn)
  })

  it('should return artist with image not found when mbid of it is empty and another artist have mbid', async () => {
    const imageNotFound = 'assets/img/rockbandnotfound.png'
    const artistArr: Artist[] = [generateLastFmArtistWithMBID(), generateLastFmArtistWithoutMBID()]
    const fanArtImages: FanArtImage[] = [
      {
        mbid: artistArr[0].mbid,
        image: faker.image.imageUrl()
      }
    ]
    const shouldReturn: Artist[] = [
      { ...artistArr[0], image: fanArtImages[0].image },
      { ...artistArr[1], image: imageNotFound }
    ]

    fanArtImplementation.getArtistImage = jest.fn().mockResolvedValue(fanArtImages)

    const returned = await findImageUseCase.getArtistsImage(artistArr)

    expect(fanArtImplementation.getArtistImage).toHaveBeenCalledTimes(1)
    expect(fanArtImplementation.getArtistImage).toHaveBeenCalledWith([artistArr[0].mbid])
    expect(returned).toEqual(shouldReturn)
  })
})
