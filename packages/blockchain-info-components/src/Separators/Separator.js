import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  white-space: nowrap;
  padding-left: ${props =>
    props.align === 'left' || props.align === 'center' ? '10px' : '0'};
  padding-right: ${props =>
    props.align === 'right' || props.align === 'center' ? '10px' : '0'};
`
const BaseSeparator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${props => props.theme.grey200};
  margin: ${props => (props.margin ? props.margin : '10px 0')};
`

const Separator = props => {
  const { align, children, className, margin } = props

  return children ? (
    <Wrapper className={className}>
      {align !== 'right' && <BaseSeparator margin={margin} />}
      <Content align={align}>{children}</Content>
      {align !== 'left' && <BaseSeparator margin={margin} />}
    </Wrapper>
  ) : (
    <BaseSeparator className={className} margin={margin} />
  )
}

Separator.propTypes = {
  align: PropTypes.oneOf(['left', 'right', 'center'])
}

Separator.defaultProps = {
  align: 'center'
}

export default Separator
