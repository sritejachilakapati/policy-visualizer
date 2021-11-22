import React, { useState, useEffect } from 'react';
import { Col, Container, Row, Form, Button } from 'react-bootstrap';
import '../assets/styles/LandingPage.css';
import { fetchPolicies } from '../config';
import Loading from './LoadingComponent';
import RenderTable from './RenderTable';

function LandingPage() {
  const [placeholderText, setPlaceHolder] = useState('Enter the filter value');
  const [viewPortWidth, setWidth] = useState(window.innerWidth);
  const [policyList, setPolicies] = useState(null);
  const [isloading, setLoading] = useState(false);
  const [error, setError] = useState({isError: false, message: ''});

  const updateMedia = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, [viewPortWidth]);

  const placeHolders = {
    policy: 'Enter the Policy ID',
    customer: 'Enter the Customer ID'
  }

  const handleChange = (e) => {
    setPlaceHolder(placeHolders[e.target.value]);
  }

  const size = viewPortWidth >= 1200 ? {size: 'lg'} : viewPortWidth >= 768 ? {} : {size: 'sm'};

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    fetchPolicies(e.target.filter.value, e.target.filterBy.value)
    .then(policies => {
      setPolicies(policies);
      setLoading(false);
    })
    .catch(err => {
      setError({isError: true, message: err.message});
    })
  }

  return (
    <div className='landing-bg'>
      <Container>
        <div className='d-flex align-items-center justify-content-center' style={{height: '94vh'}}>
          <div className='main' style={{width: '100%'}}>
            <Row className='justify-content-center'>
              <Col xs='12' className='d-flex justify-content-center'>
                <p className='landing-heading'>Search for a policy</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} className='d-flex justify-content-center'>
                <Form onSubmit={handleSubmit} style={{width: '100%'}}>
                  <Row className='d-flex justify-content-center gx-0'>
                    <Col xs={8} md={8}>
                      <Form.Control {...size} type='text' placeholder={placeholderText} required name='filter' id='filter' />
                    </Col>
                    <Col xs={4} md={3}>
                      <Form.Select {...size} name='filterBy' id='filterBy' defaultValue='' required onChange={handleChange}>
                        <option value='' hidden disabled>Search by attribute</option>
                        <option value='policy'>Policy ID</option>
                        <option value='customer'>Customer ID</option>
                      </Form.Select>
                    </Col>
                    <Col xs={12} md={1}>
                      <center><Button {...size} variant='primary' type='submit'>Search</Button></center>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
            {isloading ? (<Loading />) : error.isError ? (<p>{error.message}</p>) : null }
            {policyList ? (
            <div>
              <hr />
              <center><h4>{policyList.length} {policyList.length === 1 ? 'policy' : 'policies'} found</h4></center>
              {policyList.length ? <RenderTable key={policyList} policyList={policyList} /> : null}      
            </div>
            ) : null}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default LandingPage;
