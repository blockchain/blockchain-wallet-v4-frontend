import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { HeartbeatLoader, Text } from 'blockchain-info-components'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import TextBox from 'components/Form/TextBox'
import { Wrapper } from 'components/Public'
import { ProductAuthOptions } from 'data/types'
import { required, validEmail } from 'services/forms'
import { removeWhitespace } from 'services/forms/normalizers'
import { media } from 'services/styles'

import { Props } from '../..'
import ProductTabMenu from '../../components/ProductTabMenu'
import SignupLink from '../../components/SignupLink'
import { ActionButton, LinkRow, LoginFormLabel, WrapperWithPadding } from '../../model'

const LoginWrapper = styled(Wrapper)`
  padding: 0 0 24px 0;
  ${media.mobile`
    padding: 0 0 16px 0;
  `}
`

const EnterEmail = (props: Props) => {
  const {
    busy,
    cache,
    formValues,
    invalid,
    magicLinkData,
    productAuthMetadata,
    submitting,
    walletTabClicked
  } = props

  return (
    <LoginWrapper>
      <ProductTabMenu
        active={ProductAuthOptions.EXCHANGE}
        onWalletTabClick={walletTabClicked}
        platform={magicLinkData?.platform_type}
        product={ProductAuthOptions.EXCHANGE}
      />
      <WrapperWithPadding>
        <FormGroup>
          <FormItem style={{ marginTop: '40px' }}>
            <LoginFormLabel htmlFor='exchangeEmail'>
              <FormattedMessage id='scenes.register.youremail' defaultMessage='Email' />
            </LoginFormLabel>
            <Field
              component={TextBox}
              data-e2e='exchangeEmail'
              disableSpellcheck
              name='exchangeEmail'
              normalize={removeWhitespace}
              validate={[required, validEmail]}
              placeholder='Enter Email'
              autoFocus
            />
          </FormItem>
        </FormGroup>
        <LinkRow>
          <ActionButton
            type='submit'
            nature='primary'
            fullwidth
            height='48px'
            disabled={submitting || invalid || busy || !formValues?.exchangeEmail}
            data-e2e='loginButton'
            style={{ marginBottom: '16px' }}
          >
            {submitting ? (
              <HeartbeatLoader height='20px' width='20px' color='white' />
            ) : (
              <Text color='whiteFade900' size='16px' weight={600}>
                <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
              </Text>
            )}
          </ActionButton>
        </LinkRow>
      </WrapperWithPadding>
      <SignupLink platform={magicLinkData?.platform_type} />
    </LoginWrapper>
  )
}

export default EnterEmail
