import { notion } from './notion'

export async function addRecommendation(city: string, country: string, reason: string, name: string) {
  const dbId = process.env.NOTION_RECOMMENDATIONS_DB_ID
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
