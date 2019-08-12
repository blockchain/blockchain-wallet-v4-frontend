import React from 'react'
import { propOr } from 'ramda'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  background-color: ${props => props.theme['white']};
  opacity: ${props => {
    if (!props.active) {
      return 0
    } else {
      return 1
    }
  }};
  transform: ${props => {
    if (!props.active) {
      return 'translateX(40px)'
    } else {
      return 'translateX(0)'
    }
  }};

  transition: opacity 1s ease-in-out, transform 1s ease-in-out;

  @media (min-width: 768px) {
    width: 450px;
    border-radius: 8px;
  }
`
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 65px;
  padding: 15px 10px;
  box-sizing: border-box;
  background: ${props => props.theme['white']};
  border-left: 6px solid ${props => props.theme[props.color]};
  border-radius: 8px;
  box-shadow: 5px 5px 8px rgba(0, 0, 0, 0.2);
`
const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex: 100%;
  margin-right: 10px;
  box-sizing: border-box;
`
const CustomIcon = styled(Icon)`
  font-size: 24px;
  margin-right: 10px;
`
const CloseIcon = styled(Icon)`
  margin-right: 8px;
  &:hover {
    color: red;
  }
`

const selectColor = (type, coin) => {
  switch (type) {
    case 'success':
      return 'success'
    case 'error':
      return 'error'
    case 'warn':
      return 'orange'
    default:
      return propOr('brand-secondary', 'colorCode', coin)
  }
}

class Toast extends React.PureComponent {
  state = {
    active: false
  }

  componentDidMount () {
    const { persist, timeout } = this.props
    // ease in here and check what are the props (persist, timeout)
    setTimeout(() => {
      this.setState({ active: true })
    }, 10)
    if (!persist) {
      setTimeout(() => {
        this.setState({ active: false })
      }, timeout - 1000)
    }
  }

  componentDidUpdate () {
    const { id, onClose } = this.props
    if (!this.state.active) {
      setTimeout(() => {
        onClose(id)
      }, 1000)
    }
  }

  render () {
    const { children, nature, id, coin, onClose } = this.props
    const color = selectColor(nature, coin)

    return (
      <Wrapper active={this.state.active}>
        <Container color={color} data-e2e='toastMessage'>
          <Content>
            {coin && (
              <CustomIcon
                name={coin.icons.circleFilled}
                color={coin.colorCode}
              />
            )}
            {children}
          </Content>
          <CloseIcon
            data-e2e='toastMessageClose'
            name='close'
            size='14px'
            weight={600}
            color='gray-4'
            cursor
            onClick={() => onClose(id)}
          />
        </Container>
      </Wrapper>
    )
  }
}

export default Toast
