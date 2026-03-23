import Header from '../../components/Header'
import ExpensesPageContent from '../../components/ExpensesPageContent'
import { getExpenses } from '../../lib/expenses'

export default async function ExpensesPage() {
  const expenses = await getExpenses()

  return (
    <>
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Expense Details</h1>
      <ExpensesPageContent expenses={expenses} />
    </main>
    </>
  )
}
