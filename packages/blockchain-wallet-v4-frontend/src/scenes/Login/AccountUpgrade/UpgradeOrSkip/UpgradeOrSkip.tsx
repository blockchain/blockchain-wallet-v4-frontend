import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon, Text } from '@blockchain-com/constellation'
import { IconIdentification, IconPortfolio, IconShield, IconWallet } from '@blockchain-com/icons'
import { bindActionCreators } from 'redux'

import { Wrapper } from 'components/Public'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'
import { UpgradeSteps } from 'data/auth/types'

import ScreenHeader from '../../components/ScreenHeader'
import {
  ButtonLater,
  ButtonNext,
  GreenLabel,
  Item,
  Items,
  StyledTemporaryButton,
  TierDescription,
  TierTitle
} from '../AccountUpgrade.models'

const UpgradeOrSkip: React.FC<{ formActions: { change: Function } }> = (props) => {
  const { formatMessage } = useIntl()

  const handleNext = () => {
    props.formActions.change(LOGIN_FORM, 'step', UpgradeSteps.UPGRADE_OVERVIEW)
  }

  return (
    <>
      <Wrapper>
        <ScreenHeader
          title={
            <FormattedMessage
              id='scenes.login.upgrade.upsell.header'
              defaultMessage='Upgrade to a Unified Account'
            />
          }
        />
        <Items>
          <Item>
            <Icon
              label={formatMessage({
                defaultMessage: 'Blockchain.com Wallet',
                id: 'scenes.login.upgrade.upsell.item_1.title'
              })}
              color='blue600'
              size='lg'
            >
              <IconWallet />
            </Icon>
            <TierDescription>
              <TierTitle color='grey900' variant='body-2'>
                <FormattedMessage
                  id='scenes.login.upgrade.upsell.item_1.title'
                  defaultMessage='Blockchain.com Wallet'
                />
              </TierTitle>

              <Text color='grey600' variant='paragraph-1'>
                <FormattedMessage
                  id='scenes.login.upgrade.upsell.item_1.text'
                  defaultMessage='Self custody your funds in the world’s most popular crypto wallet.'
                />
              </Text>
            </TierDescription>
          </Item>
          <Item>
            <Icon
              label={formatMessage({
                defaultMessage: 'Simplified Login',
                id: 'scenes.login.upgrade.upsell.item_2.title'
              })}
              color='blue600'
              size='lg'
            >
              <IconIdentification />
            </Icon>
            <TierDescription>
              <TierTitle color='grey900' variant='body-2'>
                <FormattedMessage
                  id='scenes.login.upgrade.upsell.item_2.title'
                  defaultMessage='Simplified Login'
                />
              </TierTitle>

              <Text color='grey600' variant='paragraph-1'>
                <FormattedMessage
                  id='scenes.login.upgrade.upsell.item_2.text'
                  defaultMessage='Easily access the Wallet and Exchange with the same credentials.'
                />
              </Text>
            </TierDescription>
          </Item>
          <Item>
            <Icon
              label={formatMessage({
                defaultMessage: 'Enhanced Security',
                id: 'scenes.login.upgrade.upsell.item_3.title'
              })}
              color='blue600'
              size='lg'
            >
              <IconShield />
            </Icon>
            <TierDescription>
              <TierTitle color='grey900' variant='body-2'>
                <FormattedMessage
                  id='scenes.login.upgrade.upsell.item_3.title'
                  defaultMessage='Enhanced Security'
                />
              </TierTitle>

              <Text color='grey600' variant='paragraph-1'>
                <FormattedMessage
                  id='scenes.login.upgrade.upsell.item_3.text'
                  defaultMessage='Protect your investments across both accounts with two-factor authentication.'
                />
              </Text>
            </TierDescription>
          </Item>
          <Item>
            <Icon
              label={formatMessage({
                defaultMessage: 'Full Portfolio Access',
                id: 'scenes.login.upgrade.upsell.item_4.title'
              })}
              color='blue600'
              size='lg'
            >
              <IconPortfolio />
            </Icon>
            <TierDescription>
              <TierTitle color='grey900' variant='body-2'>
                <FormattedMessage
                  id='scenes.login.upgrade.upsell.item_4.title'
                  defaultMessage='Full Portfolio Access'
                />
              </TierTitle>

              <Text color='grey600' variant='paragraph-1'>
                <FormattedMessage
                  id='scenes.login.upgrade.upsell.item_4.text'
                  defaultMessage='View and manage all your funds across both the Wallet and Exchange.'
                />
              </Text>
              <GreenLabel>
                <FormattedMessage id='tooltip.comingsoon' defaultMessage='Coming Soon' />
              </GreenLabel>
            </TierDescription>
          </Item>
        </Items>

        <ButtonNext
          nature='primary'
          data-e2e='nextButton'
          fullwidth
          height='48px'
          onClick={handleNext}
        >
          <FormattedMessage
            id='scenes.login.upgrade.upsell.button_1'
            defaultMessage='Upgrade My Account'
          />
        </ButtonNext>
        <ButtonLater
          data-e2e='LaterButton'
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
      <StyledTemporaryButton style={{ margin: '20px 0 0' }} onClick={handleNext} type='button'>
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
