import { LastFmArtist } from '@infrastructure/service/artist/lastFm/types'
import * as faker from 'faker'

export const generateLastFmArtistWithMBID = (): LastFmArtist => {
  return {
    image: 'invalid',
    mbid: faker.datatype.uuid(),
    name: faker.name.findName(),
    playcount: faker.datatype.number()
  }
}
