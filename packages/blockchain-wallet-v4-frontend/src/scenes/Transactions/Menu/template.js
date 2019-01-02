import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { contains, flatten, prop } from 'ramda'
import { FormattedMessage } from 'react-intl'
import { model } from 'data'
import { ComponentDropdown, Icon, Link, Text } from 'blockchain-info-components'
import {
  SelectBoxBtcAddresses,
  SelectBoxBchAddresses,
  TextBox,
  TabMenuTransactionStatus
} from 'components/Form'

const { WALLET_TX_SEARCH } = model.form

const Wrapper = styled.div`
  width: 100%;
  padding: 8px 30px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white-blue']};
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`
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

const EthPrivateKeys = () => (
  <Link weight={300} size='12px'>
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
    contains(coin, ACCOUNT_FILTER_COINS) && accounts
      ? flatten(accounts.map(prop('options')))
      : []

  return (
    <Wrapper>
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
            {contains(coin, PRIVATE_KEY_EXPORT_COINS) ? (
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
                    weight={300}
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
            ) : (
              <ReportingIcon
                name='up-arrow-in-circle'
                size='28px'
                cursor
                onClick={handleClickReporting}
              />
            )}
            <Field
              name='search'
              component={TextBox}
              data-e2e='transactionsMenuSearchBox'
            />
            <SearchIcon name='search' size='20px' />
          </Search>
        </Controls>
      </Container>
    </Wrapper>
  )
}

export default reduxForm({
  form: WALLET_TX_SEARCH,
  initialValues: { source: 'all' }
})(Menu)
