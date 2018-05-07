import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button } from 'blockchain-info-components'
import BasicSecurity from './BasicSecurity'
import AdvancedSecurity from './AdvancedSecurity'

const Wrapper = styled.section`
  padding: 20px;
  box-sizing: border-box;
  @media (min-width: 480px) {
    padding: 30px;
  }
`
const ButtonContainer = styled.div`
  padding: 10px 0;
`

const Security = (props) => {
  const { toggled, handleToggle } = props

  return (
    <Wrapper>
      <BasicSecurity />
      <ButtonContainer>
        <Button onClick={handleToggle}>
          <FormattedMessage id='scenes.securitysettings.title' defaultMessage='Advanced settings' />
        </Button>
      </ButtonContainer>
      { toggled ? <AdvancedSecurity /> : <div /> }
    </Wrapper>
  )
}

Security.propTypes = {
  toggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired
}

export default Security
