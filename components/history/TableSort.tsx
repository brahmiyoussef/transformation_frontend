import { useState, useEffect } from 'react';
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
} from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react';
 
interface RowData {
  filename: string;
  inputType: string;
  outputType: string;
  timestamp: string;
  id: string;
}
 
interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}
 
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
 
function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    Object.keys(item).some((key) =>
      item[key as keyof RowData].toString().toLowerCase().includes(query)
    )
  );
}
 
function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;
 
  if (!sortBy) {
    return filterData(data, payload.search);
  }
 
  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }
 
      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}
 
interface TableSortProps {
  data: RowData[];
  onShowOutput: (id: string) => void;
}
 
export function TableSort({ data, onShowOutput }: TableSortProps) {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>('timestamp');
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
 
  useEffect(() => {
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
              <Table.Td colSpan={data.length > 0 ? Object.keys(data[0]).length : 5}>
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
 
 