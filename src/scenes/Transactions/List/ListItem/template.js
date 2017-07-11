import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedDate } from 'react-intl'

import { Icon } from 'components/generic/Icon'
import { Text } from 'components/generic/Text'
import { Typography } from 'components/generic/Typography'

import ButtonAmount from './ButtonAmount'
import StatusLabel from './StatusLabel'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #DDDDDD;
`
const Row = styled.div`
  display: ${props => props.collapsed ? 'none' : 'flex'};
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`
const ArrowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  transform: ${props => props.rotated ? 'rotate(-90deg)' : 'none'};
  cursor: pointer;
  width: 5%;
`
const StatusContainer = styled.div`width: 15%;`
const AddressesContainer = styled.div`width: 40%;`
const DescriptionContainer = styled.div`width: 25%;`
const EditIcon = styled(Icon)`cursor: pointer;`
const AmountContainer = styled.div`width: 15%;`
const DetailsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const ListItem = (props) => {
  return (
    <Wrapper>
      <Row>
        <ArrowContainer rotated={!props.detailsDisplayed} onClick={props.clickDetails}>
          <Icon name='icon-down_arrow' />
        </ArrowContainer>
        <StatusContainer>
          <StatusLabel {...props} />
          <Typography small light italic>
            <FormattedDate value={new Date(props.transaction.time * 1000)} />
          </Typography>
        </StatusContainer>
        <AddressesContainer>
          <Text id='scenes.transactions.list.listitem.to' text='To : {to}' values={{ to: props.transaction.to }} small light />
          <Text id='scenes.transactions.list.listitem.from' text='From : {from}' values={{ from: props.transaction.from }} small light />
        </AddressesContainer>
        <DescriptionContainer>
          { props.transaction.description !== ''
            ? <Typography small light>{props.transaction.description}<EditIcon name='ti-pencil' /></Typography>
            : <Typography small light>Add a description</Typography>
          }
        </DescriptionContainer>
        <AmountContainer>
          <ButtonAmount {...props} />
        </AmountContainer>
      </Row>
      <Row collapsed={!props.detailsDisplayed}>
        <DetailsContainer>
          <Typography small light>{props.transaction.status}</Typography>
          <Text id='scenes.transactions.list.listitem.initial' text='Value when received: {value}' values={{ value: props.transaction.initial_value }} small light />
        </DetailsContainer>
      </Row>
    </Wrapper>
  )
}

ListItem.propTypes = {
  detailsDisplayed: PropTypes.bool.isRequired,
  clickDetails: PropTypes.func.isRequired,
  transaction: PropTypes.shape({
    type: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    time: PropTypes.number.isRequired,
    to: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string,
    initial_value: PropTypes.string
  })
}

export default ListItem
