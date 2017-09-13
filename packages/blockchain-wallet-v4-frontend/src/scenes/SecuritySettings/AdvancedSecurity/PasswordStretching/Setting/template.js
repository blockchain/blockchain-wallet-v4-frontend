import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { Button, ButtonGroup, Text } from 'blockchain-info-components'
import { Form, NumberBox } from 'components/Form'

import { validPasswordStretchingNumber } from 'services/FormHelper'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  @media(min-width: 992px) {
    align-items: flex-end;
  }
  & > * { padding: 10px 0; }
`
const Setting = (props) => {
  const { updateToggled, handleToggle, handleClick, submitting, invalid, currentStretch } = props
  return (
    <Wrapper>
      {currentStretch &&
        <Text>{currentStretch}</Text>
      }
      <Button nature='secondary' onClick={handleToggle}>
        <FormattedMessage id='scenes.security.passwordStretching.updateform.setpasswordStretching' defaultMessage='Change' />
      </Button>
      {updateToggled &&
        <Form>
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.security.passwordStretching.label' defaultMessage='Password Stretching (PBKDF2)' />
          </Text>
          <Field name='passwordStretching' component={NumberBox} validate={validPasswordStretchingNumber} />
          <ButtonGroup>
            <Button nature='empty' capitalize onClick={handleToggle}>
              <FormattedMessage id='scenes.security.passwordStretching.updateform.cancel' defaultMessage='Cancel' />
            </Button>
            <Button nature='secondary' capitalize disabled={submitting || invalid} onClick={handleClick}>
              <FormattedMessage id='scenes.security.passwordStretching.updateform.save' defaultMessage='Change' />
            </Button>
          </ButtonGroup>
        </Form>
      }
    </Wrapper>
  )
}

Setting.propTypes = {
  updateToggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default Setting
