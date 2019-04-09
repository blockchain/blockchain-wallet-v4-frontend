import React from 'react'
import styled from 'styled-components'
import { Image } from 'blockchain-info-components'

const Wrapper = styled.div`
  overflow: hidden;
  position: absolute;
  top: 105px;
  right: 20px;
`
const BaseImage = styled(Image)`
  width: 280px;
  height: auto;
  color: auto;
`
const BaseColor = styled(Image)`
  left: 0;
  opacity: 0;
  position: absolute;
  transition: opacity 0.5s;
  &.active {
    opacity: 1;
  }
`

class BuySellAnimation extends React.PureComponent {
  render () {
    return (
      <Wrapper>
        <BaseImage name='buy-sell-grey' />
        <BaseColor name='buy-sell-color' className={'active'} />
      </Wrapper>
    )
  }
}

export default BuySellAnimation
