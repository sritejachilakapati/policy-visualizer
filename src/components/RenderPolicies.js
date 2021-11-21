import React, { useMemo } from 'react';
import { Table, ButtonGroup, Button } from 'react-bootstrap';
import '../assets/styles/RenderPolicies.css';
import { useTable, usePagination } from 'react-table';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

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
    accessor: 'DATE_OF_PURCHASE',
    Cell: ({ value }) => format(new Date(value), 'MMM do, yyyy')
  },
  {
    Header: 'Customer Region',
    accessor: 'REGION'
  }
];

const RenderTable = ({policyList}) => {
  
  const columns = useMemo(() => COLUMNS,[]);
  const data = useMemo(() => policyList, [policyList]);

  const { 
    getTableProps, 
    getTableBodyProps, 
    headerGroups, 
    page, 
    prepareRow, 
    nextPage, 
    previousPage, 
    canNextPage, 
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount
  } = useTable({columns, data}, usePagination);

  return (
    <>
      <div className='d-flex justify-content-end'>
        <button className='btn btn-info' onClick={() => window.location.reload(false)}>Clear</button>
      </div>
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
          {page.map(row => {
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
      <center>
        <ButtonGroup>
          <Button variant='primary' onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</Button>
          <Button variant='primary' onClick={() => previousPage()} disabled={!canPreviousPage}>Prev</Button>
          <Button variant='primary' onClick={() => nextPage()} disabled={!canNextPage}>Next</Button>
          <Button variant='primary' onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</Button>
        </ButtonGroup>
      </center>
      <div className='d-flex justify-content-end'>
        <span>
          Page{' '}<strong>{state.pageIndex + 1} of {pageOptions.length}</strong>
        </span>
      </div>
    </>
  )
}

function RenderPolicies({policyList}) {

  return (
    <div>
      <hr />
      <center><h4>{policyList.length} {policyList.length === 1 ? 'policy' : 'policies'} found</h4></center>
      {policyList.length ? <RenderTable policyList={policyList} /> : null}      
    </div>
  )
}

export default RenderPolicies
