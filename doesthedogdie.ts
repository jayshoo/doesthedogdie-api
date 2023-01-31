const DOESTHEDOGDIE_APIKEY: string = Deno.env.get('DOESTHEDOGDIE_APIKEY')!

interface Media {
  id: number
  name: string
  releaseYear: string
  itemType: { id: number, name: string }
  genre: string
  numRatings: number
  updatedAt: string // but really timestamp 2021-10-19T23:12:14.000Z
}

interface Topic {
  id: number
  /** @example a plane crashes */
  name: string
  /** @example no plane crashes */
  notName: string
  /** @example Does a plane crash */
  doesName: string
  /** @example where a plane crashes */
  listName: string
  /** @example planes crashing */
  smmwDescription: string 
  description?: string
  keywords?: string
  isSpoiler: boolean
  isSensitive: boolean
  isVisible: boolean
}

interface TopicItem {
  topic: Topic
  // isYes: number - removed sometime before 2023-01-31
  yesSum: number
  noSum: number
  comment?: string // Someone can get shot in the head through the eye. Guns are used to shoot at monsters.
}

interface MediaStats {
  item: Media
  topicItemStats: TopicItem[]
}

export async function search(query: string): Promise<Media[]> {
  let url = new URL('https://www.doesthedogdie.com/dddsearch')
  url.searchParams.set('q', query)
  
  let result = await fetch(url, {
    headers: {
      'accept': 'application/json',
      'X-API-KEY': DOESTHEDOGDIE_APIKEY
    }
  })

  return result.json().then(a => a.items)
}

export async function detail(id: string | number): Promise<MediaStats> {
  let url = new URL(`https://www.doesthedogdie.com/media/${id}`)
  
  let result = await fetch(url, {
    headers: {
      'accept': 'application/json',
      'X-API-KEY': DOESTHEDOGDIE_APIKEY
    }
  })

  return result.json()
}

