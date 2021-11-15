export enum FunctionInputKind {
  Asset = 'asset',
  Count = 'count',
  Data = 'data',
  Index = 'index',
  Owner = 'owner',
  Replaceable = 'replaceable'
}

export enum FunctionOutputKind {
  Asset = 'asset',
  Count = 'count',
  Other = 'other',
  Owner = 'owner'
}

export enum StateMutability {
  Nonpayable = 'nonpayable',
  Payable = 'payable',
  Pure = 'pure',
  View = 'view'
}
