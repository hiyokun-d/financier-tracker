import React, { useState } from 'react';
import { Header } from './components/Header';
import { TransactionForm } from './components/TransactionForm';

const FinanceTracker = () => {
  const [state, setState] = useState({
    transactions: [],
    amount: '',
    description: '',
    category: '',
    monthlyBudget: 1000,
    notificationsOn: true,
    showConfetti: false,
  });

  const addTransaction = () => {
    if (!state.amount || !state.description || !state.category) return;

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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Header notificationsOn={state.notificationsOn} setNotificationsOn={() => setState(prev => ({ ...prev, notificationsOn: !prev.notificationsOn }))} />
      <TransactionForm
        amount={state.amount}
        description={state.description}
        category={state.category}
        setAmount={(amount) => setState(prev => ({ ...prev, amount }))}
        setDescription={(description) => setState(prev => ({ ...prev, description }))}
        setCategory={(category) => setState(prev => ({ ...prev, category }))}
        addTransaction={addTransaction}
      />

    </div>
  );
};

export default FinanceTracker;