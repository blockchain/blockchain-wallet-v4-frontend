import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconCloseCircleV2, IconWarningTriangle } from '@blockchain-com/icons'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Link, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { media } from 'services/styles'

import { getCompleteProfileAnnouncement } from '../selectors'
import { BannerButton, CloseLink } from '../styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 8px;
  padding: 20px;
  ${media.atLeastLaptop`
    height: 96px;
    padding: 0 20px;
  `}
  ${media.mobile`
    padding: 12px;
    flex-direction: column;
  `}
`
const Row = styled.div`
  display: flex;
  align-items: center;
`
const CentralRow = styled(Row)`
  flex: 1;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  flex: 1;
`

const PendingIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  min-width: 40px;
  border-radius: 20px;
  margin-right: 20px;
`

const Sanctions = ({ cacheActions }: Props) => {
  const completeAnnouncement = getCompleteProfileAnnouncement()

  return (
    <Wrapper>
      <Row>
        <PendingIconWrapper>
          <Icon label='alert' color='orange400' size='lg'>
            <IconWarningTriangle />
          </Icon>
        </PendingIconWrapper>
      </Row>
      <CentralRow>
        <Column>
          <Text size='20px' weight={600} color='grey800'>
            <FormattedMessage
              id='scenes.home.banner.sanctions_notifications.title'
              defaultMessage='Your Account has Restrictions Due to European Sanctions'
            />
          </Text>
          <Text size='16px' weight={500} color='grey800'>
            <FormattedMessage
              id='modals.sanctions_notifications.description'
              defaultMessage='Currently, trading is not allowed for balances over €10.000 due to regulatory sanctions. However, you can still hold or withdraw.'
            />
          </Text>
        </Column>
      </CentralRow>

      <Link
        href='https://ec.europa.eu/commission/presscorner/detail/en/ip_22_2332'
        target='_blank'
        rel='noopener noreferrer'
      >
        <BannerButton
          nature='primary'
          data-e2e='learnMoreSanctionsBanner'
          height='48px'
          size='16px'
          disabled={false}
        >
          <FormattedMessage id='buttons.learn_more' defaultMessage='Learn More' />
        </BannerButton>
      </Link>

      <CloseLink
        data-e2e='newCoinCloseButton'
        onClick={() => cacheActions.announcementDismissed(completeAnnouncement)}
      >
        <Icon label='close' color='grey600' data-e2e='completeProfileCloseModalIcon' size='md'>
          <IconCloseCircleV2 />
        </Icon>
      </CloseLink>
    </Wrapper>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  cacheActions: bindActionCreators(actions.cache, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(Sanctions)
