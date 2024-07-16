import axios from "axios";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CustomerTable from "../customerTable/CustomerTable";
import CustomerChart from "../CustomerChart/CustomerChart";
import Spinner from "react-bootstrap/Spinner";

const Main = () => {
  const [customersList, setCustomersList] = useState([]);
  const [transactionList, setTransactionList] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchVal, setSearchVal] = useState('');
  const [transactionSearchVal, setTransactionSearchVal] = useState('');
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  const getAllCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/customers");
      const customerData = response.data;
      setCustomersList(customerData);
    } catch (error) {
      console.log(error);
    }finally {
      setLoadingCustomers(false);
    }
  };

  const getAllTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/transactions");
      const transactionData = response.data;
      setTransactionList(transactionData);
    } catch (error) {
      console.log(error);
    }finally {
      setLoadingTransactions(false);
    }
  };

  const transactionFiltering = () => {
    const filtered = customersList.map((customer) => {
      const customerTransactions = transactionList.filter((transaction) => {
        return customer.id == transaction.customer_id;
      });

      const transactionsByDate = customerTransactions.reduce((acc, transaction) => {
        const date = transaction.date.split('T')[0];
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += transaction.amount;
        return acc;
      }, {});

      const aggregatedTransactions = Object.keys(transactionsByDate)
        .map(date => ({
          date,
          amount: transactionsByDate[date],
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      return {
        ...customer,
        transactions: aggregatedTransactions,
      };
    });

    const searchByName = filtered.filter((customer) => 
      customer.name.toLowerCase().includes(searchVal.toLowerCase())
    );

    const searchByTransaction = searchByName.map((customer) => {
      const filteredTransactions = customer.transactions.filter((transaction) =>
        transaction.amount.toString().includes(transactionSearchVal) || transaction.date.includes(transactionSearchVal)
      );

      return {
        ...customer,
        transactions: filteredTransactions,
      };
    });

    setFilteredTransactions(searchByTransaction);
  };

  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
  };

  const handleTransactionSearchChange = (e) => {
    setTransactionSearchVal(e.target.value);
  };

  useEffect(() => {
    getAllCustomers();
    getAllTransactions();
  }, []);

  useEffect(() => {
    if (customersList.length > 0 && transactionList.length > 0) {
      transactionFiltering();
    }
  }, [customersList, transactionList, searchVal, transactionSearchVal]);


  return (
    <Container>
      <h2 className="text-center my-3">Customer's Transaction</h2>
      <Row className="mb-4">
        <Col>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              value={searchVal}
              onChange={handleSearchChange}
              placeholder="Search by name"
            />
          </InputGroup>
        </Col>
        <Col>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              value={transactionSearchVal}
              onChange={handleTransactionSearchChange}
              placeholder="Search by transaction"
            />
          </InputGroup>
        </Col>
      </Row>

      {loadingCustomers || loadingTransactions ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="sr-only"></span>
          </Spinner>
        </div>
      ) : (
        <>
          <CustomerTable filteredTransactions={filteredTransactions} handleRowClick={handleRowClick} />
      <CustomerChart selectedCustomer={selectedCustomer} />
        </>
      )}
    </Container>
  );
};

export default Main;

