import { notion } from './notion'

export interface Recommendation {
  city: string
  country: string
  name: string
  reason: string
  date: string
}

let cachedDataSourceId: string | null = null

async function resolveDataSourceId(idFromEnv: string): Promise<string> {
  if (cachedDataSourceId) return cachedDataSourceId
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = await (notion as any).databases.retrieve({ database_id: idFromEnv })
    const firstDs = db?.data_sources?.[0]?.id
    if (firstDs) {
      cachedDataSourceId = firstDs
      return firstDs
    }
  } catch {
    // fall through — assume the env var already holds a data source ID
  }
  cachedDataSourceId = idFromEnv
  return idFromEnv
}

export async function getRecommendations(): Promise<Recommendation[]> {
  const dbId = process.env.NOTION_RECOMMENDATIONS_DB_ID?.trim()
  if (!dbId) {
    console.error('NOTION_RECOMMENDATIONS_DB_ID is not set')
    return []
  }

  try {
    const dataSourceId = await resolveDataSourceId(dbId)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion.dataSources as any).query({
      data_source_id: dataSourceId,
      sorts: [
        {
          property: 'Submitted Date',
          direction: 'descending',
        },
      ],
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.results.map((page: any) => ({
      city: page.properties.City?.title?.[0]?.plain_text || '',
      country: page.properties.Country?.rich_text?.[0]?.plain_text || '',
      name: page.properties.Name?.rich_text?.[0]?.plain_text || '匿名',
      reason: page.properties.Reason?.rich_text?.[0]?.plain_text || '',
      date: page.properties['Submitted Date']?.date?.start || '',
    }))
  } catch (error) {
    console.error('Failed to fetch recommendations:', error)
    return []
  }
}

export async function addRecommendation(city: string, country: string, reason: string, name: string) {
  const dbId = process.env.NOTION_RECOMMENDATIONS_DB_ID?.trim()
  if (!dbId) throw new Error('NOTION_RECOMMENDATIONS_DB_ID is not set')

  const today = new Date().toISOString().split('T')[0]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (notion as any).pages.create({
    parent: { database_id: dbId },
    properties: {
      City: { title: [{ text: { content: city } }] },
      Country: { rich_text: [{ text: { content: country } }] },
      Reason: { rich_text: [{ text: { content: reason } }] },
      Name: { rich_text: [{ text: { content: name } }] },
      'Submitted Date': { date: { start: today } },
    },
  })
}
