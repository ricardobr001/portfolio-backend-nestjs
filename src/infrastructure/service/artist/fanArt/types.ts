export interface FanArtImage {
  mbid: string
  image: string
}

export interface FanArtEndpoint {
  mbid: string
  url: string
}

interface Background {
  url: string
}

export interface FanArtResponse {
  artistbackground: Background[]
}
