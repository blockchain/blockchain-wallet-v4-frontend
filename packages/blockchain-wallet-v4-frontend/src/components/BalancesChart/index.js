import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

export const ColourBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${props => props.theme[props.color]};
`
export const CoinBalance = styled.div`
  cursor: pointer;
  font-size: 14px;
`
export const ViewAllText = styled(Text)`
  color: ${props => props.theme['brand-secondary']};
  text-decoration-color: ${props => props.theme['brand-secondary']};
  cursor: pointer;
`
export const WalletLink = styled(NavLink)`
  cursor: pointer;
  color: ${props => props.theme['brand-secondary']};
  font-size: 10px;
  font-weight: 300;
  font-family: 'Montserrat', sans-serif;
  text-decoration: none;
`
