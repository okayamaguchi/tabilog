import Link from 'next/link'
import ExpensesPageContent from '../../components/ExpensesPageContent'

export default function ExpensesPage() {
  return (
    <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
      <Link
        href="/"
        className="text-sm font-medium mb-6 inline-block"
        style={{ color: '#4a7c59' }}
      >
        ← TOPに戻る
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">費用詳細</h1>
      <ExpensesPageContent />
    </main>
  )
}
