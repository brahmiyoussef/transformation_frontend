// TableSortAdmin.tsx
import React from 'react';
import { Table, ScrollArea, UnstyledButton, Group, Text, Center, rem, TextInput } from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react';

// Define RowData interface
interface RowData {
  filename: string;
  inputType: string;
  outputType: string;
  timestamp: string;
  id: string;
  userName: string;
  user:string,
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

interface TableSortProps {
  data: RowData[];
  onShowOutput: (id: string) => void;
}

// Th component for table headers
function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th>
      <UnstyledButton onClick={onSort}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

// Utility function to filter data based on search query
function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter(item =>
    Object.values(item).some(value =>
      value.toString().toLowerCase().includes(query)
    )
  );
}

// Utility function to sort and filter data
function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy, reversed, search } = payload;

  // Filter data based on search
  const filteredData = filterData(data, search);

  // If no sortBy is provided, return filtered data
  if (!sortBy) {
    return filteredData;
  }

  // Sort data based on sortBy field
  return filteredData.sort((a, b) => {
    if (reversed) {
      return b[sortBy].localeCompare(a[sortBy]);
    }
    return a[sortBy].localeCompare(b[sortBy]);
  });
}

// TableSortAdmin component
function TableSortAdmin({ data, onShowOutput }: TableSortProps) {
  const [search, setSearch] = React.useState('');
  const [sortedData, setSortedData] = React.useState(data);
  const [sortBy, setSortBy] = React.useState<keyof RowData | null>('timestamp');
  const [reverseSortDirection, setReverseSortDirection] = React.useState(false);

  React.useEffect(() => {
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search }));
  }, [data, sortBy, reverseSortDirection, search]);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.filename}</Table.Td>
      <Table.Td>{row.inputType}</Table.Td>
      <Table.Td>{row.outputType}</Table.Td>
      <Table.Td>{new Date(row.timestamp).toLocaleString()}</Table.Td>
  
      <Table.Td>{row.userName}</Table.Td>
      <Table.Td>
        <button onClick={() => onShowOutput(row.id)}>Show Output</button>
      </Table.Td>
    </Table.Tr>
  ));
  

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
        <Table.Tbody>
          <Table.Tr>
            <Th sorted={sortBy === 'filename'} reversed={reverseSortDirection} onSort={() => setSorting('filename')}>
              File Name
            </Th>
            <Th sorted={sortBy === 'inputType'} reversed={reverseSortDirection} onSort={() => setSorting('inputType')}>
              From Format
            </Th>
            <Th sorted={sortBy === 'outputType'} reversed={reverseSortDirection} onSort={() => setSorting('outputType')}>
              To Format
            </Th>
            <Th sorted={sortBy === 'timestamp'} reversed={reverseSortDirection} onSort={() => setSorting('timestamp')}>
              Uploaded At
            </Th>
            <Th sorted={sortBy === 'userName'} reversed={reverseSortDirection} onSort={() => setSorting('userName')}>
              User Name
            </Th>
            <Th reversed={false} sorted={false} onSort={() => {}}>
            Show Output
            </Th>
          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={Object.keys(data[0] || {}).length + 1}>
                <Text fw={500} ta="center">
                  Nothing found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}

export { TableSortAdmin };
