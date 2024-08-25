import React from 'react';
import { FileInput, Select, Group } from '@mantine/core';

type FileUploadFormProps = {
  handleFileChange: (file: File | null) => void;
  fromFormat: string;
  setFromFormat: (value: string) => void;
  toFormat: string;
  setToFormat: (value: string) => void;
};

const FileUploadForm: React.FC<FileUploadFormProps> = ({
  handleFileChange,
  fromFormat,
  setFromFormat,
  toFormat,
  setToFormat,
}) => {
  return (
    <div>
      <FileInput
        label="Upload File"
        placeholder="Choose a file"
        onChange={handleFileChange} 
        required
        mt="md"
      />
      <Group mt="lg">
        <Select
          label="From Format"
          value={fromFormat}
          onChange={(value) => setFromFormat(value!)}
          data={[
            { value: 'xml', label: 'XML' },
            { value: 'json', label: 'JSON' },
          ]}
          required
        />
        <Select
          label="To Format"
          value={toFormat}
          onChange={(value) => setToFormat(value!)}
          data={[
            { value: 'xml', label: 'XML' },
            { value: 'json', label: 'JSON' },
          ]}
          required
        />
      </Group>
    </div>
  );
};

export default FileUploadForm;
