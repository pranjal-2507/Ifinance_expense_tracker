import React from "react";
import { BsPersonFillAdd } from "react-icons/bs";
import { FaWallet } from "react-icons/fa6";
import { FiShare } from "react-icons/fi";


function FrndsNavbar({
  setShowFriendsList,
  setShowExpenses,
  setShowTransactions,
  activeTab
}) {
  const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 px-6 py-4 md:py-3 rounded-xl font-bold transition-all duration-300 group w-full md:w-auto ${isActive
          ? "text-indigo-600 bg-indigo-50 shadow-sm border border-indigo-100"
          : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50 border border-transparent"
        }`}
    >
      <Icon className={`text-xl transition-transform duration-300 group-hover:scale-110 ${isActive ? "scale-110" : ""
        }`} />
      <span className="tracking-wide text-sm md:text-base">{label}</span>
    </button>
  );

  return (
    <div className="bg-white/50 backdrop-blur-sm shadow-sm border-b border-gray-100 mb-8 sticky top-[72px] md:top-[88px] z-40">
      <div className="container mx-auto px-4 py-2 md:py-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 max-w-2xl mx-auto">
          <TabButton
            icon={BsPersonFillAdd}
            label="FRIENDS"
            isActive={activeTab === "friends"}
            onClick={() => {
              setShowFriendsList(true);
              setShowExpenses(false);
              setShowTransactions(false);
            }}
          />

          <TabButton
            icon={FaWallet}
            label="EXPENSES"
            isActive={activeTab === "expenses"}
            onClick={() => {
              setShowFriendsList(false);
              setShowExpenses(true);
              setShowTransactions(false);
            }}
          />

          <TabButton
            icon={FiShare}
            label="TRANSACTIONS"
            isActive={activeTab === "transactions"}
            onClick={() => {
              setShowFriendsList(false);
              setShowExpenses(false);
              setShowTransactions(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default FrndsNavbar;
