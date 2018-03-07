import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'
import { Icon, TabMenu, TabMenuItem, Text, IconButton, Link, ComponentDropdown } from 'blockchain-info-components'
import HorizontalMenu from 'components/HorizontalMenu'
import AddressesTable from './AddressesTable'
import AddressesTableEntry from './AddressesTableEntry'

const Wrapper = styled.div`
  width: 100%;
`
const InnerWrapper = styled.div`
  padding: 40px 30px;
`
const ClickableText = styled(Text)`
  cursor: pointer;
`

const MoreOptions = () => (
  <Link weight={200} size='small'>
    <FormattedMessage id='scenes.settings.addresses.bch.manage_addresses.more_options' defaultMessage='More Options' />
  </Link>
)

const OptionItem = ({ id, text, onClick }) => (
  <ClickableText size='small' onClick={onClick}>
    <FormattedMessage id={id} defaultMessage={text} />
  </ClickableText>
)

const ManageAddressesTemplate = ({ account, labels, receiveIndex, isDefault, deriveAddress, onSetLabel, onEditLabel, onDeleteLabel, oneditBchAccountLabel, onShowXPub, onMakeDefault, onSetArchived }) => (
  <Wrapper>
    <HorizontalMenu>
      <TabMenu>
        <LinkContainer to='/settings/addresses'>
          <TabMenuItem>
            <Icon name='left-arrow' />
          </TabMenuItem>
        </LinkContainer>
      </TabMenu>
    </HorizontalMenu>
    <InnerWrapper>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ display: 'flex' }} weight={400}>
          {account.label}
          {isDefault && (
            <Text size='small' weight={300} style={{ marginLeft: 15 }}>
              <FormattedMessage id='scene.settings.manage_addresses.is_default' defaultMessage='Default' />
            </Text>
          )}
        </Text>
        <ComponentDropdown
          down
          forceSelected
          color={'gray-5'}
          selectedComponent={<MoreOptions />}
          components={[
            <OptionItem id='scenes.settings.addresses.bch.manage_addresses.edit_name' text='Edit Name' onClick={oneditBchAccountLabel} />,
            (!isDefault && <OptionItem id='scenes.settings.addresses.bch.manage_addresses.make_default' text='Make Default' onClick={onMakeDefault} />),
            (!isDefault && <OptionItem id='scenes.settings.addresses.bch.manage_addresses.archive' text='Archive' onClick={onSetArchived} />),
            <OptionItem id='scenes.settings.addresses.bch.manage_addresses.show_xpub' text='Show xPub' onClick={onShowXPub} />
          ].filter(x => x)} />
      </div>
      <Text weight={400} size='small' style={{ marginTop: 25 }}>
        <FormattedMessage id='scenes.settings.addresses.bch.manage_addresses.unused_addresses' defaultMessage='Unused Addresses' />
      </Text>
      <Text weight={200} size='small' style={{ marginTop: 10, marginBottom: 15 }}>
        <FormattedMessage id='scenes.settings.addresses.bch.manage_addresses.unused_addresses.message' defaultMessage='Your Blockchain Wallet contains an unlimited collection of bitcoin cash addresses that you can use to receive funds from anybody, globally. Your wallet will automatically manage your bitcoin cash addresses for you. The addresses below are the subset of addresses that are labeled.' />
      </Text>
      {labels.length === 0 ? null : (
        <AddressesTable>
          {labels.map(entry => (
            <AddressesTableEntry {...{ entry, deriveAddress, onEditLabel, onDeleteLabel }} />
          ))}
        </AddressesTable>
      )}
      {receiveIndex.cata({
        Success: (index) => (
          <IconButton style={{ marginTop: 15 }} name='build' onClick={() => onSetLabel(index, 'New Address')}>
            <FormattedMessage id='scenes.settings.addresses.bch.manage_addresses.add_label' defaultMessage='Add Next Address' />
          </IconButton>
        ),
        Failure: () => null,
        Loading: () => null,
        NotAsked: () => null
      })}
    </InnerWrapper>
  </Wrapper>
)

export default ManageAddressesTemplate
