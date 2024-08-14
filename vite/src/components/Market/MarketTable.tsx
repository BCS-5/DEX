import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useTable, useSortBy, useGlobalFilter } from 'react-table';
import styled from 'styled-components';

interface Market {
  market: string;
  status: string;
  baseAsset: string;
  quoteAsset: string;
  indexPrice: string;
  oraclePrice: string;
  priceChange24H: string;
  volume24H: string;
  openInterest: string;
}

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-family: 'Inter', sans-serif;
  background-color: #1c1c28;
  color: #ffffff;
`;

const Th = styled.th`
  padding: 12px;
  text-align: left;
  background-color: #2a2a3c;
  cursor: pointer;
  &:hover {
    background-color: #3a3a4c;
  }
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #2a2a3c;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  background-color: #2a2a3c;
  color: #ffffff;
  border: none;
  border-radius: 4px;
`;

const MarketTable: React.FC = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarkets = async () => {
    try {
      const response = await axios.get('https://api.dydx.exchange/v3/markets');
      const marketsArray = Object.values(response.data.markets) as Market[];
      const sortedMarkets = marketsArray.sort((a, b) => parseFloat(b.volume24H) - parseFloat(a.volume24H));
      setMarkets(sortedMarkets);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch markets');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();

    const ws = new WebSocket('wss://api.dydx.exchange/v3/ws');
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'subscribe',
        channel: 'v3_markets',
      }));
    };
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'channel_data') {
          setMarkets((prevMarkets) => {
            const updatedMarkets = prevMarkets.map(market => 
              market.market === data.id ? { ...market, ...data.contents } : market
            );
            return updatedMarkets.sort((a, b) => parseFloat(b.volume24H) - parseFloat(a.volume24H));
            });
        }
    };

    return () => {
      ws.close();
    };
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: 'Market',
        accessor: 'market',
      },
      {
        Header: 'Index Price',
        accessor: 'indexPrice',
        Cell: ({ value }: { value: string }) => parseFloat(value).toFixed(2),
      },
      {
        Header: 'Oracle Price',
        accessor: 'oraclePrice',
        Cell: ({ value }: { value: string }) => parseFloat(value).toFixed(2),
      },
      {
        Header: '24h Change',
        accessor: 'priceChange24H',
        Cell: ({ value }: { value: string }) => `${parseFloat(value).toFixed(2)}%`,
      },
      {
        Header: '24h Volume',
        accessor: 'volume24H',
        Cell: ({ value }: { value: string }) => `$${parseInt(value).toLocaleString()}`,
        sortType: (rowA, rowB) => parseFloat(rowB.original.volume24H) - parseFloat(rowA.original.volume24H),
      },
      {
        Header: 'Open Interest',
        accessor: 'openInterest',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: markets,
      initialState: { 
        sortBy: [{ id: 'volume24H', desc: true }]
      },
      disableSortRemove: true,
    },
    useGlobalFilter,
    useSortBy
  );

  const { globalFilter } = state;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Input
        value={globalFilter || ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search markets..."
      />
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </Th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default MarketTable;