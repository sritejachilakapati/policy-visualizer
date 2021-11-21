import React, { useState, useEffect } from 'react';
import { Col, Container, Row, Form, Button } from 'react-bootstrap';
import '../assets/styles/LandingPage.css';
import { API } from '../config';
import RenderPolicies from './RenderPolicies';

function LandingPage() {
  const [placeholderText, setPlaceHolder] = useState('Enter the filter value');
  const [viewPortWidth, setWidth] = useState(window.innerWidth);
  const [policyList, setPolicies] = useState(null)

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

  const fetchPolicies = (e) => {
    e.preventDefault();
    let filter = e.target.filter.value;
    let paramsObj = { filterBy: e.target.filterBy.value };

    const URI = API + filter + '?' + new URLSearchParams(paramsObj);
    fetch(URI)
    .then(res => res.json())
    .then(policies => setPolicies(policies));
  }

  return (
    <div className='landing-bg'>
      <Container>
        <div className='d-flex align-items-center justify-content-center' style={{height: '100vh'}}>
          <div className='main' style={{width: '100%'}}>
            <Row className='justify-content-center'>
              <Col xs='12' className='d-flex justify-content-center'>
                <p className='heading'>Search for a policy</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} className='d-flex justify-content-center'>
                <Form onSubmit={fetchPolicies} style={{width: '100%'}}>
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
              {policyList ? (<RenderPolicies policyList={policyList} />) : null}
            </Row>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default LandingPage;