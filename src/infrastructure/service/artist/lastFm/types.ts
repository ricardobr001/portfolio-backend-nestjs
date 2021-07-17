interface Image {
  size: string
  '#text': string
}

interface ArtistAttributes {
  rank: string
}

interface Artist {
  '@attr': ArtistAttributes
  mbid: string
  url: string
  playcount: string
  image: Image[]
  name: string
  streamable: string
}

interface UserAttributes {
  page: string
  total: string
  user: string
  perPage: string
  totalPages: string
}

interface TopArtist {
  artist: Artist[]
  '@attr': UserAttributes
}

export interface LastFmTopArtistResponse {
  topartists: TopArtist
}

export interface LastFmArtist {
  mbid: string
  playcount: number
  name: string
  image: string
}
