import React from 'react';
import { Alert, Button } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

type CustomAlertProps = {
  message: string;
  onClose: () => void;
};

const CustomAlert: React.FC<CustomAlertProps> = ({ message, onClose }) => {
  return (
    <Alert
      icon={<IconAlertCircle size={16} />}
      title="Error"
      color="red"
      withCloseButton
      onClose={onClose}
      closeButtonLabel="Close alert"
      radius="md"
      mb="lg"
    >
      {message}
      <Button variant="subtle" onClick={onClose} ml="md">
        &times;
      </Button>
    </Alert>
  );
};

export default CustomAlert;
