import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { IconCloseCircleV2, IconGlobe, PaletteColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Image, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import Flyout, { duration, FlyoutChild, FlyoutWrapper } from 'components/Flyout'
import { FlyoutContainer, FlyoutContent } from 'components/Flyout/Layout'
import { Padding } from 'components/Padding'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

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
  color: ${(props) => props.theme.grey700};
  font-size: 16px;
  text-align: center;
  font-weight: 500;
  line-height: 150%;
`

const IconWrapper = styled.div`
  display: flex;
  background: ${(props) => props.theme.grey000};
  height: 66px;
  width: 66px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  svg {
    height: 55px;
    width: 55px;
  }
`

const CloseIconContainer = styled.div`
  cursor: pointer;
`

const IconsContainerRight = styled(IconsContainer)`
  justify-content: right;
`

export type Props = {
  handleClose: () => void
  message?: string
  sanctionsType?: string
} & ModalPropsType

const UnsupportedRegion = (props: Props) => {
  const [show, setShow] = useState(true)

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      props.close()
    }, duration)
  }

  return (
    <Flyout {...props} onClose={handleClose} isOpen={show} data-e2e='unsupportedRegionModal'>
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
                  <IconWrapper>
                    <IconGlobe color={PaletteColors['grey-900']} label='alert' size='large' />
                  </IconWrapper>
                </Padding>
              </Flex>
              <RowItemTitle>
                <FormattedMessage
                  id='modals.onboarding.unsupported_region.title'
                  defaultMessage='Currently unavailable'
                />
              </RowItemTitle>
              <Flex justifyContent='center'>
                <Padding bottom={24} top={8}>
                  <RowItemDescription>
                    <FormattedMessage
                      id='modals.onboarding.unsupported_region.description'
                      defaultMessage='Unfortunately, this feature is not available in your region.'
                    />
                  </RowItemDescription>
                </Padding>
              </Flex>
            </Padding>
          </FlyoutContent>
        </FlyoutContainer>
      </FlyoutChild>
    </Flyout>
  )
}

const enhance = modalEnhancer(ModalName.UNSUPPORTED_REGION, { fixed: true, transition: duration })

export default enhance(UnsupportedRegion)
