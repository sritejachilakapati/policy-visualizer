import React, { useMemo, useState } from 'react';
import { Table, ButtonGroup, Button, Modal, Row, Col, Form, Alert } from 'react-bootstrap';
import '../assets/styles/RenderPolicies.css';
import { useTable, usePagination } from 'react-table';
import { format } from 'date-fns';
import { API } from '../config'

const properCase = (str) => {
  return str.split(' ')
   .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
   .join(' ')
}

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

  const [policies, setPolicies] = useState(policyList); //store policy list in a state/set state to force a re render

  const [show, setShow] = useState(false); //Modal state
  const [record, setRecord] = useState(null); //Selected record
  const [isEditable, setEditable] = useState(false); //Editing Premium
  const [successShow, setSuccess] = useState(false); //Success alert
  const [failureShow, setFailure] = useState({show: false, message: ''}); //Failure Alert

  //Modal handling functions
  const handleClose = () => {
    setEditable(false);
    setShow(false);
    setSuccess(false);
    setFailure({show: false, message: ''});
  }

  const handleEdit = (e) => {
    e.preventDefault();
    setEditable(true);
  }

  const handleShow = (id) => {
    let selectedPolicy = policies.filter(policy => policy.POLICY_ID === id)[0];
    setRecord(selectedPolicy);
    setShow(true);
  }

  //form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(false);
    setFailure({show: false, message: ''});
    let premium = Number(e.target.premium.value);
    if (premium === record.PREMIUM) {
      //do nothing
    }
    else if(premium > 1000000 || premium < 0) {
      setFailure({show: true, message: 'The premium must be greater than zero and less than 1 million'});
    }
    else if(isNaN(premium)) {
      setFailure({show: true, message: 'The premium must be a number between 0 and 1 million'});
    }
    else {
      const URI = API + record.POLICY_ID;
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({premium: e.target.premium.value})
      }
      fetch(URI, options)
      .then(res => res.json())
      .then(policy => {
        setRecord({...record, PREMIUM: policy[0].PREMIUM});
        var updatedPolicies = JSON.parse(JSON.stringify(policies)); //deep copy current state so we can mutate and set updated state.
        policies.forEach((oldPolicy, index) => {
          if(oldPolicy.POLICY_ID === policy[0].POLICY_ID) {
            updatedPolicies[index].PREMIUM = policy[0].PREMIUM; //update premium in copy of state
          }
        });
        setPolicies(updatedPolicies); //setting state to updated list
        setSuccess(true);
      })
      .catch(err => {
        setFailure({show: true, message: 'Your request couldn\'t be processed at this time. Please try again later'});
      })
      .finally(() => setEditable(false)); //close modal
    }
  }
  
  //useTable requirements
  var columns = useMemo(() => COLUMNS,[]);
  var data = useMemo(() => policies ? policies : [], [policies]); //initialize data to empty array if no policies initially

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
      {/* Modal */}
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Policy Details</Modal.Title>
        </Modal.Header>
        {record ? (
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className='my-2'>
              <Col xs={4}>Policy ID</Col>
              <Col xs={1}>{':'}</Col>
              <Col xs={7}>{record.POLICY_ID}</Col>
            </Row>
            <Row className='my-2'>
              <Col xs={4}>Customer ID</Col>
              <Col xs={1}>{':'}</Col>
              <Col xs={7}>{record.CUSTOMER_ID}</Col>
            </Row>
            <Row className='my-2'>
              <Col xs={4}>Date of Purchase</Col>
              <Col xs={1}>{':'}</Col>
              <Col xs={7}>{format(new Date(record.DATE_OF_PURCHASE), 'MMM do, yyyy')}</Col>
            </Row>
            <Row className='my-2'>
              <Col xs={4}>Vehicle Fuel</Col>
              <Col xs={1}>{':'}</Col>
              <Col xs={7}>{record.FUEL}</Col>
            </Row>
            <Row className='my-2'>
              <Col xs={4}>Vehicle Segment</Col>
              <Col xs={1}>{':'}</Col>
              <Col xs={7}>{record.SEGMENT}</Col>
            </Row>
            <Row className='my-2'>
              <Col xs={4}>Premium Paid</Col>
              <Col xs={1}>{':'}</Col>
              <Col xs={7}>{
              isEditable ? (
              <Form.Control size='sm' type='text' name='premium' id='premium' defaultValue={record.PREMIUM} />
              ) : record.PREMIUM
              }
              </Col>
            </Row>
            <Row className='my-2'>
              <Col xs={4}>Benefits Covered</Col>
              <Col xs={1}>{':'}</Col>
              <Col xs={7}>
                {['BODILY_INJURY_LIABILITY',
                  'PERSONAL_INJURY_PROTECTION',
                  'PROPERTY_DAMAGE_LIABILITY',
                  'COLLISION',
                  'COMPREHENSIVE'].map(benefit => (
                    <span key={benefit}>{record[benefit] ? properCase(benefit.replaceAll('_', ' ')) + ', ' : null}</span>
                  ))
                }
              </Col>
            </Row>
            <Row className='my-2'>
              <Col xs={4}>Customer Gender</Col>
              <Col xs={1}>{':'}</Col>
              <Col xs={7}>{record.GENDER}</Col>
            </Row>
            <Row className='my-2'>
              <Col xs={4}>Customer Income Group</Col>
              <Col xs={1}>{':'}</Col>
              <Col xs={7}>{record.INCOME_GROUP}</Col>
            </Row>
            <Row className='my-2'>
              <Col xs={4}>Customer Region</Col>
              <Col xs={1}>{':'}</Col>
              <Col xs={7}>{record.REGION}</Col>
            </Row>
            <Row className='my-2'>
              <Col xs={4}>Customer Marital Status</Col>
              <Col xs={1}>{':'}</Col>
              <Col xs={7}>{record.MARITAL_STATUS ? 'Married' : 'Unmarried'}</Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Alert show={successShow} key='success' variant='success' dismissible onClose={() => setSuccess(false)}>
              Your request has been completed successfully.
            </Alert>
            <Alert show={failureShow.show} key='failure' variant='danger' dismissible onClose={() => setFailure({...failureShow, show: false})}>
              {failureShow.message}
            </Alert>
            {isEditable ? (
            <Button variant='success' type='submit'>Save Changes</Button>
            ) : (
            <Button variant='primary' type='button' onClick={handleEdit}>Edit Premium</Button>
            )}
            <Button variant='secondary' type='button' onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Form>) : null }
      </Modal>


      <div className='d-flex justify-content-end'>
        <button className='btn btn-info' onClick={() => window.location.reload(false)}>Clear Query</button>
      </div>
      <Table size='sm' {...getTableProps()} responsive striped hover>
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
                <td><Button variant='link' onClick={() => handleShow(row.cells[0].value)}>Details</Button></td>
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

export default RenderTable;
