import React from 'react'
import * as ReactBootstrap from 'react-bootstrap'

const Navbar = (props) => (<ReactBootstrap.Navbar {...props} />)

const NavbarHeader = (props) => (<ReactBootstrap.Navbar.Header {...props} />)

const NavbarBrand = (props) => (<ReactBootstrap.Navbar.Brand {...props} />)

const NavbarToggle = (props) => (<ReactBootstrap.Navbar.Toggle {...props} />)

const NavbarCollapse = (props) => (<ReactBootstrap.Navbar.Collapse {...props} />)

const Nav = (props) => (<ReactBootstrap.Nav {...props} />)

const NavItem = (props) => (<ReactBootstrap.NavItem {...props} />)

const NavDropdown = (props) => (<ReactBootstrap.NavDropdown {...props} />)

const MenuItem = (props) => (<ReactBootstrap.MenuItem {...props} />)

export { Navbar, NavbarHeader, NavbarBrand, NavbarToggle, NavbarCollapse, Nav, NavItem, NavDropdown, MenuItem }
