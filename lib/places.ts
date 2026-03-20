import { notion } from './notion'
import type { Visit } from './visits'

export async function getNotionPlaces(): Promise<Visit[]> {
  const dsId = process.env.NOTION_PLACES_DS_ID
  if (!dsId) return []

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion.dataSources as any).query({
      data_source_id: dsId,
      sorts: [{ property: '日付', direction: 'ascending' }],
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response.results ?? []).flatMap((page: any) => {
      if (page.object !== 'page') return []
      const props = page.properties as Record<string, any>
      const city = props['都市名']?.title?.[0]?.plain_text ?? ''
      const lat = props['緯度']?.number ?? 0
      const lng = props['経度']?.number ?? 0
      if (!city || !lat || !lng) return []

      return [{
        id: page.id,
        city,
        lat,
        lng,
        date: props['日付']?.date?.start ?? '',
      } satisfies Visit]
    })
  } catch {
    return []
  }
}
