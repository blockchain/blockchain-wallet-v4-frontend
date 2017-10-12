import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Icon } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 20px 0;
  box-sizing: border-box;
  border-bottom: 1px solid #EFEFEF;
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 0;
  cursor: pointer;
`

const Content = styled.div`
  display: ${props => props.displayed ? 'flex' : 'none'};
  width: 75%;
  font-weight: 300;
  font-size: 14px;
  margin-bottom: 0;
  color: ${props => props.theme['gray-5']};
`

const Arrow = styled(Icon).attrs({
  name: 'down-arrow'
})`
  transform: ${props => props.rotated ? 'rotate(-180deg)' : 'none'};
  color: ${props => props.rotated ? props.theme['brand-primary'] : 'inherit'};
  cursor: pointer;
  font-size: 10px;
`

const FaqRow = ({ component, handleToggle, toggled }) => (
  <Wrapper>
    <Header onClick={handleToggle}>
      {component.title}
      <Arrow rotated={toggled} />
    </Header>
    <Content displayed={toggled}>
      {toggled && component.description}
    </Content>
  </Wrapper>
)

FaqRow.propTypes = {
  handleToggle: PropTypes.func.isRequired,
  toggled: PropTypes.bool.isRequired,
  component: PropTypes.shape({
    title: PropTypes.object.isRequired,
    description: PropTypes.object.isRequired
  })
}

FaqRow.defaultProps = {
  toggled: false
}

export default FaqRow
