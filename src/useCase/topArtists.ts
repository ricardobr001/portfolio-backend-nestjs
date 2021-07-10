import { LAST_FM_USER } from '@core/constants'
import { Artist } from '@domain/entity/artist'
import { ArtistServiceImplementation } from '@infrastructure/service/artistServiceImplementation'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TopArtists {
  constructor(private readonly artistService: ArtistServiceImplementation) {}

  getTopArtists(): Promise<Artist[]> {
    return this.artistService.getTopArtists(LAST_FM_USER)
  }
}
