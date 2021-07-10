import { ArtistsController } from '@controller/artistsController'
import { ArtistServiceImplementation } from '@infrastructure/service/artistServiceImplementation'
import { Module } from '@nestjs/common'
import { TopArtists } from '@useCase/topArtists'

@Module({
  imports: [],
  controllers: [ArtistsController],
  providers: [TopArtists, ArtistServiceImplementation]
})
export class AppModule {}
