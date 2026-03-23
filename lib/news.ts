import { notion } from './notion'

export type NewsItem = {
  id: string
  title: string
  date: string
}

export async function getNewsList(): Promise<NewsItem[]> {
  const dsId = process.env.NOTION_NEWS_DB_ID
  if (!dsId) return []

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion.dataSources as any).query({
      data_source_id: dsId,
      sorts: [{ property: 'Date', direction: 'descending' }],
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response.results ?? []).map((page: any) => {
      const props = page.properties as Record<string, any>
      return {
        id: page.id,
        title: props['Title']?.title?.[0]?.plain_text ?? '',
        date: props['Date']?.date?.start ?? '',
      }
    })
  } catch (err) {
    console.error('[news] Failed to fetch:', err)
    return []
  }
}

export async function addNews(title: string, date: string) {
  const dsId = process.env.NOTION_NEWS_DB_ID
  if (!dsId) throw new Error('NOTION_NEWS_DB_ID is not set')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (notion as any).pages.create({
    parent: { database_id: dsId },
    properties: {
      Title: { title: [{ text: { content: title } }] },
      Date: { date: { start: date } },
    },
  })
}
