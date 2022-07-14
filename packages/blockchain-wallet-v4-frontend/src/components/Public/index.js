import { AbstractPlugin } from 'plugin/internal'
import styled from 'styled-components'

import { media } from 'services/styles'

const { isPlugin } = AbstractPlugin

export const Wrapper = styled.div`
  padding: ${isPlugin() ? '24px' : '32px'};
  border-radius: 8px;
  box-sizing: border-box;
  background-color: ${(props) => props.theme.white};
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.21);
  width: ${isPlugin() ? '360px' : '480px'};
  height: ${isPlugin() && '600px'};

  ${media.tablet`
    width: 100%;
  `}
  ${media.mobile`
    padding: 20px;
  `}
`

export default Wrapper
