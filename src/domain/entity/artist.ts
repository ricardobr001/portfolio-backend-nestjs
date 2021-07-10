import { ApiProperty } from '@nestjs/swagger'

export class Artist {
  @ApiProperty({ example: '074e3847-f67f-49f9-81f1-8c8cea147e8e' })
  mbid: string

  @ApiProperty({ example: 5468 })
  playcount: number

  @ApiProperty({ example: 'Bring Me the Horizon' })
  name: string

  @ApiProperty({ example: 'https://lastfm.freetls.fastly.net/i/u/34s/2a96cbd8b46e442fc41c2b86b821562f.png' })
  image: string
}
