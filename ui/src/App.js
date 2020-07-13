import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.png';
import './App.css';
import {
  useTable,
  useSortBy,
  useFilters,
} from 'react-table'

import config from './config.js';

function App() {

  const [rawData, setRawData] = useState([]);

  useEffect(() => {

    async function getAPI() {
      let result = await axios(
        config.apiURL,
      );
      console.log(result.data);
      setRawData(result.data);
    }

    getAPI();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'URL',
        accessor: 'url', 
        filter: "text",
      },
      {
        Header: 'Edmo Code',
        accessor: 'edmo_code',
        filter: "text",
      },
      {
        Header: 'Version',
        accessor: 'version',
        filter: "text",
      },
      {
        Header: 'Date',
        accessor: 'datetime',
        filter: "text",
      },
    ],
    []
  )

  const data = React.useMemo(
    () => rawData, [rawData]
  )

  // Based on react-table official documentation examples
 function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) 
      }}
      placeholder={`Search ${count} items...`}
    />
  )
}

const filterTypes = React.useMemo(
  () => ({
    text: (rows, id, filterValue) => {
      return rows.filter(row => {
        const rowValue = row.values[id]
        return rowValue !== undefined
          ? String(rowValue)
              .toLowerCase()
              .includes(String(filterValue).toLowerCase())
          : true
      })
    },
  }),
  []
)

const defaultColumn = React.useMemo(
  () => ({

    Filter: DefaultColumnFilter,
  }),
  []
)


  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data, defaultColumn, filterTypes, }, useFilters, useSortBy)


  return (
    <div className="col-8 mx-auto">
      <h4 style={{ color: "#686868" }} className="pt-4 text-center"><img className="mr-2" src={logo} alt="seadatanet" height="60" /><span>SeaDataCloud</span> Replication Manager Version status</h4>
      <table className="table table-striped table-hover table-light" {...getTableProps()}>
        <thead className="thead-light">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th  {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' ▼'
                        : ' ▲'
                      : ''}
                  </span>
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}
                  className={(cell.value==="Unknown") ? "text-grey" : "text-normal"}  
                  >{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
