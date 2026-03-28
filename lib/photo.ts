import { notion } from './notion'

export type PhotoItem = {
  id: string
  title: string
  src: string
  date?: string
  note?: string
}

export async function getPhotoGallery(): Promise<PhotoItem[]> {
  const dbId = process.env.NOTION_PHOTO_DB_ID
  if (!dbId) return []

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion.dataSources as any).query({
      data_source_id: dbId,
      sorts: [{ property: 'Date', direction: 'descending' }],
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response.results ?? []).flatMap((page: any) => {
      if (page.object !== 'page') return []
      const props = page.properties as Record<string, any>
      const files = props['Photo']?.files ?? []
      const photo = files[0]?.file?.url ?? files[0]?.external?.url ?? ''
      if (!photo) return []
      return [{
        id: page.id,
        title: props['Title']?.title?.[0]?.plain_text ?? '',
        src: photo,
        date: props['Date']?.date?.start ?? undefined,
        note: props['Note']?.rich_text?.[0]?.plain_text ?? undefined,
      }]
    })
  } catch (err) {
    console.error('Failed to fetch photo gallery:', err)
    return []
  }
}
