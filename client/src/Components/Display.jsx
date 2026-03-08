import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SplitPaymentCalcClass from './SplitPaymentClass';
import { FiCheckCircle } from "react-icons/fi";
import API_URL from '../config';

const Display = () => {
  const [friends, setFriends] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getFriends();
    fetchSettledTransactions();
  }, []);

  const fetchSettledTransactions = async () => {
    const userId = localStorage.getItem("id");
    try {
      const response = await axios.get(`${API_URL}/settledTransactions/${userId}`);
      const settledIds = response.data;
      const settledMap = {};
      settledIds.forEach(id => {
        settledMap[id] = true;
      });
      setCheckedItems(settledMap);
    } catch (error) {
      console.error('Error fetching settled transactions:', error);
    }
  };

  useEffect(() => {
    if (expenses.length > 0) {
      const newCalc = new SplitPaymentCalcClass(expenses);
      const transactionsArray = newCalc.getTransactions();
      setTransactions(transactionsArray);
    }
  }, [expenses]);

  const getFriends = async () => {
    let user = localStorage.getItem("id");
    try {
      const response = await axios.get(`${API_URL}/getFriends/${user}`);
      const friendsData = response.data;
      setFriends(friendsData);

      const expensesData = friendsData.map(friend => {
        const totalExpense = friend.expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        return { amount: totalExpense, friend: { id: friend.name, name: friend.name } };
      });

      setExpenses(expensesData);
    } catch (error) {
      console.error('Error fetching friends data:', error);
    }
  };

  const handleCheckboxChange = async (id) => {
    const userId = localStorage.getItem("id");
    try {
      // Optimistic update
      setCheckedItems(prevState => ({
        ...prevState,
        [id]: !prevState[id]
      }));

      await axios.post(`${API_URL}/toggleSettlement/${userId}`, { transactionId: id });
    } catch (error) {
      console.error('Error toggling settlement:', error);
      // Revert on error
      setCheckedItems(prevState => ({
        ...prevState,
        [id]: !prevState[id]
      }));
    }
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Settlement Transactions</h2>
          <p className="text-gray-600">Check off transactions as they are completed</p>
        </div>

        {/* Transactions List */}
        <div className="space-y-3 mb-8">
          {transactions.length > 0 ? (
            transactions.map((txn) => (
              <div
                className={`bg-white rounded-xl shadow-md p-5 border transition-all duration-300 transform hover:-translate-y-1 ${checkedItems[txn.id]
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-100 hover:shadow-lg'
                  }`}
                key={txn.id}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={checkedItems[txn.id] || false}
                      onChange={() => handleCheckboxChange(txn.id)}
                      className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer"
                    />

                    {/* Transaction Details */}
                    <div>
                      <p className={`font-semibold ${checkedItems[txn.id] ? 'text-emerald-700 line-through' : 'text-gray-800'}`}>
                        {txn.from_friend.name}
                        <span className="mx-2 text-gray-400">→</span>
                        {txn.to_friend.name}
                      </p>
                    </div>
                  </div>

                  {/* Amount */}
                  <span className={`text-lg font-bold ${checkedItems[txn.id] ? 'text-emerald-600' : 'text-primary-600'}`}>
                    ₹{txn.amount}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="mb-4 text-emerald-400">
                <FiCheckCircle size={56} />
              </div>
              <p className="text-gray-500 text-lg">No transactions to settle. All expenses are balanced!</p>
            </div>
          )}
        </div>

        {/* Total */}
        {transactions.length > 0 && (
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl shadow-xl p-6 text-black">
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold">Total Amount</span>
              <span className="text-3xl font-bold">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Display;
