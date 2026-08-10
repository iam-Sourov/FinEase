import React from 'react';
import TransactionCard from './MyTransactionCard/TransactionCard';



const MyTransaction = () => {

  return (
    <div>
      <div className="w-full min-h-[40vh] flex items-center justify-center text-center ">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight shadow-text">
            Take Control of Your Transactions.
          </h1>
          <p className="text-xl md:text-2xl mt-4 font-light">
            Your journey to financial freedom starts today.
          </p>
          <h1 className="text-2xl font-semibold  mt-4 text-center">
            My Transactions
          </h1>
        </div>
      </div>
      <TransactionCard></TransactionCard>
    </div>
  );
};

export default MyTransaction;
