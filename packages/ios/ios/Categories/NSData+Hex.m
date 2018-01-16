//
//  NSData+Hex.m
//  Blockchain
//
//  Created by kevinwu on 1/16/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "NSData+Hex.h"

@implementation NSData (Hex)

- (NSString *)hexadecimalString {
  /* Returns hexadecimal string of NSData. Empty string if data is empty.   */
  
  const unsigned char *dataBuffer = (const unsigned char *)[self bytes];
  
  if (!dataBuffer)
    return [NSString string];
  
  NSUInteger          dataLength  = [self length];
  NSMutableString     *hexString  = [NSMutableString stringWithCapacity:(dataLength * 2)];
  
  for (int i = 0; i < dataLength; ++i)
    [hexString appendString:[NSString stringWithFormat:@"%02x", (unsigned int)dataBuffer[i]]];
  
  return [NSString stringWithString:hexString];
}

@end
