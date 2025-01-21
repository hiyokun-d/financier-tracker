import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import {
  Trash2, TrendingUp, TrendingDown, ChevronDown, Receipt,
  Search, SlidersHorizontal, X, Sparkles, ArrowUpCircle,
  ArrowDownCircle, Calendar, DollarSign, PieChart
} from 'lucide-react';

const SearchBar = ({ onSearch, onOpenFilters, transactions }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef(null);

  // Generate suggestions based on transaction patterns
  const suggestions = React.useMemo(() => {
    if (!transactions.length) return [];

    // Get frequency of descriptions
    const frequencyMap = transactions.reduce((acc, t) => {
      acc[t.description] = (acc[t.description] || 0) + 1;
      return acc;
    }, {});

    // Get amounts by description
    const amountMap = transactions.reduce((acc, t) => {
      if (!acc[t.description]) {
        acc[t.description] = {
          total: 0,
          count: 0
        };
      }
      acc[t.description].total += t.amount;
      acc[t.description].count += 1;
      return acc;
    }, {});

    // Create suggestions with frequency and average amount
    return Object.entries(frequencyMap)
      .map(([desc, frequency]) => ({
        description: desc,
        frequency,
        averageAmount: amountMap[desc].total / amountMap[desc].count
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);
  }, [transactions]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="px-4 py-2 border-b border-gray-100" ref={searchRef}>
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onSearch(e.target.value);
              setIsExpanded(true);
            }}
            onFocus={() => setIsExpanded(true)}
          />
          <button
            onClick={onOpenFilters}
            className="ml-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Suggestions Panel */}
        {isExpanded && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 z-10 overflow-hidden">
            <div className="p-2">
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-2 px-2">
                <Sparkles className="w-3 h-3" />
                <span>Frequent Transactions</span>
              </div>
              {suggestions.map((item, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  onClick={() => {
                    setSearchTerm(item.description);
                    onSearch(item.description);
                    setIsExpanded(false);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{item.description}</span>
                    <span className="text-xs text-gray-400">
                      {item.frequency}x
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    avg: {item.averageAmount.toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TransactionSummary = ({ transactions, totalSpent }) => {
  const resetTimeToMidnight = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const summary = React.useMemo(() => {
    const today = resetTimeToMidnight(new Date());

    // Filter today's transactions by comparing only the date part
    const todayTransactions = transactions.filter(t =>
      resetTimeToMidnight(new Date(t.date)).getTime() === today.getTime()
    );

    // Calculate income and expenses for today
    const income = todayTransactions.reduce((sum, t) =>
      t.amount > 0 ? sum + t.amount : sum, 0
    );

    const expenses = todayTransactions.reduce((sum, t) =>
      t.amount < 0 ? sum + Math.abs(t.amount) : sum, 0
    );

    const total = income - expenses;
    const transactionCount = todayTransactions.length;

    // Filter previous transactions (before today)
    const previousTransactions = transactions.filter(t =>
      resetTimeToMidnight(new Date(t.date)).getTime() < today.getTime()
    );

    // Calculate the total spent (expenses) for previous days
    const previousSpent = previousTransactions.reduce((sum, t) =>
      t.amount < 0 ? sum + Math.abs(t.amount) : sum, 0
    );

    return {
      income,
      expenses,
      total,
      transactionCount,
      previousSpent,
      averageTransaction: transactionCount ? Math.abs(total / transactionCount) : 0
    };
  }, [transactions]);


  return (
    <div className="px-4 py-3 bg-white border-b border-gray-100">


      <div className={`transition-all duration-200 origin-top space-y-3  'h-32 opacity-100' `}>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-lg p-2">
            <div className="flex items-center gap-2 mb-1">
              <ArrowUpCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-600">Today total Spent</span>
            </div>
            <span className="text-sm font-semibold text-green-600">
              {summary.income.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </span>
          </div>
          <div className="bg-red-50 rounded-lg p-2">
            <div className="flex items-center gap-2 mb-1">
              <ArrowDownCircle className="w-4 h-4 text-red-600" />
              <span className="text-xs text-gray-600">Total spend</span>
            </div>
            <span className="text-sm font-semibold text-red-600">
              {totalSpent.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>Transactions Today: {summary.transactionCount}</span>
          <span>Average: {summary.averageTransaction.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          })}</span>
        </div>
      </div>
    </div>
  );
};

const SortFilterMenu = ({ isOpen, onClose, onApplySort, onApplyDateFilter }) => {
  const [sortBy, setSortBy] = useState('date-desc');
  const [dateRange, setDateRange] = useState('all');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 z-50">
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Sort & Filter</h3>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Sort by</h4>
          <div className="space-y-2">
            {[
              { value: 'date-desc', label: 'Latest First', icon: Calendar },
              { value: 'date-asc', label: 'Oldest First', icon: Calendar },
              { value: 'amount-desc', label: 'Highest Amount', icon: DollarSign },
              { value: 'amount-asc', label: 'Lowest Amount', icon: DollarSign },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                className={`w-full flex items-center px-3 py-2 rounded-lg ${sortBy === value ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                  }`}
                onClick={() => {
                  setSortBy(value);
                  onApplySort(value);
                }}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Time Period</h4>
          <div className="space-y-2">
            {[
              { value: 'all', label: 'All Time' },
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
            ].map(({ value, label }) => (
              <button
                key={value}
                className={`w-full text-left px-3 py-2 rounded-lg ${dateRange === value ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                  }`}
                onClick={() => {
                  setDateRange(value);
                  onApplyDateFilter(value);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full py-8 animate-fade-in">
    <div className="bg-gray-50 rounded-full p-4 mb-4">
      <Receipt className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-gray-600 font-medium mb-1">No transactions found!</h3>
    <p className="text-gray-400 text-sm text-center px-6">
      Your financial journey starts with your first transaction
    </p>
  </div>
);

const formatDate = (date) => {
  const now = new Date();
  const transactionDate = new Date(date);
  const diffTime = Math.abs(now - transactionDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Today
  if (diffDays === 0) {
    return {
      time: transactionDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      label: 'Today'
    };
  }

  // Yesterday
  if (diffDays === 1) {
    return {
      time: transactionDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      label: 'Yesterday'
    };
  }

  // Within last 7 days
  if (diffDays < 7) {
    return {
      time: transactionDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      label: transactionDate.toLocaleDateString('en-US', { weekday: 'long' })
    };
  }

  // Older transactions
  return {
    time: transactionDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }),
    label: transactionDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: now.getFullYear() !== transactionDate.getFullYear() ? 'numeric' : undefined
    })
  };
};

export const LogsFinance = ({ amount, description, date, onDelete }) => {
  const itemRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const formattedDate = formatDate(date);

  useEffect(() => {
    anime({
      targets: itemRef.current,
      translateY: [15, 0],
      opacity: [0, 1],
      duration: 500,
      delay: 100,
      easing: 'spring(1, 90, 10, 0)'
    });
  }, []);

  const handleDelete = () => {

    anime({
      targets: itemRef.current,
      translateX: [-20, 0],
      opacity: [1, 0],
      duration: 300,
      easing: 'easeOutQuad',
      complete: () => onDelete?.()
    });
  };

  const isPositive = amount >= 0;

  return (
    <div ref={itemRef} className="mb-2">
      <div
        className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 ${isExpanded ? 'ring-2 ring-blue-100' : ''
          }`}
      >
        <div
          className="p-3 active:bg-gray-50 transition-colors"
          onClick={() => {
            setIsExpanded(!isExpanded);
            if ('vibrate' in navigator) navigator.vibrate(5);
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${isPositive ? 'bg-green-50 ring-1 ring-green-100' : 'bg-red-50 ring-1 ring-red-100'
                }`}
            >
              {isPositive ?
                <TrendingUp className="w-4 h-4 text-green-500" /> :
                <TrendingDown className="w-4 h-4 text-red-500" />
              }
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-gray-900 font-medium text-sm truncate">
                  {description}
                </p>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                    }`}
                />
              </div>
              <div className="flex items-center justify-between">
                <p
                  className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                  {isPositive ? '+' : ''}{amount.toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}
                </p>
                <div className="text-xs text-gray-400">
                  <span className="mr-1">{formattedDate.label}</span>
                  <span>{formattedDate.time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`transition-all duration-200 origin-top ${isExpanded ? 'h-12' : 'h-0'
            }`}
        >
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 px-3 py-1 text-sm text-red-600 font-medium rounded-md hover:bg-red-50 active:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// const deleteHandling = (t, setAmount) => {
//     const cookie = loadState();
//     const updatedTransactions = cookie.transactions.filter(transaction => transaction.id !== t.id);
//     saveState({ ...cookie, transactions: updatedTransactions });

//     // Update the state with the new transaction and save it
//     updateState(cookie, saveState)({ transactions: updatedTransactions });

//     // update the BudgetStatus
//     const updatedTotalSpent = totalSpent - t.amount;
//     setAmount(updatedTotalSpent);
//     return updatedTotalSpent;
// }

export const LogsContainer = ({ transactions: initialTransactions, onDeleteData, totalOfEachDay, totalSpentMoney }) => {
  const containerRef = useRef(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState('date-desc');
  const [dateFilter, setDateFilter] = useState('all');
  const [filteredTransactions, setFilteredTransactions] = useState(initialTransactions);

  useEffect(() => {
    let result = [...initialTransactions];

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(searchLower) ||
        t.amount.toString().includes(searchLower) ||
        new Date(t.date).toLocaleDateString().includes(searchTerm)
      );
    }

    // Apply date filter
    const now = new Date();
    switch (dateFilter) {
      case 'today':
        result = result.filter(t => {
          const date = new Date(t.date);
          return date.toDateString() === now.toDateString();
        });
        break;
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        result = result.filter(t => new Date(t.date) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        result = result.filter(t => new Date(t.date) >= monthAgo);
        break;
    }

    // Apply sort
    result.sort((a, b) => {
      switch (sortConfig) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    setFilteredTransactions(result);
  }, [initialTransactions, searchTerm, sortConfig, dateFilter]);
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="bg-gray-50 rounded-t-2xl shadow-lg">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-800">Recent Transactions</h2>
      </div>

      <TransactionSummary transactions={initialTransactions} transactionOfEachDay={totalOfEachDay} totalSpent={totalSpentMoney} />

      <SearchBar
        onSearch={handleSearch}
        onOpenFilters={() => setIsFilterMenuOpen(true)}
        transactions={initialTransactions}
      />

      <SortFilterMenu
        isOpen={isFilterMenuOpen}
        onClose={() => setIsFilterMenuOpen(false)}
        onApplySort={setSortConfig}
        onApplyDateFilter={setDateFilter}
      />

      <div
        ref={containerRef}
        className="p-3 overflow-y-auto overscroll-bounce"
        style={{
          height: '380px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {filteredTransactions?.length > 0 ? (
          <div className="space-y-1">
            {filteredTransactions.map(t => (
              <LogsFinance
                key={t.id}
                amount={t.amount}
                description={t.description}
                date={t.date}
                onDelete={() => onDeleteData(t.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default LogsContainer;
