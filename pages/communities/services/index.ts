// interface Comunidade {
//   id?: string
//   title: string
//   imageUrl: string
//   creatorSlug?: string
// }



export default class CommunitieAPI {

  constructor() { }

  async communitie(communitieName: string): Promise<any[]> {
    const com = communitieName.replaceAll("-", " ")
    const result = await fetch('/api/comunidade', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ communitieName: com })
    })
      .then(async (res) => {
        const dados = await res.json()
        return dados.comunidades
      })

    return result.map((item: any) => {
      const comunitie: any = {
        title: item.properties.title.title[0].plain_text ?? '',
        imageUrl: item.properties.image_url.rich_text[0].plain_text ?? '',
        creatorSlug: item.properties.creator_slug.rich_text[0].plain_text ?? ''
      }
      return comunitie
    })

  }
}