//
//  PasswordStretcher.m
//  Blockchain
//
//  Created by kevinwu on 1/16/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "PasswordStretcher.h"
#import "NSData+Hex.h"
#import <openssl/evp.h>

@implementation PasswordStretcher

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(stretchPassword:(NSString *)_password salt:(id)_salt iterations:(int)iterations keylength:(int)keylength hmacSHA1:(NSString *)hmacSHA1 callback:(RCTResponseSenderBlock)callback)
{
  uint8_t * finalOut = malloc(keylength);
  
  uint8_t * _saltBuff = NULL;
  size_t _saltBuffLen = 0;
  
  if ([_salt isKindOfClass:[NSArray class]]) {
    _saltBuff = alloca([_salt count]);
    _saltBuffLen = [_salt count];
    
    {
      int ii = 0;
      for (NSNumber * number in _salt) {
        _saltBuff[ii] = [number shortValue];
        ++ii;
      }
    }
  } else if ([_salt isKindOfClass:[NSString class]]) {
    _saltBuff = (uint8_t*)[_salt UTF8String];
    _saltBuffLen = [_salt length];
  } else {
    callback(@[[[NSData new] hexadecimalString]]);
  }
  
  const char *passwordUTF8String = [_password UTF8String];
  
  if (PKCS5_PBKDF2_HMAC_SHA1(passwordUTF8String, (int)strlen(passwordUTF8String), _saltBuff, (int)_saltBuffLen, iterations, keylength, finalOut) == 0) {
    callback(@[[[NSData new] hexadecimalString]]);
  };
  
  callback(@[[[NSData dataWithBytesNoCopy:finalOut length:keylength] hexadecimalString]]);
}

@end
