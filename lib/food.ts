import { notion } from './notion'

export type FoodItem = {
  id: string
  name: string
  dish: string
  amount: number
  photo: string
  date: string
  location: string
}

export async function getFoodGallery(): Promise<FoodItem[]> {
  const dsId = process.env.NOTION_FOOD_DS_ID
  if (!dsId) return []

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion.dataSources as any).query({
      data_source_id: dsId,
      sorts: [{ property: '日付', direction: 'descending' }],
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response.results ?? []).flatMap((page: any) => {
      if (page.object !== 'page') return []
      const props = page.properties as Record<string, any>
      const files = props['写真']?.files ?? []
      return [{
        id: page.id,
        name: props['店名']?.title?.[0]?.plain_text ?? '',
        dish: props['料理名']?.rich_text?.[0]?.plain_text ?? '',
        amount: props['金額']?.number ?? 0,
        photo: files[0]?.file?.url ?? files[0]?.external?.url ?? '',
        date: props['日付']?.date?.start ?? '',
        location: props['場所（都市名）']?.rich_text?.[0]?.plain_text ?? '',
      }]
    })
  } catch {
    return []
  }
}
