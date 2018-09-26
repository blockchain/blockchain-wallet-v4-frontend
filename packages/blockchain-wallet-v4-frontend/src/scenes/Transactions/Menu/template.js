import React from 'react'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'
import { prop, flatten } from 'ramda'
import { FormattedMessage } from 'react-intl'

import { ComponentDropdown, Icon, Link, Text } from 'blockchain-info-components'
import {
  SelectBoxBtcAddresses,
  SelectBoxBCHAddresses,
  TextBox,
  TabMenuTransactionStatus
} from 'components/Form'

const Wrapper = styled.div`
  width: 100%;
  padding: 8px 30px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white-blue']};
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  @media (min-width: 1200px) {
    flex-direction: row;
    justify-content: space-between;
  }
`
const Controls = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;

  & > * {
    margin-left: 5px;
  }
  & input {
    border: 1px solid ${props => props.theme['gray-2']}!important;
  }
  & button {
    border: 1px solid ${props => props.theme['gray-2']}!important;
  }

  @media (min-width: 1200px) {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: auto;
  }
`
const Addresses = styled.div`
  width: 100%;
  margin-left: 0px;
  @media (min-width: 1200px) {
    width: 360px;
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
  width: 100%;
  @media (min-width: 1200px) {
    width: auto;
  }
`
const EthPrivateKeysWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-right: 15px;
`
const ExportEthPrivateKeyText = styled(Text)`
  cursor: pointer;
`
const ReportingIcon = styled(Icon)`
  width: 40px;
`
const SearchIcon = styled(Icon)`
  position: absolute;
  top: 10px;
  right: 10px;
`
const EthPrivateKeys = () => (
  <Link weight={300} size='12px'>
    <FormattedMessage
      id='scenes.transactions.privatekeys'
      defaultMessage='Private Keys'
    />
  </Link>
)
const Menu = props => {
  const {
    accounts,
    coin,
    handleClickReporting,
    onShowEthPrivateKey,
    isLegacyEthAddr
  } = props
  const options = accounts ? flatten(accounts.map(prop('options'))) : []

  return (
    <Wrapper>
      <Container>
        <Controls>
          {options.length > 1 && (
            <Addresses>
              {coin === 'BTC' && (
                <Field
                  name='source'
                  component={SelectBoxBtcAddresses}
                  excludeLockbox
                />
              )}
              {coin === 'BCH' && (
                <Field
                  name='source'
                  component={SelectBoxBCHAddresses}
                  excludeLockbox
                />
              )}
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
            {coin === 'ETH' ? (
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
                        onClick={() => onShowEthPrivateKey(false)}
                      >
                        <FormattedMessage
                          id='scenes.transactions.export.ethkey'
                          defaultMessage='Export Private Key'
                        />
                      </ExportEthPrivateKeyText>,
                      <ExportEthPrivateKeyText
                        size='small'
                        onClick={() => onShowEthPrivateKey(true)}
                      >
                        <FormattedMessage
                          id='scenes.transactions.export.ethkeyarchived'
                          defaultMessage='Export Archived Private Key'
                        />
                      </ExportEthPrivateKeyText>
                    ].filter(x => x)}
                  />
                ) : (
                  <Link
                    size={'12px'}
                    weight={300}
                    onClick={() => onShowEthPrivateKey(false)}
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
            <Field name='search' component={TextBox} />
            <SearchIcon name='search' size='20px' />
          </Search>
        </Controls>
      </Container>
    </Wrapper>
  )
}

export default reduxForm({ form: 'transactions' })(Menu)
