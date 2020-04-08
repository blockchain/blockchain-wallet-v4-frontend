import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'
import React from 'react'

import { Color, Link } from 'blockchain-info-components'
import styled from 'styled-components'

const FaqDescription = styled.div`
  & > * {
    display: inline;
  }
`

const FaqContent = [
  {
    groupTitleMsg: (
      <FormattedMessage
        id='scenes.faq.group.walletfunctionality.title'
        defaultMessage='Wallet Functionality'
      />
    ),
    groupQuestions: [
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.walletfunctionality.question1'
            defaultMessage='How do I receive/send funds?'
          />
        ),
        answer: (
          <FaqDescription>
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer1.one.updated'
              defaultMessage='To receive funds, the sender needs your address. Your wallet will automatically generate a new address for each bitcoin or bitcoin cash transaction you make. For all ether, stellar, or USD Digital transactions, your address will remain the same.'
            />
            <span>&nbsp;</span>
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer1.two'
              defaultMessage='Click on ‘Request’, select the currency you’d like to receive from the dropdown, and copy the address to share with the sender. To send funds, click ‘Send’, select the currency you want to send from the dropdown, enter the recipient’s address in the ‘To’ field and enter how much you would like to send.'
            />
          </FaqDescription>
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.walletfunctionality.question2'
            defaultMessage='How much does it cost to send funds?'
          />
        ),
        answer: (
          <FaqDescription>
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer2.one.new'
              defaultMessage='While our wallet is entirely free to use, the small fee included in your transaction goes to the miners, who help power the flow of transactions on the Bitcoin, Ethereum, Bitcoin Cash, and Stellar networks.'
            />
            <span>&nbsp;</span>
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer2.two'
              defaultMessage='To ensure your transactions confirm consistently and reliably, your wallet will automatically include an appropriate fee based on your transaction’s size and the level of network traffic at the time. If you wish to specify your own fee for bitcoin transactions, you can do so under ‘Customize Fee’.'
            />
            '
          </FaqDescription>
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.walletfunctionality.question3'
            defaultMessage='What is the difference between a wallet ID and an address?'
          />
        ),
        answer: (
          <FaqDescription>
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer3.one'
              defaultMessage='You can think of your wallet ID as a username that contains numbers, letters, and dashes. It is only used to log into your wallet and should be kept private.'
            />
            <span>&nbsp;</span>
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer3.two'
              defaultMessage='Your wallet ID can be found in the welcome email we sent you when you created your wallet or in Settings -> General. Addresses are what you share with others when you want to receive funds. To find your bitcoin, ether, or bitcoin cash address click on ‘Request’.'
            />
          </FaqDescription>
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.walletfunctionality.question5'
            defaultMessage='Why do we generate new addresses for each bitcoin and bitcoin cash transaction?'
          />
        ),
        answer: (
          <FormattedMessage
            id='scenes.faq.group.walletfunctionality.answer5'
            defaultMessage='Although you can reuse addresses, transacting with the same address makes it easy for people to track your payments history. We alleviate this by using a HD (hierarchical deterministic) framework which provides you endless different addresses to send and receive to for additional security.'
          />
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.walletfunctionality.question6'
            defaultMessage='Can an address still receive funds even though it’s no longer displayed under ‘Request’?'
          />
        ),
        answer: (
          <FaqDescription>
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer6.one'
              defaultMessage='Yes. All public addresses generated from your wallet can still receive funds, even if they no longer appear under ‘Request’. As explained'
            />
            <span>&nbsp;</span>
            <Link
              href='https://support.blockchain.com/hc/en-us/articles/210353663-Why-is-my-bitcoin-address-changing-'
              target='_blank'
              size='14px'
              weight={400}
            >
              <FormattedMessage
                id='scenes.faq.group.walletfunctionality.answer6.link'
                defaultMessage='here'
              />
            </Link>
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer6.two'
              defaultMessage=', a new address will automatically display under ‘Request’ once the previously displayed address receives a payment.'
            />
            <br />
            <br />
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer6.three'
              defaultMessage='In Settings > Addresses, you can click on ‘Manage’ to the right of each wallet to view all of the labeled addresses that have been generated for that specific wallet. Clicking ‘Used Addresses’ allows you to see every receiving addressed ever generated within the wallet, as well as the current balance of each of these used addresses.'
            />
            <span>&nbsp;</span>
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer6.four'
              defaultMessage="Please note that when you send funds, your Blockchain wallet automatically selects addresses to spend from. That's why the current balance of an address can be different from the total received value."
            />
          </FaqDescription>
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.walletfunctionality.question7'
            defaultMessage='How do I know if a transaction has been successfully received/sent?'
          />
        ),
        answer: (
          <FaqDescription>
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer7.one'
              defaultMessage='Transactions will appear almost instantly in your transaction feed. Each currency has its own feed, which you can find by clicking on the corresponding currency in the left navigation of your wallet. While your bitcoin and bitcoin cash transactions are considered complete once they have 3 network confirmations, your ether transactions will be considered complete after 12 confirmations.'
            />
            <span>&nbsp;</span>
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer7.two'
              defaultMessage='This typically takes about 30 minutes for bitcoin and bitcoin cash and 5 minutes for ether, but can vary. Until then, your transaction will show up as pending.'
            />
          </FaqDescription>
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.walletfunctionality.question8'
            defaultMessage='Can my transaction be canceled or reversed?'
          />
        ),
        answer: (
          <FaqDescription>
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer8.one'
              defaultMessage='No, unfortunately we are unable to cancel or reverse any transaction. Even advanced cryptocurrency users can recall an incident when they failed to double-check their transaction details and accidentally sent funds to the wrong recipient, or sent the wrong amount. By design,  transactions on cryptocurrency networks are designed to be irreversible and we have no control over them. Knowing this, it’s extremely important to make sure your transaction details are correct before you click send.'
            />
            <br />
            <br />
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer8.two'
              defaultMessage='To learn more about why transactions can’t be canceled and how this aspect of bitcoin and other similar cryptocurrencies compares to other methods of payment like credit cards and cash, check out our blog post on'
            />
            <span>&nbsp;</span>
            <Link
              href='https://blog.blockchain.com/2016/06/16/support-team-tips-bitcoin-transactions-and-chargebacks/'
              target='_blank'
              size='14px'
              weight={400}
            >
              <FormattedMessage
                id='scenes.faq.group.walletfunctionality.answer8.link'
                defaultMessage='Bitcoin Transactions & Chargebacks'
              />
            </Link>
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer8.three'
              defaultMessage='.'
            />
          </FaqDescription>
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.walletfunctionality.question9'
            defaultMessage="Why hasn't my transaction confirmed yet?"
          />
        ),
        answer: (
          <FaqDescription>
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer9.one'
              defaultMessage="Every cryptocurrency transaction that’s sent will flow into what's called the mempool (short for memory pool) before it can be confirmed by miners. When there's a dramatic spike in transaction activity, the mempool can become congested because so many transactions are waiting to be included in the next block."
            />
            <br />
            <br />
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer9.two'
              defaultMessage='An unconfirmed transaction will eventually either be accepted into a block by a mining pool, or be rejected by the network. If it is eventually rejected, the funds will remain on the address they were sent from. At this point, we can only recommend that you wait to see if your transaction is accepted into a block. Clicking the ⬆ icon in your transaction feed will relay to you the details of that  transaction through its respective explorer.'
            />
            <br />
            <br />
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer9.three'
              defaultMessage='Like all wallet providers, Blockchain has no control over the speed of confirmation, and unfortunately cannot expedite transactions. All we can suggest is using an appropriate transaction fee in order to incentivize a miner to include your transaction into a block. This is always dependent upon the network of miners. To learn more about how this works read our blog'
            />
            <span>&nbsp;</span>
            <Link
              href='https://blog.blockchain.com/2016/03/16/introducing-dynamic-fees/'
              target='_blank'
              size='14px'
              weight={400}
            >
              <FormattedMessage
                id='scenes.faq.group.walletfunctionality.answer9.link'
                defaultMessage='here'
              />
            </Link>
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer8.four'
              defaultMessage='.'
            />
          </FaqDescription>
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.walletfunctionality.question10'
            defaultMessage='What is a non-spendable address?'
          />
        ),
        answer: (
          <FaqDescription>
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer10.one'
              defaultMessage='A non-spendable address is a public key that you’ve imported into your wallet by navigating to Settings > Addresses > Import. With every public key, there is a private key behind it, and you need this key in order to spend the funds attached to the account. You can think of this private key as the ‘password’ to your public key.'
            />
            <br />
            <br />
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer10.two'
              defaultMessage='Non-spendable addresses are a useful feature to monitor incoming and outgoing transactions or to keep track of an address for repeated payments like rent. Keep in mind that sending and receiving to the same address makes your transaction history easy to trace. Alternatively, you can import a private key from a different wallet provider (which has your public key attached) and spend from it freely within your Blockchain wallet.'
            />
            <br />
            <br />
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer10.three'
              defaultMessage='Since your funds in these addresses are not backed up in your recovery phrase, we strongly recommend ‘transferring’ any funds from these addresses into your main accounts. In the past, you may have seen these accounts labelled ’watch-only’. In response to scams taking place due to lack of knowledge about the feature, we changed the label to ’non-spendable’ for clarity’s sake.'
            />
          </FaqDescription>
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.walletfunctionality.question11'
            defaultMessage='How can I look up a transaction on the blockchain?'
          />
        ),
        answer: (
          <FaqDescription>
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer11.one'
              defaultMessage='Block explorers provide a visually appealing and intuitive way to navigate different currencies’ block chains. For any transactions within your wallet, you can navigate to that currency’s tab and click on the ⬆ icon to view your transaction.'
            />
            <br />
            <br />
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer11.two.new'
              defaultMessage='We launched our Bitcoin explorer in August 2011 as a resource for the community to study bitcoin transactions, learn about the health of the network, and watch real-time incoming transactions.'
            />
            <br />
            <br />
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer11.three.new'
              defaultMessage='From 2018-2019, we launched our Ethereum and Bitcoin Cash explorers — further broadening the way crypto data is found and analyzed in a visually intuitive way. Visit'
            />
            <span>&nbsp;</span>
            <Link
              href='https://blockchain.com/explorer'
              target='_blank'
              size='14px'
              weight={400}
            >
              <FormattedMessage
                id='scenes.faq.group.walletfunctionality.answer11.link'
                defaultMessage='https://www.blockchain.com/explorer'
              />
            </Link>
            <span>&nbsp;</span>
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer11.four.new'
              defaultMessage='and use the search bar to learn more about a particular BTC, ETH or BCH address, transaction hash, or block number.'
            />
          </FaqDescription>
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.walletfunctionality.question12'
            defaultMessage='Why did my bitcoin cash address change?'
          />
        ),
        answer: (
          <FaqDescription>
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer12.one'
              defaultMessage='Since bitcoin cash is a fork of the bitcoin block chain, its address format previously looked nearly identical to that of bitcoin, which was very confusing to those using it. Now, when you want to send or receive bitcoin cash, you can immediately identify that you’re using the correct address thanks to the added prefix that looks like this: ’bitcoincash:’ in front of your bch address.'
            />
            <span>&nbsp;</span>
            <FormattedMessage
              id='scenes.faq.group.walletfunctionality.answer12.two'
              defaultMessage='Although you can technically still transact to and from legacy BCH addresses, we strongly recommend adopting this new format to eliminate confusion.'
            />
          </FaqDescription>
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.walletfunctionality.question13'
            defaultMessage='What is USD Digital and how does it differ from the other cryptocurrencies in my wallet?'
          />
        ),
        answer: (
          <FormattedMessage
            id='scenes.faq.group.walletfunctionality.answer13'
            defaultMessage='USD Digital is a cryptocurrency pegged to the U.S. dollar and issued by the Paxos Trust Company, a company organized under New York State banking law. USD Digital functions as a digital dollar - giving you instant liquidity in your wallet and a place to store stable value.'
          />
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.walletfunctionality.question14'
            defaultMessage='Why do I need a small amount of ETH to send or exchange PAX?'
          />
        ),
        answer: (
          <FormattedMessage
            id='scenes.faq.group.walletfunctionality.answer14'
            defaultMessage='USD Digital is built on the Ethereum blockchain following the ERC-20 protocol. For this reason, digital dollars can be sent to or received by anyone with an Ethereum wallet (such as your Blockchain Wallet) for a small miners fee.'
          />
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.walletfunctionality.question15'
            defaultMessage='How does USD Digital remain stable?'
          />
        ),
        answer: (
          <FormattedMessage
            id='scenes.faq.group.walletfunctionality.answer15'
            defaultMessage='USD Digital is regulated by the NY State Dept. of Financial Services which ensures all holdings of PAX are mirrored one-to-one for USD. Digital dollars are only in existence when the corresponding U.S dollars are in custody, which keeps the price stable at precisely $1.00.'
          />
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.walletfunctionality.question16'
            defaultMessage='How do I get USD Digital into my bank account?'
          />
        ),
        answer: (
          <FormattedMessage
            id='scenes.faq.group.walletfunctionality.answer16'
            defaultMessage='Although the price of USD Digital is pegged to USD, USD Digital remains a cryptocurrency token hosted on the Ethereum blockchain. For this reason, it must be exchanged for USD before your balance can be transferred to a bank account. You can do this through any exchange that supports the Paxos Standard Token (PAX).'
          />
        )
      }
    ]
  },
  {
    groupTitleMsg: (
      <FormattedMessage
        id='scenes.faq.group.walletsecurity.title'
        defaultMessage='Wallet Security'
      />
    ),
    groupQuestions: [
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.walletsecurity.question1'
            defaultMessage='What do I need to keep my wallet safe?'
          />
        ),
        answer: (
          <FaqDescription>
            <FormattedMessage
              id='scenes.faq.group.walletsecurity.answer1.one'
              defaultMessage='Our Security Center helps you to keep your wallet safe and ensures that you always have access to your funds - all in less than 5 minutes. A great place to start is to enable 2-Step Verification and write down your Backup Phrase to make sure you never lose access to your funds. We also recommend using a unique, random password that’s at least 16 characters or more.'
            />
            <span>&nbsp;</span>
            <NavLink
              to='/security-center'
              style={{
                textDecoration: 'none',
                color: Color('blue600')
              }}
            >
              <FormattedMessage
                id='scenes.faq.group.walletsecurity.answer1.navlink'
                defaultMessage='Click here'
              />
            </NavLink>
            <span>&nbsp;</span>
            <FormattedMessage
              id='scenes.faq.group.walletsecurity.answer1.two'
              defaultMessage='to get started.'
            />
          </FaqDescription>
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.walletsecurity.question2'
            defaultMessage='Can Blockchain see or access my funds?'
          />
        ),
        answer: (
          <FormattedMessage
            id='scenes.faq.group.walletsecurity.answer2'
            defaultMessage='We are a noncustodial wallet and therefore do not have access to your funds. This means we cannot view your balances, make payments on your behalf, or prevent you from accessing your funds. With your Blockchain wallet, you retain complete ownership of your finances.'
          />
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.walletsecurity.question3'
            defaultMessage='Can Blockchain reset my password?'
          />
        ),
        answer: (
          <FaqDescription>
            <FormattedMessage
              id='scenes.faq.group.walletsecurity.answer3.one'
              defaultMessage='At Blockchain, we’re committed to letting customers maintain full control of their funds. In that spirit, we never see or store your password, so we can’t reset it for you. However, we do provide users a backup phrase that can be used to restore access to your funds. Head over to your'
            />
            <NavLink
              to='/security-center'
              style={{
                textDecoration: 'none',
                color: Color('blue600')
              }}
            >
              <span>&nbsp;</span>
              <FormattedMessage
                id='scenes.faq.group.walletsecurity.answer3.navlink'
                defaultMessage='Security Center'
              />
            </NavLink>
            <span>&nbsp;</span>
            <FormattedMessage
              id='scenes.faq.group.walletsecurity.answer3.two'
              defaultMessage='to find yours. Make sure you store it somewhere secure offline and never share it.'
            />
          </FaqDescription>
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.walletsecurity.question4'
            defaultMessage='Can I close/delete my Blockchain Wallet?'
          />
        ),
        answer: (
          <FaqDescription>
            <FormattedMessage
              id='scenes.faq.group.walletsecurity.answer4.one'
              defaultMessage='It is currently not possible to delete a Blockchain digital currency wallet. All personally identifiable information, such as email address and sms phone number, can be removed in'
            />
            <span>&nbsp;</span>
            <NavLink
              to='/security-center'
              style={{
                textDecoration: 'none',
                color: Color('blue600')
              }}
            >
              <FormattedMessage
                id='scenes.faq.group.walletsecurity.answer4.navlink'
                defaultMessage='Security Center'
              />
            </NavLink>
            <span>&nbsp;</span>
            <FormattedMessage
              id='scenes.faq.group.walletsecurity.answer4.two'
              defaultMessage='and'
            />
            <span>&nbsp;</span>
            <NavLink
              to='/settings/preferences'
              style={{
                textDecoration: 'none',
                color: Color('blue600')
              }}
            >
              <FormattedMessage
                id='scenes.faq.group.walletsecurity.answer3.navlink2'
                defaultMessage='Preferences'
              />
            </NavLink>
            <span>&nbsp;</span>
            <FormattedMessage
              id='scenes.faq.group.walletsecurity.answer4.three'
              defaultMessage='by replacing them with an invalid submission. For example, one could use 555-5555 for the phone number, or abc@123.com as an email.'
            />
            <br />
            <br />
            <FormattedMessage
              id='scenes.faq.group.walletsecurity.answer4.four'
              defaultMessage='After replacing this associated information, and archiving all imported addresses within the “Addresses” section, all information pertaining to you has been removed. If you are the only one that knows your backup phrase, your wallet is essentially mute until you decide to use it again. We suggest keeping the wallet’s Backup Phrase in a safe place, in case you ever want to return to your wallet.'
            />
            <br />
            <br />
            <FormattedMessage
              id='scenes.faq.group.walletsecurity.answer4.five_update'
              defaultMessage='If you’ve created an account with one of our exchange partners, please reach out to their support teams for further assistance with removing your personal information from their records. For assistance with this, please reach out to our support team'
            />
            <span>&nbsp;</span>
            <Link
              href='https://support.blockchain.com/hc/en-us/requests/new'
              target='_blank'
              size='14px'
              weight={400}
            >
              <FormattedMessage
                id='scenes.faq.group.walletsecurity.answer4.link'
                defaultMessage='here'
              />
            </Link>
            <FormattedMessage
              id='scenes.faq.group.walletsecurity.answer4.six'
              defaultMessage='.'
            />
          </FaqDescription>
        )
      }
    ]
  },
  {
    groupTitleMsg: (
      <FormattedMessage
        id='scenes.faq.group.lockbox.title'
        defaultMessage='Lockbox - Hardware Wallet'
      />
    ),
    groupQuestions: [
      {
        answerId: '',
        question: (
          <FormattedMessage
            id='scenes.faq.group.lockbox.question1'
            defaultMessage='What is a Blockchain Lockbox and where can I buy one?'
          />
        ),
        answer: (
          <FaqDescription>
            <FormattedMessage
              id='scenes.faq.group.lockbox.answer1.one'
              defaultMessage='Lockbox is our custom hardware wallet, powered by Ledger. It’s the ultimate option for safe, offline crypto storage that syncs seamlessly with your Blockchain Wallet. You can order yours'
            />
            <span>&nbsp;</span>
            <Link
              href='https://www.blockchain.com/lockbox'
              target='_blank'
              size='14px'
              weight={400}
            >
              <FormattedMessage
                id='scenes.faq.group.lockbox.answer1.link'
                defaultMessage='here'
              />
            </Link>
            <FormattedMessage
              id='scenes.faq.group.lockbox.answer1.two'
              defaultMessage='.'
            />
          </FaqDescription>
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.lockbox.question2'
            defaultMessage='What is a hardware wallet?'
          />
        ),
        answer: (
          <FormattedMessage
            id='scenes.faq.group.lockbox.answer2.'
            defaultMessage='A hardware wallet is a physical device that is designed to be one of the safest options for cryptocurrency storage based on the way it stores your private keys offline. While your Blockchain Wallet is highly secure, in an event that someone gains access to your login information — Lockbox’s isolation of your private keys, along your device’s unique pin code, greatly reduces the risk of your information being compromised. Your Lockbox also comes equipped with a locked endpoint that is specifically designed to prevent phishing and spoofing attacks.'
          />
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.lockbox.question3'
            defaultMessage='What cryptocurrencies does Lockbox support?'
          />
        ),
        answer: (
          <FormattedMessage
            id='scenes.faq.group.lockbox.answer3.'
            defaultMessage='Your Lockbox will always be compatible with the cryptocurrencies supported in your Blockchain Wallet. Currently you can store, receive, send, and exchange BTC, ETH, BCH, and XLM.'
          />
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.lockbox.question4'
            defaultMessage='How do I transfer funds to or from my Lockbox?'
          />
        ),
        answer: (
          <FaqDescription>
            <FormattedMessage
              id='scenes.faq.group.lockbox.answer4.one'
              defaultMessage='You can transfer funds to and from your Lockbox by navigating to send and specifying the outgoing and incoming wallets via the ‘to’ and ‘from’ dropdowns. You do not need to have your device connected to your Wallet in order to receive, but you will need it connected in order to send. Need more help? You can find more detail'
            />
            <span>&nbsp;</span>
            <Link
              href='https://blockchain.zendesk.com/hc/en-us/articles/360018296692-Transferring-funds-between-your-Lockbox-and-web-wallet'
              target='_blank'
              size='14px'
              weight={400}
            >
              <FormattedMessage
                id='scenes.faq.group.lockbox.answer4.link'
                defaultMessage='here'
              />
            </Link>
            <FormattedMessage
              id='scenes.faq.group.lockbox.answer4.two'
              defaultMessage='.'
            />
          </FaqDescription>
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.lockbox.question5'
            defaultMessage='How do I send and receive funds with my Lockbox?'
          />
        ),
        answer: (
          <FaqDescription>
            <FormattedMessage
              id='scenes.faq.group.lockbox.answer5.one'
              defaultMessage='You can receive funds without having your Lockbox connected. To receive funds to your device, select “Lockbox” from the left navigation of your Wallet to get to your Lockbox dashboard. Once on your dashboard, select “Request”, along with which currency you wish to receive from the “currency” dropdown. Select “copy” to ensure you communicate the correct address to your sender.'
            />
            <br />
            <br />
            <FormattedMessage
              id='scenes.faq.group.lockbox.answer5.two'
              defaultMessage='To send funds from your Lockbox, make sure you are on your Lockbox dashboard. From there, select “send”, and ensure that you have your Lockbox plugged into your computer. Using the dropdowns, select a currency along with which Lockbox you wish to send funds from. Be certain to have your recipient send you an address for the correct currency that they wish to receive, which you’ll put into the “To” field. Enter the amount you wish to send, and continue to view your transaction details. On your Lockbox, open the corresponding application to the currency you wish to send, and authorize the transaction after making sure the address and/or amount are correct.'
            />
          </FaqDescription>
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.lockbox.question6'
            defaultMessage='How can I add or remove cryptocurrency applications from my Lockbox?'
          />
        ),
        answer: (
          <FaqDescription>
            <FormattedMessage
              id='scenes.faq.group.lockbox.answer6.one'
              defaultMessage='Cryptocurrency applications can be added or removed via the Lockbox dashboard in your Blockchain Web Wallet. Select “Get Apps” from your dashboard while your device is connected to your computer. From here, you’ll be able to access your app manager to install and uninstall apps. If you haven’t set up your Lockbox yet, you can read more about that process'
            />
            <span>&nbsp;</span>
            <Link
              href='https://support.blockchain.com/hc/en-us/articles/360018292712-Step-1-Connecting-your-new-device'
              target='_blank'
              size='14px'
              weight={400}
            >
              <FormattedMessage
                id='scenes.faq.group.lockbox.answer6.link'
                defaultMessage='here'
              />
            </Link>
            <FormattedMessage
              id='scenes.faq.group.lockbox.answer6.two'
              defaultMessage='.'
            />
          </FaqDescription>
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.lockbox.question7'
            defaultMessage='Is my Wallet’s backup phrase the same as my Lockbox’s?'
          />
        ),
        answer: (
          <FormattedMessage
            id='scenes.faq.group.lockbox.answer7.'
            defaultMessage='No, they’re different! As you’ll notice during your device’s initial set up process, you are prompted to record your Lockbox’s 24 word phrase and keep it safely stored offline. This phrase allows you to recover your funds if your Lockbox gets stolen, lost, or damaged - or if you forget your PIN code. As with your Wallet’s phrase, keep in mind that anyone with access to your backup phrase can restore your funds on their own device. We advise to keep this phrase your best kept secret.'
          />
        )
      }
    ]
  },
  {
    groupTitleMsg: (
      <FormattedMessage
        id='scenes.faq.group.educationalresources.title'
        defaultMessage='Educational Resources'
      />
    ),
    groupQuestions: [
      {
        answerId: '',
        question: (
          <FormattedMessage
            id='scenes.faq.group.educationalresources.question1'
            defaultMessage='What is block chain technology?'
          />
        ),
        answer: (
          <FaqDescription>
            <FormattedMessage
              id='scenes.faq.group.educationalresources.answer1.one'
              defaultMessage='The block chain is a uniquely architected database for digital transactions. To break it down— a block contains a record of new transactions and once that block is full, it is added to a chain of other blocks of transactions; hence the name “block chain”. This information is publicly viewable on an explorer,'
            />
            <span>&nbsp;</span>
            <FormattedMessage
              id='scenes.faq.group.educationalresources.answer1.two'
              defaultMessage='where eventually each transaction is approved or rejected by a network of computers (called miners). The block chain is considered immutable (meaning unchanging) because in order to alter a block, all previous blocks would have to also be altered. The vast majority of the community would have to agree on the change and be willing to update all subsequent blocks.'
            />
          </FaqDescription>
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.educationalresources.question2'
            defaultMessage='What is bitcoin?'
          />
        ),
        answer: (
          <FormattedMessage
            id='scenes.faq.group.educationalresources.answer2'
            defaultMessage='Bitcoin (BTC) is the first ever cryptocurrency and is used like other monetary assets in exchange for goods and services. Unlike traditional assets, bitcoin is easily portable, divisible, and irreversible. Bitcoin increases system efficiency and enables the provision of financial services at a drastically lower cost, giving users more power and freedom.'
          />
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.educationalresources.question3'
            defaultMessage='What is bitcoin cash?'
          />
        ),
        answer: (
          <FormattedMessage
            id='scenes.faq.group.educationalresources.answer3'
            defaultMessage='Bitcoin cash is a form of peer-to-peer electronic cash that was created after a fork of the Bitcoin block chain in August 2017. Bitcoin cash, or BCH, has since grown to be one of the top cryptocurrencies, along with bitcoin and ether.'
          />
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.educationalresources.question4'
            defaultMessage='What is ether?'
          />
        ),
        answer: (
          <FormattedMessage
            id='scenes.faq.group.educationalresources.answer4'
            defaultMessage='Ether is a decentralized digital currency, also known as ETH. In addition to being a tradeable cryptocurrency, ether powers the Ethereum network by paying for transaction fees and computational services. Ether is paving the way for a more intelligent financial platform.'
          />
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.educationalresources.whatisstellar'
            defaultMessage='What is stellar?'
          />
        ),
        answer: (
          <FormattedMessage
            id='scenes.faq.group.educationalresources.stellaranswer'
            defaultMessage='Stellar is an open-source, decentralized payment protocol that allows for fast, cross-border transactions between any pair of currencies. Like other cryptocurrencies, it operates using blockchain technology. Its native asset, a digital currency, is called lumen (XLM). XLM powers the Stellar network and all of its operations, similarly to how ether (ETH) powers the Ethereum network.'
          />
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.educationalresources.question5'
            defaultMessage='What are contract addresses?'
          />
        ),
        answer: (
          <FaqDescription>
            <FormattedMessage
              id='scenes.faq.group.educationalresources.answer5'
              defaultMessage='Contract addresses are programs that execute requirements set by their creators through running “if-this-then-that” conditions coded onto them. These contract codes can come in many forms, such as the transaction of money when certain conditions are met (think: paying artists a royalty fee every time their content is used), or the exchange of goods between parties (think: paying your monthly rent).'
            />
          </FaqDescription>
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.educationalresources.question6'
            defaultMessage='Does Blockchain support ERC20 tokens?'
          />
        ),
        answer: (
          <FormattedMessage
            id='scenes.faq.group.educationalresources.answer6'
            defaultMessage='We currently do not support ERC20 tokens, but we are working on adding this capability in the coming months. If you accidently send/receive funds from an ERC20 token to your Blockchain wallet, the funds will remain in the original address, you just won’t be able to access it on our platform (yet!).'
          />
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.educationalresources.question7'
            defaultMessage='What are ERC20 tokens?'
          />
        ),
        answer: (
          <FormattedMessage
            id='scenes.faq.group.educationalresources.answer7'
            defaultMessage='ERC-20 protocol is a standardized way of creating new tokens on the Ethereum block chain.'
          />
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.educationalresources.question8'
            defaultMessage='Where does Blockchain stand on hard forks?'
          />
        ),
        answer: (
          <FaqDescription>
            <FormattedMessage
              id='scenes.faq.group.educationalresources.answer8.one'
              defaultMessage='At Blockchain, our priority is always our users. Our view on network upgrades and forks is two-fold. First, we will prioritize user safety throughout any network upgrade or instability above all else. Second, we believe our users should maximally benefit from forks wherever feasible. Meaning, if 2 block chains are formed through a fork, we will follow the chain with the most accumulated difficulty and refer to that chain as the main chain. If we find that the minority chain has significant value, we will make that value available for customers once evaluated. It may be necessary to temporarily suspend outgoing transactions for a period of time while the network is unstable, and if this is the case, you will be sufficiently notified. Please keep in mind that you always have access to your funds via your backup phrase'
            />
            <span>&nbsp;</span>
            <NavLink
              to='/security-center'
              style={{
                textDecoration: 'none',
                color: Color('blue600')
              }}
            >
              <FormattedMessage
                id='scenes.faq.group.walletsecurity.answer8.link'
                defaultMessage='here'
              />
            </NavLink>
            <FormattedMessage
              id='scenes.faq.group.walletsecurity.answer8.two'
              defaultMessage='.'
            />
          </FaqDescription>
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.educationalresources.question9'
            defaultMessage='What are nodes?'
          />
        ),
        answer: (
          <FormattedMessage
            id='scenes.faq.group.educationalresources.answer9'
            defaultMessage='Nodes are powerful computers that run software and keep the network intact by approving or rejecting transactions and adding blocks to the chain.'
          />
        )
      },
      {
        question: (
          <FormattedMessage
            id='scenes.faq.group.educationalresources.question10'
            defaultMessage='What are miners?'
          />
        ),
        answer: (
          <FaqDescription>
            <FormattedMessage
              id='scenes.faq.group.educationalresources.answer10.one'
              defaultMessage='We refer to “mining nodes” as miners. Mining nodes group pending transactions into blocks and add them to the block chain. They do this by solving complex mathematical puzzles that come with the software, and include the answer into each block before adding it to the chain of other blocks. When funds are sent, every computer running a mining node receives the same transaction,'
            />
            <span>&nbsp;</span>
            <FormattedMessage
              id='scenes.faq.group.educationalresources.answer10.two'
              defaultMessage='and multiple people go to approve or deny it. If miners disagree on a transaction, the network automatically rejects the transaction that doesn’t match the rest: preventing fraud. It’s impossible for scammers to manipulate the system this way, since their copy of the block chain wouldn’t match the others, and each transaction has to be agreed upon.'
            />
          </FaqDescription>
        )
      }
    ]
  }
]
export default FaqContent
