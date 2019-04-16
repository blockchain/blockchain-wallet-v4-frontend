export default {
  platforms: {
    web: {
      application: {
        analyticsSiteId: 1,
        enableDomainMigrationRedirects: true,
        environment: 'dev',
        announcements: {
          public: {},
          wallet: {}
        }
      },
      coins: {
        BTC: {
          availability: {
            send: true,
            request: true,
            lockbox: true,
            exchangeTo: true,
            exchangeFrom: true
          },
          coinCode: 'BTC',
          coinTicker: 'BTC',
          colorCode: 'btc',
          config: {
            network: 'bitcoin'
          },
          displayName: 'Bitcoin',
          hasLockboxSupport: true,
          icons: {
            default: 'btc',
            circle: 'btc-circle',
            circleFilled: 'btc-circle-filled'
          },
          learnMoreLink:
            'https://www.blockchain.com/learning-portal/bitcoin-faq',
          minConfirmations: 3,
          name: 'Bitcoin',
          txExplorerBaseUrl: 'https://blockchain.com/btc/tx',
          txListAppRoute: '/btc/transactions'
        },
        BCH: {
          availability: {
            send: true,
            request: true,
            lockbox: true,
            exchangeTo: true,
            exchangeFrom: true
          },
          coinCode: 'BCH',
          coinTicker: 'BCH',
          colorCode: 'bch',
          config: {
            fees: {
              regular: 4,
              priority: 4
            }
          },
          displayName: 'Bitcoin Cash',
          hasLockboxSupport: true,
          icons: {
            default: 'bch',
            circle: 'bch-circle',
            circleFilled: 'bch-circle-filled'
          },
          minConfirmations: 3,
          name: 'Bitcoin Cash',
          txExplorerBaseUrl: 'https://blockchain.com/bch/tx',
          txListAppRoute: '/bch/transactions'
        },
        BSV: {
          availability: {
            send: true,
            request: false,
            lockbox: false,
            exchangeTo: false,
            exchangeFrom: true
          },
          coinCode: 'BSV',
          coinTicker: 'BSV',
          colorCode: 'bsv',
          config: {
            fees: {
              regular: 4,
              priority: 4
            }
          },
          displayName: 'Bitcoin SV',
          hasLockboxSupport: false,
          icons: {
            default: 'bsv'
          },
          minConfirmations: 3,
          name: 'Bitcoin SV',
          txExplorerBaseUrl: 'https://blockchair.com/bitcoin-sv/transaction'
        },
        ETH: {
          availability: {
            send: true,
            request: true,
            lockbox: true,
            exchangeTo: true,
            exchangeFrom: true
          },
          coinCode: 'ETH',
          coinTicker: 'ETH',
          colorCode: 'eth',
          config: {
            network: 1
          },
          displayName: 'Ethereum',
          hasLockboxSupport: true,
          icons: {
            default: 'eth',
            circle: 'eth-circle',
            circleFilled: 'eth-circle-filled'
          },
          lastTxFuse: 86400,
          minConfirmations: 12,
          name: 'Ethereum',
          txExplorerBaseUrl: 'https://www.blockchain.com/eth/tx',
          txListAppRoute: '/eth/transactions'
        },
        PAX: {
          availability: {
            send: true,
            request: true,
            lockbox: false,
            exchangeTo: true,
            exchangeFrom: true
          },
          coinCode: 'PAX',
          coinTicker: 'USDp',
          colorCode: 'pax',
          contractAddress: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
          displayName: 'USD Pax',
          hasLockboxSupport: false,
          icons: {
            default: 'usdp',
            circle: 'usdp',
            circleFilled: 'usdp'
          },
          minConfirmations: 12,
          name: 'Paxos',
          txExplorerBaseUrl: 'https://www.blockchain.com/eth/tx',
          txListAppRoute: '/pax/transactions',
          showNewTagSidenav: true
        },
        XLM: {
          airdrop: {
            name: 'SUNRIVER',
            link:
              'https://support.blockchain.com/hc/en-us/categories/360001126692-Crypto-Giveaway',
            image: 'stellar-planet'
          },
          availability: {
            send: true,
            request: true,
            lockbox: true,
            exchangeTo: true,
            exchangeFrom: true
          },
          campaign: 'sunriver',
          coinCode: 'XLM',
          coinTicker: 'XLM',
          colorCode: 'xlm',
          config: {
            network: 'public'
          },
          displayName: 'Stellar',
          hasLockboxSupport: true,
          icons: {
            default: 'xlm',
            circle: 'xlm-circle',
            circleFilled: 'xlm-circle-filled'
          },
          minConfirmations: 1,
          name: 'Stellar',
          txExplorerBaseUrl: 'https://stellarchain.io/tx',
          txListAppRoute: '/xlm/transactions'
        }
      }
    }
  }
}
