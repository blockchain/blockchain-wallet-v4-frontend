import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'

import { Icon, Text } from 'blockchain-info-components'
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

const RecentActivityText = styled(Text)`
  font-size: 12px;
  font-weight: 300;
  @media (min-width: 480px) {
    font-size: 14px;
  }
`

const ActivityListItem = (props) => {
  const { action, time, type, amount, path, coin, handleLink } = props
  const timeFormatted = moment(time).format('ll')
  const iconName = selectIcon(type)
  const visibility = coin ? 'visible' : 'hidden'
  console.log(props)

  return (
    <Container>
      <Circle>
        <Icon name={iconName} color='brand-primary' />
      </Circle>
      <Info cursor={coin} onClick={() => path && handleLink(path)}>
        <RecentActivityText capitalize color={selectColor(action)}>{action} {coin}</RecentActivityText>
        <RecentActivityText>{timeFormatted}</RecentActivityText>
        <RecentActivityText style={{visibility: visibility}} ><SwitchableDisplay mobileSize='12px' size='14px' visibility={'hidden'} coin={coin}>{amount}</SwitchableDisplay></RecentActivityText>
      </Info>
    </Container>
  )
}

ActivityListItem.propTypes = {
  action: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  type: PropTypes.string,
  amount: PropTypes.number,
  coin: PropTypes.string
}

ActivityListItem.defaultProps = {
  type: 'log'
}

export default ActivityListItem
