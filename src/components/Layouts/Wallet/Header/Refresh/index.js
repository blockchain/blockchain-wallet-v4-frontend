import React from 'react'
import styled from 'styled-components'

import { NavItem } from 'blockchain-info-components'
import refresh from 'img/refresh.svg'

const Image = styled.img.attrs({
  src: refresh
})`
  height: 15px;
`

const Refresh = () => (
  <NavItem>
    <Image />
  </NavItem>
)

export default Refresh
