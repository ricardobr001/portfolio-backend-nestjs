import { Artist } from '@domain/entity/artist'

export abstract class artistServiceContract {
  abstract getTopArtists(username: string): Promise<Artist[]>
}
