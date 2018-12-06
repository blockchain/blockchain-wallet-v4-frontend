export default {
  platforms: {
    web: {
      application: {
        enableDomainMigrationRedirects: true,
        announcements: {
          public: {},
          wallet: {},
          sendBch: {},
          receiveBch: {}
        }
      },
      btc: {
        availability: {
          send: true,
          request: true,
          lockbox: true,
          exchange: true
        },
        config: {
          network: 'bitcoin'
        }
      },
      bch: {
        availability: {
          send: true,
          request: true,
          lockbox: true,
          exchange: true
        }
      },
      eth: {
        availability: {
          send: true,
          request: true,
          lockbox: false,
          exchange: false
        },
        lastTxFuse: 86400,
        config: {
          network: 'mainnet'
        }
      },
      xlm: {
        availability: {
          send: true,
          request: true,
          lockbox: true,
          exchange: true
        },
        config: {
          network: 'public'
        }
      }
    }
  }
}
