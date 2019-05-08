import React from 'react'
import PropTypes from 'prop-types'
import { propOr } from 'ramda'
import styled from 'styled-components'
import { darken } from 'polished'
import { Icon } from '../Icons'

const Wrapper = styled.div`
  width: 100%;
  min-height: 65px;
  background-color: ${props => props.theme['white']};
  @media (min-width: 768px) {
    width: 515px;
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
  height: 100%;
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
    color: ${props => darken(0.5, props.theme['gray-4'])}!important;
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

const Toast = props => {
  const { children, nature, coin, onClose } = props
  const color = selectColor(nature, coin)

  return (
    <Wrapper>
      <Container color={color} data-e2e='toastMessage'>
        <Content>
          {coin && (
            <CustomIcon name={coin.icons.circleFilled} color={coin.colorCode} />
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
          onClick={onClose}
        />
      </Container>
    </Wrapper>
  )
}

Toast.propTypes = {
  nature: PropTypes.oneOf(['success', 'error', 'info']),
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
}

Toast.defaultProps = {
  nature: 'info'
}

export default Toast
