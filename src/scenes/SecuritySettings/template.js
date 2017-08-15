import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-components'
import BasicSecurity from './BasicSecurity'
import AdvancedSecurity from './AdvancedSecurity'

const Wrapper = styled.section`
  padding: 30px;
  box-sizing: border-box;
`
const ButtonContainer = styled.div`
  padding: 10px 0;
`

const SecuritySettings = (props) => {
  const { toggled, handleToggle } = props

  return (
    <Wrapper>
      <BasicSecurity />
      <ButtonContainer>
        <Button onClick={handleToggle}>
          <Text id='scenes.settings.advancedsettings' text='Advanced settings' small light />
        </Button>
      </ButtonContainer>
      { toggled ? <AdvancedSecurity /> : <div /> }
    </Wrapper>
  )
}

SecuritySettings.propTypes = {
  toggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired
}

export default SecuritySettings
