import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import TransactionList from 'scenes/Transactions/Content'
import { SettingHeader } from 'components/Setting'
import { Text } from 'blockchain-info-components'

const Wrapper = styled.section`
  box-sizing: border-box;
`
const Title = styled(SettingHeader)`
  justify-content: flex-start;
  margin-bottom: 10px;
`
const Table = styled.div`
  width: 100%;
  border: 1px solid ${props => props.theme['gray-2']};
`
const TableHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 8px 15px;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme['gray-2']};
  background-color: ${props => props.theme['brand-quaternary']};
`
const TableCell = styled.div``

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
            <TableCell style={{ flexBasis: '45%' }}>
              <Text size='13px' weight={500}>
                <FormattedMessage
                  id='scenes.settings.addresses.bsv.tx.type'
                  defaultMessage='Type'
                />
              </Text>
            </TableCell>
            <TableCell style={{ flexBasis: '35%' }}>
              <Text size='13px' weight={500}>
                <FormattedMessage
                  id='scenes.settings.addresses.bsv.tx.addresses'
                  defaultMessage='Addresses'
                />
              </Text>
            </TableCell>
            <TableCell
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                flexBasis: '20%'
              }}
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
