import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function NavbarComponent() {
  return (
    <Navbar collapseOnSelect expand='md' bg='dark' variant='dark'>
      <Container>
        <Navbar.Brand href='/'>Policy Visualizer</Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='ms-auto'>
            <NavLink className='nav-link' to='/'>Home</NavLink>
            <NavLink className='nav-link' to='/visualize'>Region-wise Visualization</NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavbarComponent;
