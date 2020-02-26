import { Icon } from 'blockchain-info-components'
import { transparentize } from 'polished'
import styled from 'styled-components'

const NavbarIcon = styled(Icon)`
  transition: color 0.3s;
  color: ${props => transparentize(0.3, props.theme.white)};
  &:hover {
    color: ${props => props.theme.white};
  }
`

export default NavbarIcon
