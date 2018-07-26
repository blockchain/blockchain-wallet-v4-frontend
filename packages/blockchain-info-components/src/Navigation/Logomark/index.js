import React from 'react'
import styled from 'styled-components'

import BCLogo from './logotype.component.svg'

const Logo = styled(BCLogo)`
  margin-right: 2rem;

  height: ${props => (props.height ? props.height : '1.2rem')};

  @media only screen and (max-width: 48rem) {
    height: ${props => (props.height ? props.height : '1rem')};
  }

  .logomark-color {
    fill: ${props =>
      props.color ? props.color : props.theme ? props.theme.main : 'white'};
  }
`

const Logomark = props => <Logo height={props.height} color={props.color} />

export default Logomark
