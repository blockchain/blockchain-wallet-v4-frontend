import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import {
  IconCloseCircleV2,
  IconWarningTriangle,
  PaletteColors
} from '@blockchain-com/constellation'
import { bindActionCreators, compose, Dispatch } from 'redux'
import styled from 'styled-components'

import { Button, Link, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import Flyout, { duration, FlyoutChild, FlyoutWrapper } from 'components/Flyout'
import { FlyoutContainer, FlyoutContent, FlyoutFooter } from 'components/Flyout/Layout'
import { Padding } from 'components/Padding'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName, ProductEligibilityForUser } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { IconsContainer } from '../../components'
import { ModalPropsType } from '../../types'

const HeaderWrapper = styled(FlyoutWrapper)`
  flex-direction: column;
  display: flex;
  max-width: 480px;
  background-color: ${(props) => props.theme.white};
`
const RowItemTitle = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 20px;
  font-weight: 600;
  line-height: 150%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  text-align: center;
`

const RowItemDescription = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 16px;
  text-align: center;
  font-weight: 500;
  line-height: 150%;
`

const CloseIconContainer = styled.div`
  cursor: pointer;
`

const IconsContainerRight = styled(IconsContainer)`
  justify-content: right;
`

export type OwnProps = {
  handleClose: () => void
  message?: string
  sanctionsType?: string
} & ModalPropsType

const SanctionsInfo = (props: Props) => {
  const [show, setShow] = useState(true)

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      props.close()
    }, duration)
  }

  const messageToShow = props.products?.notifications?.length
    ? props.products?.notifications[0].message
    : props?.message ?? null

  return (
    <Flyout {...props} onClose={handleClose} isOpen={show} data-e2e='sanctionsInfoModal'>
      <FlyoutChild>
        <FlyoutContainer>
          <HeaderWrapper>
            <IconsContainerRight>
              <CloseIconContainer onClick={handleClose}>
                <IconCloseCircleV2 color={PaletteColors['grey-600']} label='close' size='medium' />
              </CloseIconContainer>
            </IconsContainerRight>
          </HeaderWrapper>

          <FlyoutContent mode='middle'>
            <Padding all={40}>
              <Flex justifyContent='center'>
                <Padding bottom={20}>
                  <IconWarningTriangle
                    color={PaletteColors['orange-400']}
                    label='alert'
                    size='large'
                  />
                </Padding>
              </Flex>
              <RowItemTitle>
                <FormattedMessage
                  id='modals.onboarding.upgrade_now.limited_access'
                  defaultMessage='Limited Access'
                />
              </RowItemTitle>
              <Flex justifyContent='center'>
                <Padding bottom={24} top={16}>
                  <RowItemDescription>
                    {messageToShow || (
                      <FormattedMessage
                        id='modals.sanctions_notifications.description'
                        defaultMessage='Currently, trading is not allowed due to regulatory sanctions.'
                      />
                    )}
                  </RowItemDescription>
                </Padding>
              </Flex>

              {props.sanctionsType === 'SANCTIONS' && (
                <Flex justifyContent='center'>
                  <Link
                    href='https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L:2022:259I:FULL&from=EN'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Button
                      nature='empty-secondary'
                      data-e2e='learnMoreSanctions'
                      height='48px'
                      size='16px'
                      disabled={false}
                    >
                      <FormattedMessage id='buttons.learn_more' defaultMessage='Learn More' />
                    </Button>
                  </Link>
                </Flex>
              )}
            </Padding>
          </FlyoutContent>
          <FlyoutFooter collapsed>
            <Padding all={10}>
              <Button
                fullwidth
                size='16px'
                height='48px'
                nature='primary'
                data-e2e='sanctionsIUnderstandButton'
                type='button'
                onClick={handleClose}
              >
                <FormattedMessage
                  id='modals.sanctions_notifications.i_understand'
                  defaultMessage='I Understand'
                />
              </Button>
            </Padding>
          </FlyoutFooter>
        </FlyoutContainer>
      </FlyoutChild>
    </Flyout>
  )
}

const mapStateToProps = (state: RootState) => ({
  products: selectors.custodial.getProductEligibilityForUser(state).getOrElse({
    notifications: []
  } as ProductEligibilityForUser)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  ModalEnhancer(ModalName.SANCTIONS_INFO_MODAL, { fixed: true, transition: duration }),
  connector
)

export type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(SanctionsInfo)
