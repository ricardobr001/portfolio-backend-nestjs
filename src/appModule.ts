import { ArtistsController } from '@controller/artistsController'
import { MusicBrainzImplementation } from '@infrastructure/service/artist/musicBrainz/musicBrainzImplementation'
import { Module } from '@nestjs/common'
import { TopArtistsUseCase } from '@useCase/topArtists/topArtistsUseCase'
import { LastFmImplementation } from '@infrastructure/service/artist/lastFm/LastFmImplementation'
import { FanArtImplementation } from '@infrastructure/service/artist/fanArt/fanArtImplementation'
import { FindArtistsMBIDUseCase } from '@useCase/findArtistsMBID/findArtistsMBIDUseCase'
import { FindImageUseCase } from '@useCase/findImage/findImageUseCase'

@Module({
  imports: [],
  controllers: [ArtistsController],
  providers: [
    TopArtistsUseCase,
    FindArtistsMBIDUseCase,
    FindImageUseCase,
    LastFmImplementation,
    MusicBrainzImplementation,
    FanArtImplementation
  ]
})
export class AppModule {}
