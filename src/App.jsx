import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TransactionForm } from './components/TransactionForm';
import { BudgetStatus } from './components/BudgetStatus';
import { saveState, updateState, loadState } from './functions/cookies';
import LogsContainer from './components/LogsFinancie';

// TODO: ADD ALL THE LOGS FOR THE SPENDING MECHANISM
// TODO ADD THE GRAPH FOR THE SPENDING MECHANISM

// Load the cookie from local storage
const cookie = loadState();

const FinanceTracker = () => {
  const [config, setConfig] = useState({
    notificationsOn: true,
  });

  const [state, setState] = useState({
    transactions: [],
    transactionsEachDay: [], // the total amount of transactions each day
    amount: '',
    description: '',
    category: '',
    monthlyBudget: 1500000,
    showConfetti: false,
  });

  // Load the saved state from cookie when the component mounts
  useEffect(() => {
    if (cookie) {
      // console.log("Loaded state from cookie:", cookie);
      setState(cookie);
    }
  }, []);

  // Save the updated state to the cookie whenever the state changes
  useEffect(() => {
    if (isCookieFull()) {
      const newCookieName = `dataUser${Date.now()}`; // Generate a new cookie name
      addCookie(JSON.stringify(state), newCookieName); // Add new cookie with serialized state
    } else {
      saveState(state); // Otherwise, save the state in the current cookie
    }
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

    // Update the transactionsEachDay state
    const transactionDate = new Date(newTransaction.date).toLocaleDateString();
    const updatedTransactionsEachDay = [...state.transactionsEachDay];

    // Find if the date already exists in transactionsEachDay
    const dayEntryIndex = updatedTransactionsEachDay.findIndex(t => t.date === transactionDate);

    if (dayEntryIndex >= 0) {
      // If the date exists, update the amount for that day
      updatedTransactionsEachDay[dayEntryIndex].amount += parsedAmount;
    } else {
      // If the date does not exist, add a new entry
      updatedTransactionsEachDay.push({
        date: transactionDate,
        amount: parsedAmount
      });
    }

    const updatedState = {
      ...state,
      transactions: updatedTransactions,
      transactionsEachDay: updatedTransactionsEachDay, // Update this part
      amount: '',
      description: '',
      category: '',
      showConfetti: updatedTransactions.length % 5 === 0,
    };

    setState(updatedState);

    // Show confetti every 5th transaction
    if (updatedTransactions.length % 5 === 0) {
      setTimeout(() => setConfig(prev => ({ ...prev, showConfetti: false })), 3000);
    }

    console.log(updateState.transactionsEachDay)
    // Update the state with the new transaction and save it
    updateState(state, setState)(updatedState);
  };

  let totalSpent = state.transactions.reduce((sum, t) => sum + t.amount, 0);
  let remaining = state.monthlyBudget - totalSpent;
  const theTotalOfTheDay = state.transactionsEachDay.reduce((sum, t) => sum + t.amount, 0);

  const handleReset = () => {
    totalSpent = 0;
    remaining = state.monthlyBudget - totalSpent;

    setState(prev => ({
      ...prev,
      transactions: [],
      transactionsEachDay: [],
      amount: '',
      description: '',
      category: '',
      showConfetti: false,
    }));
  }

  return (
    <div className="from-blue-950 to-blue-600 max-w-4xl mx-auto  space-y-6">
      <Header
        notificationsOn={config.notificationsOn}
        setNotificationsOn={() => setConfig(prev => ({ ...prev, notificationsOn: !prev.notificationsOn }))}
        onResetBudget={handleReset}
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

      {/* GRAPH */}

      <LogsContainer
        transactions={state.transactions}
        onDeleteData={(id) =>
          setState(prev => ({
            ...prev,
            transactions: prev.transactions.filter(t => t.id !== id) // Remove the transaction with the given id
          }))
        }
        totalOfEachDay={theTotalOfTheDay}
        totalSpentMoney={totalSpent}
      />
    </div>
  );
};

export default FinanceTracker;
