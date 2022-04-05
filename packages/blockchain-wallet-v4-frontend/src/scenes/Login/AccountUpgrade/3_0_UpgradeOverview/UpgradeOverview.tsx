import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Icon, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { UpgradeSteps } from 'data/auth/types'

import {
  BackArrow,
  ButtonNext,
  CenteredTitle,
  Item,
  Items,
  StyledTemporaryButton,
  SubHeaderWrapper,
  TierDescription,
  TierTitle
} from '../AccountUpgrade.models'

const UpgradeOverview = (props) => {
  return (
    <>
      <Wrapper>
        <SubHeaderWrapper>
          <BackArrow onClick={() => null}>
            {!props.hideBackArrow && (
              <Icon
                data-e2e='signupBack'
                name='arrow-back'
                size='24px'
                color='blue600'
                style={{ marginRight: '8px' }}
                role='button'
              />
            )}
            <Text color='grey900' size='14px' weight={500} lineHeight='1.5'>
              <FormattedMessage id='copy.back' defaultMessage='Back' />
            </Text>
          </BackArrow>
          <Text color='blue600' size='10px' weight={500} lineHeight='16px'>
            <FormattedMessage
              id='scenes.login.upgrade.3.0.upgrading_accounts'
              defaultMessage='Upgrading accounts'
            />
          </Text>
        </SubHeaderWrapper>
        <CenteredTitle
          size='20px'
          weight={600}
          color='black'
          style={{ marginTop: '12px' }}
          lineHeight='30px'
        >
          <FormattedMessage id='scenes.login.upgrade.3.0.header' defaultMessage='What´s Next' />
        </CenteredTitle>
        <Items>
          <Item>
            <Icon name='pending' color='blue600' size='18px' />
            <TierDescription>
              <TierTitle>
                <FormattedMessage
                  id='scenes.login.upgrade.3.0.item_1.title'
                  defaultMessage='Create a New Password'
                />
              </TierTitle>

              <Text color='grey600' lineHeight='1.5' size='12px' weight={500}>
                <FormattedMessage
                  id='scenes.login.upgrade.3.0.item_1.text'
                  defaultMessage='This new password will allow you to log into your Wallet and Exchange accounts with the same email and password.'
                />
              </Text>
            </TierDescription>
          </Item>
          <Item>
            <Icon name='pending' color='blue600' size='18px' />
            <TierDescription>
              <TierTitle>
                <FormattedMessage
                  id='scenes.login.upgrade.3.0.item_2.title'
                  defaultMessage='Create a New 2FA'
                />
              </TierTitle>

              <Text color='grey600' lineHeight='1.5' size='12px' weight={500}>
                <FormattedMessage
                  id='scenes.login.upgrade.3.0.item_2.text'
                  defaultMessage='This new 2FA method will replace your old Exchange 2FA. You will use this for 2FA on the Wallet and Exchange.'
                />
              </Text>
            </TierDescription>
          </Item>
          <Item>
            <Icon name='pending' color='blue600' size='18px' />
            <TierDescription>
              <TierTitle>
                <FormattedMessage
                  id='scenes.login.upgrade.3.0.item_3.title'
                  defaultMessage='You’re All Set!'
                />
              </TierTitle>

              <Text color='grey600' lineHeight='1.5' size='12px' weight={500}>
                <FormattedMessage
                  id='scenes.login.upgrade.3.0.item_3.text'
                  defaultMessage='You’ll get a confirmation email. Use your email, new password, and new 2FA to log in to the Wallet or Exchange.'
                />
              </Text>
            </TierDescription>
          </Item>
        </Items>

        <ButtonNext
          nature='primary'
          data-e2e='nextButton'
          fullwidth
          height='48px'
          onClick={() => {}}
        >
          <FormattedMessage id='scenes.login.upgrade.3.0.button' defaultMessage='Next' />
        </ButtonNext>
      </Wrapper>
      <StyledTemporaryButton
        onClick={() => props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.UPGRADE_OR_SKIP)}
        type='button'
      >
        Prev Step
      </StyledTemporaryButton>
      <StyledTemporaryButton
        onClick={() => props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.CREATE_WALLET)}
        type='button'
      >
        Next Step
      </StyledTemporaryButton>
    </>
  )
}

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connect(null, mapDispatchToProps)(UpgradeOverview)
