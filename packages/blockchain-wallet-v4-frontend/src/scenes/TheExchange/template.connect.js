import React from 'react'
import styled from 'styled-components'

const BorderWrapper = styled.div`
  height: 340px;
  width: 330px;
  border: solid 1px ${props => props.theme.grey000};
  border-radius: 8px;
`

const ExchangeConnect = () => {
  return <BorderWrapper />
}

export default ExchangeConnect
