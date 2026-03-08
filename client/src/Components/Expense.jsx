import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Input } from "antd";
import { FaWallet } from "react-icons/fa";
import API_URL from '../config';

function Expense({ friendsList }) {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [frndId, setFrndId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState({});

  const colors = ['gray', 'red', 'blue', 'orange', 'green', 'pink'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const newExpense = {
    id: frndId,
    name: selectedFriend,
    amount,
    color: randomColor,
    reason
  };

  useEffect(() => {
    getFriends();
  }, [])

  const getFriends = async () => {
    let user = localStorage.getItem("id");
    await axios.get(`${API_URL}/getFriends/${user}`)
      .then((res) => {
        setFriends(res.data);
      });
  }

  const handleAddExpense = async () => {
    const user = localStorage.getItem("id");
    if (!user) {
      alert("Please login to add expenses");
      return;
    }
    if (!selectedFriend || !amount) {
      alert("Please select a friend and enter an amount.");
    } else {
      try {

        const res = await axios.post(`${API_URL}/addexpense/${user}`, newExpense);
        setFriends(res.data);
        setSelectedFriend('');
        setAmount('');
        setReason('');
        setFrndId(null);
      } catch (error) {
        console.error("Error adding expense:", error);
      }
    }
  };

  const deleteExpense = async (i, j) => {
    const user = localStorage.getItem("id");
    if (!user) {
      alert("Please login to delete expenses");
      return;
    }
    try {
      const confirmed = window.confirm("Are you Sure?");
      if (confirmed) {
        const res = await axios.delete(`${API_URL}/friendexpense/${i}/${user}/${j}`);
        setFriends(res.data);
      }
    } catch (error) {
      console.error("Error deleting the expense:", error);
    }
  }


  const handleEditExpense = (i, exp) => {
    setCurrentExpense({
      friendIndex: i,
      expenseId: exp.expenseid,
      amount: exp.amount,
      reason: exp.reason,
    });
    setAmount(exp.amount);
    setReason(exp.reason);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const userid = localStorage.getItem("id")
    if (!userid) {
      alert("Please login to save changes");
      return;
    }
    axios.put(`${API_URL}/updateexpense/${userid}`, {
      friendIndex: currentExpense.friendIndex,
      expenseId: currentExpense.expenseId,
      newAmount: amount,
      newReason: reason,
    })
      .then((res) => {
        getFriends();
        setIsModalOpen(false);
        setAmount('');
        setReason('');
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setAmount('');
    setReason('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Add Expenses</h2>
          <p className="text-gray-600">Select friend, input amount, and add expense</p>

          {/* Input Section */}
          <div className="flex gap-3 mt-6">
            <select
              className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all duration-300 bg-white"
              value={selectedFriend}
              onChange={(e) => {
                setSelectedFriend(e.target.value);
                setFrndId(e.target.selectedIndex - 1);
              }}
            >
              <option key={0} value="">Choose Friend</option>
              {friendsList.map((el, i) => (
                <option key={i + 1} value={el.name}>{el.name}</option>
              ))}
            </select>

            <Input
              type="text"
              placeholder="Amount"
              className="w-32 px-4 py-3 rounded-lg"
              value={amount}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddExpense();
                }
              }}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button
              onClick={handleAddExpense}
              className="px-8 py-3 rounded-lg font-bold text-black text-2xl bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Reason Input */}
          <Input
            type="text"
            placeholder="Reason (optional)"
            className="mt-4 px-4 py-3 rounded-lg"
            value={reason}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddExpense();
              }
            }}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* Expense List */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Expense History</h3>

          {friends && friends.map((friend, i) => {
            return (
              <div key={i}>
                {friend.expenses && friend.expenses.map((exp, j) => {
                  return (
                    <div
                      key={exp.expenseid}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg p-5 mb-3 border border-gray-100 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {friend.name?.charAt(0).toUpperCase()}
                          </div>

                          {/* Expense Details */}
                          <div>
                            <p className="text-gray-800 font-semibold">
                              {friend.name} paid <span className="text-emerald-600">₹{exp.amount}</span>
                            </p>
                            {exp.reason && (
                              <p className="text-sm text-gray-500">for {exp.reason}</p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditExpense(i, exp)}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-300"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteExpense(i, exp.expenseid)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {(!friends || friends.length === 0 || friends.every(f => !f.expenses || f.expenses.length === 0)) && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="mb-4 text-teal-400">
                <FaWallet size={56} />
              </div>
              <p className="text-gray-500 text-lg">No expenses added yet. Add your first expense above!</p>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        <Modal
          title={<span className="text-xl font-bold text-gray-800">Edit Expense</span>}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          centered
        >
          <div className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
              <Input
                type="text"
                name='new Amount'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Reason</label>
              <Input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Expense;
