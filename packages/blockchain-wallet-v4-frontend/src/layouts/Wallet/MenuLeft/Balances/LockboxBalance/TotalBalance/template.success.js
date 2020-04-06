import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  text-align: right;
  color: ${props => props.theme.grey700};
  font-size: ${props => (props.large ? '20px' : '12px')};
  font-weight: ${props => (props.large ? '200' : '300')};
  padding-right: ${props => (props.large ? '15px' : '25px')};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  span {
    text-transform: capitalize;
    &:last-child {
      margin-left: 10px;
      color: ${props => props.theme['grey400']};
    }
  }
`

const Success = props => <Wrapper large>{props.totalBalance}</Wrapper>

export default Success
