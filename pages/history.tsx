import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Paper, Flex, Pagination, Textarea } from '@mantine/core';
import Cookies from 'js-cookie';
import { NavbarMinimal } from '../components/Navbar/NavbarMinimal';
import { TableSort } from '../components/history/TableSort';
import { TableSortAdmin } from '../components/history/TableSortAdmin';
import styles from './history.module.css';
import withAuth from './withAuth';
 

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [convertedContent, setConvertedContent] = useState<string | null>(null);
  const [selectedOutputId, setSelectedOutputId] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<number>(1);
  const [userRole, setUserRole] = useState('user');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchHistory();
    getUserRole();
  }, []);

  const fetchHistory = async () => {
    try {
      const authToken = Cookies.get('authToken');
      const response = await axios.get('http://localhost:8081/api/convert/history', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching file history', error);
      alert('Error fetching file history: ' + (error as Error).message);
    }
  };

  const getUserRole = () => {
    const role = Cookies.get('userrole');
    setUserRole(role || 'user');
  };

  const fetchOutput = async (id: string) => {
    try {
      const authToken = Cookies.get('authToken');
      const response = await axios.get(`http://localhost:8081/api/convert/output/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setConvertedContent(response.data.convertedContent);
      setSelectedOutputId(id);
    } catch (error) {
      console.error('Error fetching file output', error);
      alert('Error fetching file output: ' + (error as Error).message);
    }
  };

  const handlePageChange = (page: number) => {
    setActivePage(page);
  };

  const paginatedData = history.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  return (
    <Flex className={styles.page}>
      <div style={{ width: '250px', flexShrink: 0 }}>
        <NavbarMinimal />
      </div>
      <Container className={styles.container}>
        <Paper className={styles.card} shadow="md" withBorder>
          {userRole === 'admin' ? (
            <TableSortAdmin data={paginatedData} onShowOutput={fetchOutput} />
          ) : (
            <TableSort data={paginatedData} onShowOutput={fetchOutput} />
          )}

          <Pagination
            total={Math.ceil(history.length / itemsPerPage)}
            value={activePage}
            onChange={handlePageChange}
            color="#ed5f49"
            radius="md"
            withEdges
            mt="lg"
          />
          {convertedContent && (
            <Textarea
              label="Converted Content"
              value={convertedContent}
              readOnly
              autosize
              minRows={4}
              className={styles.textarea}
            />
          )}
        </Paper>
      </Container>
    </Flex>
  );
};

export default withAuth(HistoryPage);
 
