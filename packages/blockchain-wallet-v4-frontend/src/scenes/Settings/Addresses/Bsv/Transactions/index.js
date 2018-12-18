import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import TransactionList from 'scenes/Transactions/Content'
import { SettingHeader } from 'components/Setting'
import { TableCell, Text } from 'blockchain-info-components'

const Wrapper = styled.section`
  box-sizing: border-box;
`
const Title = styled(SettingHeader)`
  justify-content: flex-start;
  margin-bottom: 10px;
`
const Table = styled.table`
  width: 100%;
  border: 1px solid ${props => props.theme['gray-2']};
`
const TableHeader = styled.tr`
  width: 100%;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${props => props.theme['gray-2']};
`

class BsvTransactionsContainer extends React.Component {
  render () {
    return (
      <Wrapper>
        <Title>
          <FormattedMessage
            id='scenes.settings.addresses.bsv.tx.title'
            defaultMessage='Bitcoin SV Transactions'
          />
        </Title>
        <Table>
          <TableHeader>
            <TableCell width='50%'>
              <Text size='13px' weight={500}>
                <FormattedMessage
                  id='scenes.settings.addresses.bsv.tx.type'
                  defaultMessage='Type'
                />
              </Text>
            </TableCell>
            <TableCell width='30%'>
              <Text size='13px' weight={500}>
                <FormattedMessage
                  id='scenes.settings.addresses.bsv.tx.addresses'
                  defaultMessage='Addresses'
                />
              </Text>
            </TableCell>
            <TableCell
              width='20%'
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Text size='13px' weight={500}>
                <FormattedMessage
                  id='scenes.settings.addresses.bch.wallets.amount'
                  defaultMessage='Amount'
                />
              </Text>
            </TableCell>
          </TableHeader>
          <TransactionList coin='BSV' />
        </Table>
      </Wrapper>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  kvStoreBchActions: bindActionCreators(actions.core.kvStore.bch, dispatch),
  addressesBchActions: bindActionCreators(
    actions.modules.addressesBch,
    dispatch
  ),
  modalsActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(BsvTransactionsContainer)
