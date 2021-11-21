import React, { useMemo } from 'react';
import { Table } from 'react-bootstrap';
import '../assets/styles/RenderPolicies.css';
import { useTable } from 'react-table';
import { Link } from 'react-router-dom';

const COLUMNS = [
  {
    Header: 'Policy ID',
    accessor: 'POLICY_ID'
  },
  {
    Header: 'Customer ID',
    accessor: 'CUSTOMER_ID'
  },
  {
    Header: 'Premium Paid',
    accessor: 'PREMIUM'
  },
  {
    Header: 'Date of Purchase',
    accessor: 'DATE_OF_PURCHASE'
  },
  {
    Header: 'Customer Region',
    accessor: 'REGION'
  }
];

const RenderTable = ({policyList}) => {
  
  const columns = useMemo(() => COLUMNS,[]);
  const data = useMemo(() => policyList, [policyList]);

  const tableInstance = useTable({columns, data});

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <Table {...getTableProps()} responsive striped hover>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(header => (
              <th {...header.getHeaderProps()}>{header.render('Header')}</th>
            ))}
            <th>Details</th>
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
              {console.log(row.cells)}
              <td><Link to={`/detail/${row.cells[0].value}`}>Details</Link></td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

function RenderPolicies({policyList}) {

  return (
    <div>
      <hr />
      <center><h3>{policyList.length} {policyList.length === 1 ? 'policy' : 'policies'} found</h3></center>

      {policyList.length ? <RenderTable policyList={policyList} /> : null}      
    </div>
  )
}

export default RenderPolicies
