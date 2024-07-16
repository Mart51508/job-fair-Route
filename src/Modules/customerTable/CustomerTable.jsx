import React from 'react';
import Table from 'react-bootstrap/Table';

const CustomerTable = ({ filteredTransactions, handleRowClick }) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Customer Name</th>
          <th>Transaction Amount</th>
          <th>Transaction Date</th>
        </tr>
      </thead>
      <tbody>
        {filteredTransactions.map((customer, index) => (
          <tr key={index} onClick={() => handleRowClick(customer)} style={{ cursor: 'pointer' }}>
            <td>{customer.name}</td>
            <td>
              {customer.transactions.length > 0 ? (
                customer.transactions.map((transaction, idx) => (
                  <div key={idx}>{transaction.amount}</div>
                ))
              ) : (
                <div>No transactions</div>
              )}
            </td>
            <td>
              {customer.transactions.length > 0 ? (
                customer.transactions.map((transaction, idx) => (
                  <div key={idx}>{transaction.date}</div>
                ))
              ) : (
                <div>No transactions</div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CustomerTable;
