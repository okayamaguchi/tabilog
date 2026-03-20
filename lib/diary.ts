import { notion } from './notion'
import type { Post } from './posts'

export async function getDiaryPosts(): Promise<Post[]> {
  const dsId = process.env.NOTION_DIARY_DS_ID
  if (!dsId) return []

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion.dataSources as any).query({
      data_source_id: dsId,
      sorts: [{ property: '滞在開始日', direction: 'descending' }],
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response.results ?? []).flatMap((page: any) => {
      if (page.object !== 'page') return []
      const props = page.properties as Record<string, any>
      const city = props['都市名']?.title?.[0]?.plain_text ?? ''
      if (!city) return []
      const country = props['国名']?.rich_text?.[0]?.plain_text ?? ''
      const date = props['滞在開始日']?.date?.start ?? ''
      const body = props['メモ']?.rich_text?.map((r: any) => r.plain_text).join('') ?? ''
      const files = props['サムネイル写真']?.files ?? []
      const thumbnail = files[0]?.file?.url ?? files[0]?.external?.url ?? ''

      return [{
        id: page.id,
        title: city,
        date,
        location: country ? `${city}, ${country}` : city,
        thumbnail,
        body,
      } satisfies Post]
    })
  } catch {
    return []
  }
}
