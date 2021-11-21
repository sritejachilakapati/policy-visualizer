import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { fetchPolicies } from '../config';
import '../assets/styles/RegionVisualization.css';
import RenderChart from './RenderChart';

function RegionVisualization() {

  const [policies, setPolicies] = useState(null);
  const [viewPortWidth, setWidth] = useState(window.innerWidth);

  const updateMedia = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, [viewPortWidth]);

  const size = viewPortWidth >= 1200 ? {size: 'lg'} : viewPortWidth >= 768 ? {} : {size: 'sm'};

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchPolicies(e.target.region.value, 'region')
    .then(policies => setPolicies(policies))
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
            {policies ? (
              <div>
                <hr />
                <center><h4>{policies.length} {policies.length === 1 ? 'policy' : 'policies'} found</h4></center>
                {policies.length ? <RenderChart policyList={policies} /> : null}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default RegionVisualization
