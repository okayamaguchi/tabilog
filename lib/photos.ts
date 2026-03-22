import { notion } from './notion'

export type PhotoItem = {
  id: string
  title: string
  city: string
  photo: string
  note: string
  date: string
}

export async function getPhotoGallery(): Promise<PhotoItem[]> {
  const dsId = process.env.NOTION_PHOTO_DB_ID
  if (!dsId) return []

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion.dataSources as any).query({
      data_source_id: dsId,
      sorts: [{ property: 'Date', direction: 'descending' }],
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response.results ?? []).flatMap((page: any) => {
      if (page.object !== 'page') return []
      const props = page.properties as Record<string, any>
      const title = props['Title']?.title?.[0]?.plain_text ?? ''
      if (!title) return []
      const files = props['Photo']?.files ?? []
      const photo = files[0]?.file?.url ?? files[0]?.external?.url ?? ''
      if (!photo) return []
      return [{
        id: page.id,
        title,
        city: props['City']?.rich_text?.[0]?.plain_text ?? '',
        photo,
        note: props['Note']?.rich_text?.[0]?.plain_text ?? '',
        date: props['Date']?.date?.start ?? '',
      } satisfies PhotoItem]
    })
  } catch {
    return []
  }
}
