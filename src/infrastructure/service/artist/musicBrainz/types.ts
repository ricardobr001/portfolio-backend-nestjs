interface MusicBrainzArtist {
  id: string
  name: string
}

export interface MusicBrainzArtistResponse {
  created: string
  count: number
  offset: number
  artists: MusicBrainzArtist[]
}

export interface ArtistMusicBrainz {
  mbid: string
  name: string
}
