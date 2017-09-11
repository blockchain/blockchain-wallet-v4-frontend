import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon } from '../Icons'
import { Text } from '../Text'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme['gray-1']};

  & > :first-child { margin-right: 10px; }
`
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const Button = styled.div`
  position: absolute;
  top: 30px;
  right: 20px;
  height: 20px;
  cursor: pointer;
`
const HeaderIcon = styled(Icon)`margin-right: 10px;`

const ModalHeader = props => {
  const { closeButton, icon, children } = props

  return (
    <Wrapper>
      <Header>
        {icon && <HeaderIcon name={icon} size='20px' weight={300} color='gray-5' /> }
        <Text size='20px' weight={300} color='gray-5'>
          { children }
        </Text>
      </Header>
      <Button>
        {closeButton && <Icon name='close' size='20px' weight={300} />}
      </Button>
    </Wrapper>
  )
}

ModalHeader.propTypes = {
  closeButton: PropTypes.bool,
  icon: PropTypes.string
}

ModalHeader.defaultProps = {
  closeButton: true
}

export default ModalHeader
