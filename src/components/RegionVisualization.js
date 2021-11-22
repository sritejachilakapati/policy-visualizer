import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { fetchPolicies } from '../config';
import '../assets/styles/RegionVisualization.css';
import RenderChart from './RenderChart';
import Loading from './LoadingComponent';

function RegionVisualization() {

  const [policyData, setPolicies] = useState(null);
  const [viewPortWidth, setWidth] = useState(window.innerWidth);
  const [isloading, setLoading] = useState(false);
  const [error, setError] = useState({isError: false, message: ''});
  const [region, setRegion] = useState(null);

  const updateMedia = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, [viewPortWidth]);

  const size = viewPortWidth >= 1200 ? {size: 'lg'} : viewPortWidth >= 768 ? {} : {size: 'sm'};

  const handleSubmit = (e) => {
    let region = e.target.region.value;
    e.preventDefault();
    setLoading(true);
    setError(false);
    fetchPolicies(region, 'region')
    .then(policies => {
      let policyCount = policies.reduce((a,b) => a+b);
      setPolicies({policies, policyCount});
      setRegion(region);
      setLoading(false);
    })
    .catch(err => {
      setError({isError: true, message: err.message});
    })
  }

  return (
    <div className='region-bg'>
      <Container className='region-container'>
        <div className='d-flex pt-5 justify-content-center' style={{height: '94vh', overflow: 'hidden'}}>
          <div className='main' style={{width: '100%'}}>
            <Row className='justify-content-center'>
              <Col xs='12' className='d-flex justify-content-center'>
                <p className='region-heading'>Region wise Visualization</p>
              </Col>
            </Row>
            <Row>
              <Col xs={12} className='d-flex justify-content-center'>
              <Form onSubmit={handleSubmit} style={{width: '100%'}}>
                  <Row className='d-flex justify-content-center'>
                    <Col xs={7}>
                      <Form.Select {...size} name='region' id='region' defaultValue='' required>
                        <option value='' hidden disabled>Select a Region</option>
                        {['North','East','West','South'].map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col xs={1}>
                      <center><Button {...size} variant='primary' type='submit'>Search</Button></center>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
            {isloading ? (<Loading />) : error.isError ? (<p>{error.message}</p>) : null }
            {policyData && policyData.policies ? (
              <div>
                <hr />
                <center><h4>{policyData.policyCount} {policyData.policyCount === 1 ? 'policy' : 'policies'} found</h4></center>
                {policyData.policyCount ? <RenderChart key={policyData.policies} region={region} policyList={policyData.policies} /> : null}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default RegionVisualization
