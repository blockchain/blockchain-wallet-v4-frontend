import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { Button, ButtonGroup, Text } from 'blockchain-info-components'
import { Form, TextBox } from 'components/Form'
import { validIpList } from 'services/FormHelper'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  @media(min-width: 992px) { align-items: flex-end; }

  & > * { padding: 10px 0; }
`
const SettingForm = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  @media(min-width: 992px) { align-items: flex-end; }
`

const Setting = (props) => {
  const { updateToggled, handleToggle, handleClick, currentWhitelist, submitting, invalid } = props

  return (
    <Wrapper>
      <Text>{currentWhitelist}</Text>
      <Button nature='secondary' onClick={handleToggle}>
        <FormattedMessage id='scenes.settings.whitelist.updateform.change' defaultMessage='Change' />
      </Button>
      {updateToggled &&
        <SettingForm>
          <Field name='IPWhitelist' validate={[validIpList]} component={TextBox} />
          <ButtonGroup>
            <Button nature='empty' capitalize onClick={handleToggle}>
              <FormattedMessage id='scenes.settings.whitelist.updateform.cancel' defaultMessage='Cancel' />
            </Button>
            <Button nature='secondary' capitalize disabled={submitting || invalid} onClick={handleClick}>
              <FormattedMessage id='scenes.settings.whitelist.updateform.save' defaultMessage='Save' />
            </Button>
          </ButtonGroup>
        </SettingForm>
      }
    </Wrapper>
  )
}

Setting.propTypes = {
  currentWhitelist: PropTypes.string.isRequired,
  updateToggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default Setting
