import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Icon, Image, Text, Tooltip } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { UpgradeSteps } from 'data/auth/types'

import {
  ButtonLater,
  ButtonNext,
  CenteredTitle,
  Item,
  Items,
  Label,
  StyledTemporaryButton,
  TierDescription,
  TierTitle
} from '../AccountUpgrade.models'

const UpgradeOrSkip = (props) => {
  return (
    <>
      <Wrapper>
        <CenteredTitle
          size='20px'
          weight={600}
          color='black'
          style={{ marginTop: '8px' }}
          lineHeight='1.5'
        >
          <FormattedMessage
            id='scenes.login.upgrade.upsell.header'
            defaultMessage='Upgrade to a Unified Account'
          />
        </CenteredTitle>
        <Items>
          <Item>
            <Icon name='wallet' color='blue600' size='18px' />
            <TierDescription>
              <TierTitle>
                <FormattedMessage
                  id='scenes.login.upgrade.upsell.item_1.title'
                  defaultMessage='Blockchain.com Wallet'
                />
              </TierTitle>

              <Text color='grey600' lineHeight='1.5' size='12px' weight={500}>
                <FormattedMessage
                  id='scenes.login.upgrade.upsell.item_1.text'
                  defaultMessage='Self custody your funds in the world’s most popular crypto wallet.'
                />
                <Tooltip id='coming-soon'>
                  <FormattedMessage id='tooltip.comingsoon' defaultMessage='Coming soon.' />
                </Tooltip>
              </Text>
            </TierDescription>
          </Item>
          <Item>
            <Image name='identification' color='blue600' size='18px' height='100%' />
            <TierDescription>
              <TierTitle>
                <FormattedMessage
                  id='scenes.login.upgrade.upsell.item_2.title'
                  defaultMessage='Simplified Login'
                />
              </TierTitle>

              <Text color='grey600' lineHeight='1.5' size='12px' weight={500}>
                <FormattedMessage
                  id='scenes.login.upgrade.upsell.item_2.text'
                  defaultMessage='Easily access the Wallet and Exchange with the same credentials.'
                />
              </Text>
            </TierDescription>
          </Item>
          <Item>
            <Icon name='shield' color='blue600' size='18px' />
            <TierDescription>
              <TierTitle>
                <FormattedMessage
                  id='scenes.login.upgrade.upsell.item_3.title'
                  defaultMessage='Enhanced Security'
                />
              </TierTitle>

              <Text color='grey600' lineHeight='1.5' size='12px' weight={500}>
                <FormattedMessage
                  id='scenes.login.upgrade.upsell.item_3.text'
                  defaultMessage='Protect your investments across both accounts with two-factor authentication.'
                />
              </Text>
            </TierDescription>
          </Item>
          <Item>
            <Icon name='portfolio' color='blue600' size='18px' />
            <TierDescription>
              <TierTitle>
                <FormattedMessage
                  id='scenes.login.upgrade.upsell.item_4.title'
                  defaultMessage='Full Portfolio Access'
                />
              </TierTitle>

              <Text color='grey600' lineHeight='1.5' size='12px' weight={500}>
                <FormattedMessage
                  id='scenes.login.upgrade.upsell.item_4.text'
                  defaultMessage='View and manage all your funds across both the Wallet and Exchange.'
                />
              </Text>
              <Label>
                <FormattedMessage id='tooltip.comingsoon' defaultMessage='Coming Soon' />
              </Label>
            </TierDescription>
          </Item>
        </Items>

        <ButtonNext
          nature='primary'
          data-e2e='obContinueBankStatus'
          fullwidth
          height='48px'
          onClick={() =>
            props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.UPGRADE_OVERVIEW)
          }
        >
          <FormattedMessage
            id='scenes.login.upgrade.upsell.button_1'
            defaultMessage='Upgrade My Account'
          />
        </ButtonNext>
        <ButtonLater
          data-e2e='obContinueBankStatus'
          color='blue600'
          fullwidth
          height='48px'
          onClick={() => {}}
        >
          <FormattedMessage
            id='scenes.login.upgrade.upsell.button_2'
            defaultMessage='I´ll Do This Later'
          />
        </ButtonLater>
      </Wrapper>
      <StyledTemporaryButton
        style={{ margin: '20px 0 0' }}
        onClick={() => props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.UPGRADE_OVERVIEW)}
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

export default connect(null, mapDispatchToProps)(UpgradeOrSkip)
