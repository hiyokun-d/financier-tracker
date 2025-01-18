import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TransactionForm } from './components/TransactionForm';
import { BudgetStatus } from './components/BudgetStatus';
import { addCookie, saveState, updateState, loadState } from './functions/cookies';

// TODO: UPDATING THE SAVE TRANSACTION FUNCTION
// 1. we'll gonna save the transaction each we add new transaction
// 2. save the transaction to the local storage
// 3. load the transaction from the local storage
// 4. update the state with the loaded transaction
// 5. save the transaction each day to the local storage

// Load the cookie from local storage
const cookie = loadState();

const FinanceTracker = () => {
  const [state, setState] = useState({
    transactions: [],
    transactionsEachDay: [],
    amount: '',
    description: '',
    category: '',
    monthlyBudget: 1500000,
    notificationsOn: true,
    showConfetti: false,
  });

  // Load the saved state from cookie when the component mounts
  useEffect(() => {
    if (cookie) {
      console.log("Loaded state from cookie:", cookie);
      setState(cookie);
    }
  }, []);

  // Save the updated state to the cookie whenever the state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  const addTransaction = () => {
    if (!state.amount || !state.description) return;

    // Clean the amount, removing any commas and invalid characters
    const cleanedAmount = state.amount.replace(/[^\d,]/g, '').replace(',', '.'); // Replace commas for decimal
    const parsedAmount = parseFloat(cleanedAmount); // Parse the cleaned amount as a float

    console.log(parsedAmount, state.description);

    // Create a new transaction
    const newTransaction = {
      id: Date.now(),
      amount: parsedAmount,
      description: state.description,
      date: new Date().toISOString(),
    };

    // Update transactions state
    const updatedTransactions = [...state.transactions, newTransaction];
    const updatedState = {
      ...state,
      transactions: updatedTransactions,
      amount: '',
      description: '',
      category: '',
      showConfetti: updatedTransactions.length % 5 === 0,
    };

    setState(updatedState);

    // Show confetti every 5th transaction
    if (updatedTransactions.length % 5 === 0) {
      setTimeout(() => setState(prev => ({ ...prev, showConfetti: false })), 3000);
    }

    // Update the state with the new transaction and save it
    updateState(state, setState)(updatedState);
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
      <Header
        notificationsOn={state.notificationsOn}
        setNotificationsOn={() => setState(prev => ({ ...prev, notificationsOn: !prev.notificationsOn }))}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BudgetStatus
          totalSpent={totalSpent}
          remaining={remaining}
          monthlyBudget={state.monthlyBudget}
        />
        {/* <SpendingByCategory getCategoryData={getCategoryData} /> */}
      </div>

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