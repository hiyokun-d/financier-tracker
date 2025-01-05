import React, { useState } from 'react';
import { Header } from './components/Header';
import { TransactionForm } from './components/TransactionForm';
import { BudgetStatus } from './components/BudgetStatus';

const FinanceTracker = () => {
  const [state, setState] = useState({
    transactions: [
      { amount: 100000, description: 'Groceries', category: 'food', date: new Date().toISOString() },
      { amount: 50000, description: 'Rent', category: 'housing', date: new Date().toISOString() },
      { amount: 2000, description: 'Internet Bill', category: 'utilities', date: new Date().toISOString() },
      { amount: 1500, description: 'Dinner', category: 'food', date: new Date().toISOString() },
      { amount: 3000, description: 'Movie Tickets', category: 'entertainment', date: new Date().toISOString() },
      { amount: 10000, description: 'Shopping', category: 'miscellaneous', date: new Date().toISOString() }
    ],
    amount: '',
    description: '',
    category: '',
    monthlyBudget: 15000000,
    notificationsOn: true,
    showConfetti: false,
  });

  const addTransaction = () => {
    if (!state.amount || !state.description || !state.category) return;
    console.log("hello world!")
    const newTransaction = {
      id: Date.now(),
      amount: parseFloat(state.amount),
      description: state.description,
      category: state.category,
      date: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction],
      amount: '',
      description: '',
      category: '',
      showConfetti: prev.transactions.length % 5 === 0,
    }));

    if (state.transactions.length % 5 === 0) {
      setTimeout(() => setState(prev => ({ ...prev, showConfetti: false })), 3000);
    }
  };

  const getCategoryData = () => {
    const data = {};
    state.transactions.forEach(t => {
      data[t.category] = (data[t.category] || 0) + t.amount;
    });
    return Object.entries(categories).map(([key, cat]) => ({
      name: cat.label,
      value: data[key] || 0,
      color: cat.color
    }));
  };

  const getSpendingData = () => {
    const data = {};
    state.transactions.forEach(t => {
      const date = new Date(t.date).toLocaleDateString();
      data[date] = (data[date] || 0) + t.amount;
    });
    return Object.entries(data).map(([date, amount]) => ({ date, amount }));
  };

  const totalSpent = state.transactions.reduce((sum, t) => sum + t.amount, 0);
  const remaining = state.monthlyBudget - totalSpent;

  return (
    <div className="from-blue-950 to-blue-600 max-w-4xl mx-auto  space-y-6">
      <Header notificationsOn={state.notificationsOn} setNotificationsOn={() => setState(prev => ({ ...prev, notificationsOn: !prev.notificationsOn }))} />
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BudgetStatus totalSpent={totalSpent} remaining={remaining} monthlyBudget={state.monthlyBudget} />
      </div> */}

      <TransactionForm
        amount={state.amount}
        description={state.description}
        category={state.category}
        setAmount={(amount) => setState(prev => ({ ...prev, amount }))}
        setDescription={(description) => setState(prev => ({ ...prev, description }))}
        setCategory={(category) => setState(prev => ({ ...prev, category }))}
        addTransaction={addTransaction}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BudgetStatus totalSpent={totalSpent} remaining={remaining} monthlyBudget={state.monthlyBudget} />
        {/* <SpendingByCategory getCategoryData={getCategoryData} /> */}
      </div>
    </div>
  );
};

export default FinanceTracker;