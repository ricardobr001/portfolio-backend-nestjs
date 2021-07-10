import { Artist } from '@domain/entity/artist'
import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { TopArtists } from '@useCase/topArtists'

@Controller('v1/artist')
export class ArtistsController {
  constructor(private readonly topArtistsUseCase: TopArtists) {}

  @Get()
  @ApiOperation({
    summary: 'Get 15 top artists from the user'
  })
  @ApiOkResponse({ type: [Artist] })
  async getTopArtists(): Promise<Artist[]> {
    return this.topArtistsUseCase.getTopArtists()
  }
}
