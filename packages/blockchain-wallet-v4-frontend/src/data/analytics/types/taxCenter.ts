export enum TaxCenterEvents {
  TAX_CENTER_CLICKED = 'Wallet Tax Center Clicked',
  TAX_CENTER_LINK_EXCHANGE_CLICKED = 'Exchange Tax Center Clicked',
  TAX_CENTER_MORE_INFO_CLICKED = 'Tax Center More Info Clicked',
  TAX_CENTER_PARTNER_CLICKED = 'Tax Partner Website Clicked',
  TAX_CENTER_REPORT_CLICKED = 'Export Tax Report Clicked',
  TAX_CENTER_REPORT_EXPORT_CLICKED = 'Generate Tax Report Export Clicked',
  TAX_CENTER_VIEWED = 'Tax Center Viewed'
}

type Partner = 'CoinTracker'

type OriginTaxCenter = 'SETTINGS' | 'EXCHANGE_TAX_CENTER' | 'WALLET_TAX_CENTER'

type TimePeriod = 'ALL_TIME' | string

type TaxCenterInfoActions = {
  key:
    | TaxCenterEvents.TAX_CENTER_CLICKED
    | TaxCenterEvents.TAX_CENTER_MORE_INFO_CLICKED
    | TaxCenterEvents.TAX_CENTER_LINK_EXCHANGE_CLICKED
  properties: {
    origin: OriginTaxCenter
  }
}

type TaxPartnerWebsiteClickedAction = {
  key: TaxCenterEvents.TAX_CENTER_PARTNER_CLICKED
  properties: {
    partner: Partner
  }
}

type TaxCenterViewedAction = {
  key: TaxCenterEvents.TAX_CENTER_VIEWED
  properties: {
    path: string
    referrer: string
    search: string
    title: string
    url: string
  }
}

type TaxCenterExportReportAction = {
  key: TaxCenterEvents.TAX_CENTER_REPORT_EXPORT_CLICKED | TaxCenterEvents.TAX_CENTER_REPORT_CLICKED
  properties: {
    origin: OriginTaxCenter
    time_period: TimePeriod
  }
}

export type TaxCenterActions =
  | TaxCenterExportReportAction
  | TaxCenterInfoActions
  | TaxCenterViewedAction
  | TaxPartnerWebsiteClickedAction
