import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { FormattedMessage } from 'react-intl'
import { Icon, SkeletonCircle, Text, Tooltip } from 'blockchain-info-components'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: calc(100% - 30px);
  height: 60px;
  margin: 0 20px;
  border-left: 1px solid ${props => props.theme['gray-2']};
  border-bottom: 1px solid ${props => props.theme['gray-2']};
`
const Circle = styled.div`
  position: absolute;
  left: -16px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background-color: ${props => props.theme['white']};
  border: 1px solid ${props => props.theme['gray-2']};
  border-radius: 100%;
  text-align: center;
  z-index: 7;
`
const Info = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 40px;
  padding: 10px 20px;
  box-sizing: border-box;

  & > * {
    cursor: ${props => props.cursor ? 'pointer' : ''};
    padding: 0 5px;
    width: 50%;
  }

  div:nth-child(2) {
    text-align: center;
  }

  div:last-child {
    > div {
      justify-content: flex-end;
    }
  }
`

const RecentActivityText = styled(Text)`
  font-size: 12px;
  font-weight: 300;
  @media (min-width: 480px) {
    font-size: 14px;
  }
`

const WatchOnly = styled.span`
  z-index: 11;
  margin-left: 5px;
  text-transform: none;
  > div > div {
    z-index: 7;
    &:first-child {
      padding: 2px 4px;
    }
  }
`

const selectIcon = type => {
  switch (type) {
    case 'log': return 'settings'
    default: return 'transactions'
  }
}

const selectColor = action => {
  switch (action) {
    case 'sent': return 'sent'
    case 'received': return 'received'
    case 'transferred': return 'transferred'
    default: return 'gray-5'
  }
}

const ActivityListItem = props => (
  <Container>
    <Circle>
      <Icon name={selectIcon(props.type)} color='brand-primary' />
    </Circle>
    <Info cursor={props.coin} onClick={() => props.path && props.handleLink(props.path)}>
      <RecentActivityText capitalize color={selectColor(props.action)}>
        {props.action} {props.coin}
        {props.watchOnly && <WatchOnly>
          <Tooltip width='200px' label={<SkeletonCircle bgColor='gray-2' width='10px' height='10px' />} hover>
            <FormattedMessage id='scenes.home.activitylist.watchonly' defaultMessage='This transaction involves a watch only address.' />
          </Tooltip>
        </WatchOnly> }
      </RecentActivityText>
      <RecentActivityText>{props.timeFormatted}</RecentActivityText>
      {props.coin &&
        <RecentActivityText>
          <SwitchableDisplay mobileSize='12px' size='14px' coin={props.coin}>{props.amount}</SwitchableDisplay>
        </RecentActivityText>
      }
    </Info>
  </Container>
)

ActivityListItem.propTypes = {
  type: PropTypes.string,
  time: PropTypes.number.isRequired,
  timeFormatted: PropTypes.string.isRequired,
  path: PropTypes.string,
  watchOnly: PropTypes.bool,
  amount: PropTypes.number,
  coin: PropTypes.string,
  action: PropTypes.string
}

ActivityListItem.defaultProps = {
  type: 'log'
}

export default ActivityListItem
