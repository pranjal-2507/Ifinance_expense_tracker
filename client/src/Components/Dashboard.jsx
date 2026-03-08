import React, { useState, useEffect } from "react";
import { Form, Input, Modal, Select, Table, message } from "antd";
import axios from "axios";
import Layout from "./Layout";
import moment from "moment";
import { DatePicker } from "antd";
const { MonthPicker, RangePicker } = DatePicker;
import { AiOutlineUnorderedList } from "react-icons/ai";
import { FaChartArea, FaWallet } from "react-icons/fa";
import { MdDelete, MdModeEditOutline, MdTrendingUp, MdTrendingDown, MdShoppingCart } from "react-icons/md";
import API_URL from "../config";
import { BiSolidSave } from "react-icons/bi";
import Analytics from "./Analytics";

function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [frequency, setFrequency] = useState("all");
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState("all");
  const [editableRow, setEditableRow] = useState(null);
  const [activeList, setActiveList] = useState(true);
  const [activeComponent, setActiveComponent] = useState("table");
  const [form] = Form.useForm();

  const handleEdit = (record) => {
    if (!localStorage.getItem("id")) {
      message.error("Please login to edit transactions");
      return;
    }
    setEditableRow(record.key);
  };

  const handleSave = async (record) => {
    const user = localStorage.getItem("id");
    if (!user) {
      message.error("Please login to save changes");
      return;
    }
    try {
      const updatedTransaction = { ...record };
      setLoading(true);

      await axios.put(
        `${API_URL}/updateTransaction/${record._id}`,
        updatedTransaction
      );
      setLoading(false);
      message.success("Transaction updated successfully");
      setEditableRow(null);
      handleNewData();
    } catch (error) {
      setLoading(false);
      message.error("Failed to update the transaction");
    }
  };

  const handleDelete = (record) => {
    if (!localStorage.getItem("id")) {
      message.error("Please login to delete transactions");
      return;
    }
    Modal.confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to delete this transaction?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        confirmDelete(record);
      },
    });
  };

  const confirmDelete = async (record) => {
    try {
      setLoading(true);
      await axios.delete(
        `${API_URL}/deleteTransaction/${record._id}`
      );
      setLoading(false);
      message.success("Transaction deleted successfully");
      handleNewData();
    } catch (error) {
      setLoading(false);
      message.error("Failed to delete the transaction");
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) =>
        editableRow === record.key ? (
          <DatePicker
            defaultValue={moment(text)}
            onChange={(value) => (record.date = value)}
          />
        ) : (
          <span>{moment(text).format("YYYY-MM-DD")}</span>
        ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text, record) =>
        editableRow === record.key ? (
          <Input
            defaultValue={text}
            onChange={(e) => (record.amount = e.target.value)}
          />
        ) : (
          <span className="font-semibold">₹{text}</span>
        ),
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (text, record) =>
        editableRow === record.key ? (
          <Select
            defaultValue={text}
            onChange={(value) => (record.type = value)}
          >
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
          </Select>
        ) : (
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${text === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {text}
          </span>
        ),
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (text, record) =>
        editableRow === record.key ? (
          <Input
            defaultValue={text}
            onChange={(e) => (record.category = e.target.value)}
          />
        ) : (
          <span className="text-gray-700">{text}</span>
        ),
    },
    {
      title: "Reference",
      dataIndex: "reference",
      render: (text, record) =>
        editableRow === record.key ? (
          <Input
            defaultValue={text}
            onChange={(e) => (record.reference = e.target.value)}
          />
        ) : (
          <span className="text-gray-600">{text}</span>
        ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text, record) =>
        editableRow === record.key ? (
          <Input
            defaultValue={text}
            onChange={(e) => (record.description = e.target.value)}
          />
        ) : (
          <span style={{ display: "block", width: "200px" }} className="text-gray-500">{text}</span>
        ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <span className="flex items-center space-x-2">
          {editableRow === record.key ? (
            <button
              onClick={() => handleSave(record)}
              className="p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-all duration-300 hover:scale-110"
            >
              <BiSolidSave size={20} />
            </button>
          ) : (
            <button
              onClick={() => handleEdit(record)}
              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110"
            >
              <MdModeEditOutline size={20} />
            </button>
          )}
          <button
            onClick={() => handleDelete(record)}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110"
          >
            <MdDelete size={20} />
          </button>
        </span>
      ),
    },
  ];

  const handleNewData = async () => {
    try {
      const user = localStorage.getItem("id");
      const res = await axios.get(
        `${API_URL}/getTransaction/${user}`
      );
      setTransactions(res.data);
    } catch (err) {
      message.error("Failed to fetch transactions");
    }
  };

  useEffect(() => {
    handleNewData();
  }, []);

  let filteredData = [...transactions];

  if (type !== "all") {
    filteredData = filteredData.filter(
      (transaction) => transaction.type === type
    );
  }

  if (frequency === "custom" && selectedDate.length === 2) {
    const startDate = selectedDate[0];
    const endDate = selectedDate[1];

    filteredData = transactions.filter((transaction) => {
      const transactionDate = moment(transaction.date);
      return transactionDate.isBetween(startDate, endDate, null, "[]");
    });
  } else if (frequency === "7") {
    const oneWeekAgo = moment().subtract(7, "days").toDate();
    filteredData = transactions.filter((transaction) =>
      moment(transaction.date).isAfter(oneWeekAgo)
    );
  } else if (frequency === "30") {
    const oneMonthAgo = moment().subtract(1, "months").toDate();
    filteredData = transactions.filter((transaction) =>
      moment(transaction.date).isAfter(oneMonthAgo)
    );
  } else if (frequency === "365") {
    const oneYearAgo = moment().subtract(1, "years").toDate();
    filteredData = transactions.filter((transaction) =>
      moment(transaction.date).isAfter(oneYearAgo)
    );
  }

  const handleSubmit = async (values) => {
    const user = localStorage.getItem("id");
    if (!user) {
      message.error("Please login to add transactions");
      return;
    }
    try {
      setLoading(true);

      await axios.post(`${API_URL}/addTransaction`, {
        data: values,
        id: user,
      });
      setLoading(false);

      message.success("Transaction Added successfully");
      setShowModal(false);
      form.resetFields();
      handleNewData();
    } catch (error) {
      setLoading(false);
      message.error("Failed to add the transaction");
    }
  };

  // Compute quick stats
  const userName = localStorage.getItem("user");
  const profileImg = localStorage.getItem("profile");
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50/50 animate-page-enter">
        <div className="container mx-auto px-4 py-12 md:py-16">
          {/* Personalized Header */}
          <div className="mb-8 animate-slide-up">
            <div className="flex items-center space-x-4 mb-6">
              {profileImg ? (
                <img src={profileImg} alt="Profile" className="w-14 h-14 rounded-full border-2 border-indigo-400 shadow-lg" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {userName?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <div>
                <p className="text-gray-500 text-sm">{getGreeting()}</p>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  {userName ? `${userName}'s Dashboard` : "My Dashboard"}
                </h1>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover-lift transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Balance</p>
                    <p className={`text-2xl font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      ₹{balance.toLocaleString()}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${balance >= 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {balance >= 0 ? <MdTrendingUp size={24} /> : <MdTrendingDown size={24} />}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">{transactions.length} total transactions</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover-lift transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Income</p>
                    <p className="text-2xl font-bold text-emerald-600">₹{totalIncome.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <FaWallet size={22} />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">{transactions.filter(t => t.type === 'income').length} income entries</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover-lift transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600">₹{totalExpense.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-500">
                    <MdShoppingCart size={24} />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">{transactions.filter(t => t.type === 'expense').length} expense entries</p>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Frequency Filter */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">Select Frequency</h4>
                <Select
                  value={frequency}
                  onChange={(value) => setFrequency(value)}
                  className="w-40"
                >
                  <Select.Option value="all">All Data</Select.Option>
                  <Select.Option value="7">Last 1 Week</Select.Option>
                  <Select.Option value="30">Last 1 Month</Select.Option>
                  <Select.Option value="365">Last 1 Year</Select.Option>
                </Select>
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">Select Type</h4>
                <Select
                  value={type}
                  onChange={(value) => setType(value)}
                  className="w-40"
                >
                  <Select.Option value="all">All Types</Select.Option>
                  <Select.Option value="income">Income</Select.Option>
                  <Select.Option value="expense">Expense</Select.Option>
                </Select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center space-x-1 bg-gray-100 p-1.5 rounded-xl">
                <button
                  onClick={() => setActiveComponent("table")}
                  className={`p-2.5 rounded-lg transition-all duration-300 ${activeComponent === "table"
                    ? "bg-white text-indigo-600 shadow-md"
                    : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    }`}
                >
                  <AiOutlineUnorderedList size={22} />
                </button>
                <button
                  onClick={() => setActiveComponent("analytics")}
                  className={`p-2.5 rounded-lg transition-all duration-300 ${activeComponent === "analytics"
                    ? "bg-white text-indigo-600 shadow-md"
                    : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                    }`}
                >
                  <FaChartArea size={22} />
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 btn-shimmer animate-glow-pulse"
                style={{ animationDuration: '3s' }}
              >
                Add +
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {activeComponent === "table" ? (
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={filteredData}
                  className="custom-table"
                  scroll={{ x: 'max-content' }}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} transactions`,
                  }}
                />
              </div>
            ) : (
              <Analytics transactions={transactions} />
            )}
          </div>

          {/* Add Transaction Modal */}
          <Modal
            title={<span className="text-xl font-bold text-gray-800">Add Transaction</span>}
            open={showModal}
            onCancel={() => {
              setShowModal(false);
              form.resetFields();
            }}
            footer={null}
            centered
            width={600}
            className="animate-scale-in"
          >
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              className="mt-6"
            >
              <Form.Item label="Amount" name="amount">
                <Input type="text" className="rounded-lg" placeholder="Enter amount" />
              </Form.Item>

              <Form.Item label="Type" name="type">
                <Select placeholder="Select type">
                  <Select.Option value="income">Income</Select.Option>
                  <Select.Option value="expense">Expense</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Category" name="category">
                <Select placeholder="Select category">
                  <Select.Option value="salary">Salary</Select.Option>
                  <Select.Option value="tip">Tip</Select.Option>
                  <Select.Option value="project">Project</Select.Option>
                  <Select.Option value="food">Food</Select.Option>
                  <Select.Option value="movie">Movie</Select.Option>
                  <Select.Option value="bills">Bills</Select.Option>
                  <Select.Option value="medical">Medical</Select.Option>
                  <Select.Option value="fee">Fee</Select.Option>
                  <Select.Option value="tax">TAX</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Date" name="date">
                <Input type="date" className="rounded-lg" />
              </Form.Item>

              <Form.Item label="Reference" name="reference">
                <Input type="text" className="rounded-lg" placeholder="Enter reference" />
              </Form.Item>

              <Form.Item label="Description" name="description">
                <Input type="text" className="rounded-lg" placeholder="Enter description" />
              </Form.Item>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="px-8 py-3 font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer btn-shimmer rounded-xl"
                >
                  SAVE
                </button>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
