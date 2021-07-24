import { Artist } from '@domain/entity/artist'
import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { TopArtistsUseCase } from '@useCase/topArtists/topArtistsUseCase'

@Controller('v1/artist')
export class ArtistsController {
  constructor(private readonly topArtistsUseCase: TopArtistsUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Get 15 top artists from the user'
  })
  @ApiOkResponse({ type: [Artist] })
  async getTopArtists(): Promise<Artist[]> {
    return this.topArtistsUseCase.getTopArtists()
  }
}
