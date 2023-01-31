import { search, detail } from './doesthedogdie.ts'

async function ddd(query: string): Promise<Response> {
  let searchResult = await search(query)
  if (!searchResult)
    return new Response(`Couldn't find ${query}. Soz`)

  let videogameResult = searchResult.find(a => a.itemType.name == 'Video Game')
  if (!videogameResult)
    return new Response(`Couldn't find ${query}. Soz`)
  
  let details = await detail(videogameResult.id)
  if (!details)
    return new Response(`Couldn't load DDD for ${videogameResult.name} {id=${videogameResult.id}}. Soz`)

  let dogDetails = details.topicItemStats.find(a => a.topic.name == 'a dog dies')
  if (!dogDetails)
    return new Response(`DDD had no dog-related info for ${videogameResult.name} {id=${videogameResult.id}}`)
  
  let gameTitle = details.item.name;
  if (!details.item.releaseYear.toLowerCase().startsWith("unknown")) {
    gameTitle = gameTitle + ` (${details.item.releaseYear})`
  }
  let score = `${dogDetails.yesSum}yes ${dogDetails.noSum}no`;
  
  if (dogDetails.yesSum > dogDetails.noSum) {
    return new Response(`Sorry... ${dogDetails.topic.name} in ${gameTitle}. ${score}`)
  } else if (dogDetails.noSum > dogDetails.yesSum) {
    return new Response(`Phew... ${dogDetails.topic.notName} in ${gameTitle}. ${score}`)
  } else {
    return new Response(`Consensus is divided ${score} on whether ${dogDetails.topic.name} in ${gameTitle}.`)
  }
}

addEventListener('fetch', event => {
  let path = decodeURIComponent(new URL(event.request.url).pathname.slice(1))
  if (path.startsWith('favicon.ico')) return event.respondWith(new Response('', { status: 404 }))
  
  console.log('fetch listener:', path)
  event.respondWith(ddd(path))
})
