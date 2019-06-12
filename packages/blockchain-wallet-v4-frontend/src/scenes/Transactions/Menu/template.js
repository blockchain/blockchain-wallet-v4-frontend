import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { flatten, includes, prop } from 'ramda'
import { FormattedMessage } from 'react-intl'
import { model } from 'data'
import { ComponentDropdown, Icon, Link, Text } from 'blockchain-info-components'
import {
  SelectBoxBtcAddresses,
  SelectBoxBchAddresses,
  TextBox,
  TabMenuTransactionStatus
} from 'components/Form'
import HorizontalMenu from 'components/HorizontalMenu'

const { WALLET_TX_SEARCH } = model.form

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const Controls = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: auto;

  & input {
    border: 1px solid ${props => props.theme['gray-2']}!important;
    margin-right: 100px;
  }
  & button {
    border: 1px solid ${props => props.theme['gray-2']}!important;
  }
`
const Addresses = styled.div`
  width: 100%;
  margin-left: 0;
  margin-right: 15px;
  @media (min-width: 1200px) {
    width: 300px;
  }
`
const Status = styled.div`
  width: 100%;
  @media (min-width: 1200px) {
    width: 360px;
  }
`
const Search = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: auto;
  @media (min-width: 900px) {
    width: 300px;
  }
`
const EthPrivateKeysWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-right: 10px;
  min-width: 115px;
`
const ExportEthPrivateKeyText = styled(Text)`
  cursor: pointer;
`
const ReportingIcon = styled(Icon)`
  width: 40px;
  margin-right: 10px;
`
const SearchIcon = styled(Icon)`
  position: absolute;
  top: 10px;
  right: 10px;
`

const PRIVATE_KEY_EXPORT_COINS = ['ETH', 'XLM']
const ACCOUNT_FILTER_COINS = ['BTC', 'BCH']
const TX_EXPORT_COINS = ['BTC', 'BCH']

const EthPrivateKeys = () => (
  <Link weight={500} size='12px'>
    <FormattedMessage
      id='scenes.transactions.menu.ethprivatekeys'
      defaultMessage='Private Keys'
    />
  </Link>
)
const Menu = props => {
  const {
    accounts,
    coin,
    handleClickReporting,
    onShowPrivateKey,
    onShowEthPrivateKeyLegacy,
    isLegacyEthAddr
  } = props
  const options =
    includes(coin, ACCOUNT_FILTER_COINS) && accounts
      ? flatten(accounts.map(prop('options')))
      : []

  return (
    <HorizontalMenu>
      <Container>
        <Controls>
          {options.length > 1 && (
            <Addresses>
              <Field
                name='source'
                component={
                  coin === 'BTC' ? SelectBoxBtcAddresses : SelectBoxBchAddresses
                }
                excludeLockbox
                height='40px'
              />
            </Addresses>
          )}
          <Status>
            <Field
              name='status'
              statuses={['', 'sent', 'received', 'transferred']}
              component={TabMenuTransactionStatus}
            />
          </Status>
        </Controls>
        <Controls>
          <Search>
            {includes(coin, PRIVATE_KEY_EXPORT_COINS) && (
              <EthPrivateKeysWrapper>
                {isLegacyEthAddr ? (
                  <ComponentDropdown
                    down
                    forceSelected
                    color={'gray-5'}
                    selectedComponent={<EthPrivateKeys />}
                    components={[
                      <ExportEthPrivateKeyText
                        size='small'
                        onClick={onShowPrivateKey}
                      >
                        <FormattedMessage
                          id='scenes.transactions.export.ethkey'
                          defaultMessage='Export Private Key'
                        />
                      </ExportEthPrivateKeyText>,
                      <ExportEthPrivateKeyText
                        size='small'
                        onClick={onShowEthPrivateKeyLegacy}
                      >
                        <FormattedMessage
                          id='scenes.transactions.export.ethkeyarchived'
                          defaultMessage='Export Archived Private Key'
                        />
                      </ExportEthPrivateKeyText>
                    ]}
                  />
                ) : (
                  <Link
                    size={'12px'}
                    weight={400}
                    onClick={onShowPrivateKey}
                    data-e2e='exportPrivateKeyLink'
                  >
                    <FormattedMessage
                      id='scenes.transactions.export.ethkey'
                      defaultMessage='Export Private Key'
                    />
                  </Link>
                )}
              </EthPrivateKeysWrapper>
            )}
            {includes(coin, TX_EXPORT_COINS) && (
              <ReportingIcon
                name='request'
                size='24px'
                cursor
                color='gray-2'
                onClick={handleClickReporting}
                data-e2e='generateTxReport'
              />
            )}
            <Field
              name='search'
              height='40px'
              component={TextBox}
              data-e2e='transactionsMenuSearchBox'
            />
            <SearchIcon name='search' size='20px' />
          </Search>
        </Controls>
      </Container>
    </HorizontalMenu>
  )
}

export default reduxForm({
  form: WALLET_TX_SEARCH,
  initialValues: { source: 'all' }
})(Menu)
