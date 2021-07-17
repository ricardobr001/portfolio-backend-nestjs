import { LastFmArtist } from '@infrastructure/service/artist/lastFm/types'
import * as faker from 'faker'

export const generateLastFmArtistWithoutMBID = (): LastFmArtist => {
  return {
    image: 'invalid',
    mbid: '',
    name: faker.name.findName(),
    playcount: faker.datatype.number()
  }
}
