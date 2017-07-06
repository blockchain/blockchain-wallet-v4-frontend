import styled from 'styled-components'
import * as ReactBootstrap from 'react-bootstrap'

const HelpBlock = styled(ReactBootstrap.HelpBlock)`
  text-align: justify;
  & > * { display: inline-block; margin-right: 5px; }
`

export default HelpBlock
