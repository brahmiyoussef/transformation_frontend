import React, { useState } from 'react';
import axios from 'axios';
import { Container, Button, Card, Title, Textarea, Flex } from '@mantine/core';
import FileUploadForm from '../components/convert/FileuploadForm';
import { NavbarMinimal } from '../components/Navbar/NavbarMinimal';
import styles from './convert.module.css';
import Cookies from 'js-cookie';
import withAuth from './withAuth';
 

function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fromFormat, setFromFormat] = useState<string>('xml');
  const [toFormat, setToFormat] = useState<string>('json');
  const [convertedContent, setConvertedContent] = useState<string | null>(null);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleConvert = async () => {
    if (!file || !fromFormat || !toFormat) {
      alert('Please select a file and specify both formats.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const authToken = Cookies.get('authToken');
      const response = await axios.post(`http://localhost:8081/api/convert/${fromFormat}/${toFormat}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Convert response data to string
      const responseData = typeof response.data === 'object' ? JSON.stringify(response.data, null, 2) : response.data;
      setConvertedContent(responseData);
    } catch (error) {
      console.error('Error converting file:', error);
      alert('Error converting file: ' + (error as Error).message);
    }
    
  };

  return (
    <Flex style={{ height: '100vh' }}>
    <div style={{ width: '250px', flexShrink: 0 }}>
      <NavbarMinimal />
    </div>
    <Container className={styles.container}>
      <Card className={styles.card}>
        <Title className={styles.title}>File Conversion Service</Title>
  
        <FileUploadForm
          handleFileChange={handleFileChange}
          fromFormat={fromFormat}
          setFromFormat={setFromFormat}
          toFormat={toFormat}
          setToFormat={setToFormat}
        />
  
        <div className={styles['button-container']}>
          <Button onClick={handleConvert} className={styles.button}>
            Convert
          </Button>
        </div>
  
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
      </Card>
    </Container>
  </Flex>
  
  );
}

export default withAuth(ConvertPage);
 
 