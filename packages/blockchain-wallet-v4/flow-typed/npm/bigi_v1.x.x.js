// flow-typed signature: b8258951c25ec9be87ea2f28c8694f33
// flow-typed version: da30fe6876/bigi_v1.x.x/flow_>=v0.25.x

declare class $npm$bigi$BigInteger {
  constructor(input: string | Array<number>, base?: number): void;
  static (input: string | Array<number>, base?: number): $npm$bigi$BigInteger;

  toString(base?: number): string;
  toByteArray(): Array<number>;
  bitLength(): number;
  byteLength(): number;
  add(o: $npm$bigi$BigInteger): $npm$bigi$BigInteger;
  subtract(o: $npm$bigi$BigInteger): $npm$bigi$BigInteger;
  multiply(o: $npm$bigi$BigInteger): $npm$bigi$BigInteger;
  divide(o: $npm$bigi$BigInteger): $npm$bigi$BigInteger;
  mod(o: $npm$bigi$BigInteger): $npm$bigi$BigInteger;
  modInverse(o: $npm$bigi$BigInteger): $npm$bigi$BigInteger;
  shiftLeft(o: number): $npm$bigi$BigInteger;
  shiftRight(o: number): $npm$bigi$BigInteger;
  isProbablePrime(): boolean;

  static fromByteArrayUnsigned(array: Array<number>): $npm$bigi$BigInteger;
  static fromBuffer(buffer: Buffer): $npm$bigi$BigInteger;
  static fromDERInteger(buffer: Buffer): $npm$bigi$BigInteger;
  static fromHex(hex: string): $npm$bigi$BigInteger;

  toByteArrayUnsigned(): Array<number>;
  toBuffer(): Buffer;
  toDERInteger(): Buffer;
  toHex(): string;
}

declare module "bigi" {
  declare module.exports: typeof $npm$bigi$BigInteger;
}
