import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Button } from 'components/generic/Button'
import { Text } from 'components/generic/Text'
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
  return (
    <Wrapper>
      <BasicSecurity />
      <ButtonContainer>
        <Button onClick={props.clickAdvancedSecurity}>
          <Text id='scenes.settings.advancedsettings' text='Advanced settings' small light />
        </Button>
      </ButtonContainer>
      { props.advancedSecurityDisplayed ? <AdvancedSecurity /> : <div /> }
    </Wrapper>
  )
}

SecuritySettings.propTypes = {
  advancedSecurityDisplayed: PropTypes.bool.isRequired,
  clickAdvancedSecurity: PropTypes.func.isRequired
}

export default SecuritySettings
