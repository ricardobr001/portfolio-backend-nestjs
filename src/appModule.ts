import { ArtistsController } from '@controller/artistsController'
import { MusicBrainzImplementation } from '@infrastructure/service/artist/musicBrainz/musicBrainzImplementation'
import { Module } from '@nestjs/common'
import { TopArtists } from '@useCase/topArtists'
import { LastFmImplementation } from '@infrastructure/service/artist/lastFm/LastFmImplementation'
import { FanArtImplementation } from '@infrastructure/service/artist/fanArt/fanArtImplementation'

@Module({
  imports: [],
  controllers: [ArtistsController],
  providers: [TopArtists, LastFmImplementation, MusicBrainzImplementation, FanArtImplementation]
})
export class AppModule {}
