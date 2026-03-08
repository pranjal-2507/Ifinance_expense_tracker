import React from 'react'
import { Progress } from 'antd';
import { useScrollReveal, getRevealClass } from '../hooks/useScrollReveal';

function Analytics({ transactions }) {
  const headerRef = useScrollReveal({ threshold: 0.1 });
  const transRef = useScrollReveal({ threshold: 0.15 });
  const turnoverRef = useScrollReveal({ threshold: 0.15 });

  // Total Transactions
  const totalTransaction = transactions.length
  const totalIncomeTransaction = transactions.filter(transaction => transaction.type === 'income')
  const totalExpenseTransaction = transactions.filter(transaction => transaction.type === 'expense')

  const totalIncomePercent = Math.round((totalIncomeTransaction.length / totalTransaction) * 100)
  const totalExpensePercent = Math.round((totalExpenseTransaction.length / totalTransaction) * 100)


  // Total turnover
  const totalTurnover = transactions.reduce((acc, transaction) => parseInt(acc) + parseInt(transaction.amount), 0)

  const totalIncomeTurnover = transactions.filter(transaction => transaction.type === "income").reduce((acc, transaction) => acc + transaction.amount, 0)

  const totalExpenseTurnover = transactions.filter(transaction => transaction.type === "expense").reduce((acc, transaction) => acc + transaction.amount, 0)

  const totalIncTurnoverPercent = Math.round((totalIncomeTurnover / totalTurnover) * 100)
  const totalExpenseTurnoverPercent = Math.round((totalExpenseTurnover / totalTurnover) * 100)



  return (
    <div className="px-4 py-12 md:py-16 space-y-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <div
        ref={headerRef.ref}
        className={`text-center md:text-left mb-8 ${getRevealClass(headerRef.isVisible, 'up')}`}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Visual Analytics</h2>
        <p className="text-gray-600">Deep dive into your spending habits and financial trends.</p>
      </div>

      {/* Total Transactions Section */}
      <div
        ref={transRef.ref}
        className={`bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-8 shadow-lg border border-primary-100 glow-card ${getRevealClass(transRef.isVisible, 'up')}`}
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Total Transactions: <span className="text-primary-600 counter-text">{totalTransaction}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md hover-lift transition-all duration-300">
            <h3 className="text-lg font-semibold text-emerald-600 mb-2">
              Income: {totalIncomeTransaction.length}
            </h3>
            <p className="text-sm text-gray-600">
              {totalIncomePercent}% of total transactions
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover-lift transition-all duration-300">
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              Expense: {totalExpenseTransaction.length}
            </h3>
            <p className="text-sm text-gray-600">
              {totalExpensePercent}% of total transactions
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex flex-col items-center">
            <Progress
              type='circle'
              strokeColor='#10b981'
              percent={totalIncomePercent}
              size={150}
              strokeWidth={8}
            />
            <p className="mt-4 text-sm font-semibold text-gray-700">Income Transactions</p>
          </div>

          <div className="flex flex-col items-center">
            <Progress
              type='circle'
              strokeColor='#ef4444'
              percent={totalExpensePercent}
              size={150}
              strokeWidth={8}
            />
            <p className="mt-4 text-sm font-semibold text-gray-700">Expense Transactions</p>
          </div>
        </div>
      </div>

      {/* Total Turnover Section */}
      <div
        ref={turnoverRef.ref}
        className={`bg-gradient-to-br from-secondary-50 to-teal-50 rounded-2xl p-8 shadow-lg border border-secondary-100 glow-card ${getRevealClass(turnoverRef.isVisible, 'up')}`}
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Total Turnover: <span className="text-secondary-600 counter-text">₹{totalTurnover}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md hover-lift transition-all duration-300">
            <h3 className="text-lg font-semibold text-emerald-600 mb-2">
              Income: ₹{totalIncomeTurnover}
            </h3>
            <p className="text-sm text-gray-600">
              {totalIncTurnoverPercent}% of total turnover
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover-lift transition-all duration-300">
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              Expense: ₹{totalExpenseTurnover}
            </h3>
            <p className="text-sm text-gray-600">
              {totalExpenseTurnoverPercent}% of total turnover
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex flex-col items-center">
            <Progress
              type='circle'
              strokeColor='#10b981'
              percent={totalIncTurnoverPercent}
              size={150}
              strokeWidth={8}
            />
            <p className="mt-4 text-sm font-semibold text-gray-700">Income Turnover</p>
          </div>

          <div className="flex flex-col items-center">
            <Progress
              type='circle'
              strokeColor='#ef4444'
              percent={totalExpenseTurnoverPercent}
              size={150}
              strokeWidth={8}
            />
            <p className="mt-4 text-sm font-semibold text-gray-700">Expense Turnover</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
