import React from 'react';
import HistoryList from '../components/HistoryList';

const HistoryPage = () => {
  return (
    <div className="container mt-5">
      <h1 className="mb-4">Summary History</h1>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <HistoryList />
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;