import { Icon } from 'blockchain-info-components'
import styled from 'styled-components'

const NavbarIcon = styled(Icon)`
  transition: color 0.3s;
  color: ${props => props.theme.whiteFade700};
  &:hover {
    color: ${props => props.theme.whiteFade900};
  }
`

export default NavbarIcon
