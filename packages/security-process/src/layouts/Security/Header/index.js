import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { Icon, Image } from 'blockchain-info-components'
import { Navbar, NavbarBrand } from 'components/Navbar'

const White = styled.div`
  color: white;

  a:link {
    color: white;
  }

  a:visited {
    color: white;
  }
`

const Dashboard = styled.div`
  padding-right: 25px;
`

const Header = props => {
  const onCloseClick = event => {
    props.dispatch({
      type: `ROOT_LOCATION_CHANGE`,
      payload: {
        action: `PUSH`,
        location: { hash: ``, pathname: `/home`, search: `` }
      }
    })

    event.preventDefault()
  }

  return (
    <React.Fragment>
      <White>
        <Navbar height='90px'>
          <NavbarBrand>
            <Link to='/'>
              <Image name='blockchain-vector' height='20px' />
            </Link>
          </NavbarBrand>
          <Dashboard>
            <Icon
              name='close-bold'
              onClick={onCloseClick}
              size='16px'
              weight={400}
              color='white'
              cursor
            />
          </Dashboard>
        </Navbar>
      </White>
    </React.Fragment>
  )
}

export default connect()(Header)
