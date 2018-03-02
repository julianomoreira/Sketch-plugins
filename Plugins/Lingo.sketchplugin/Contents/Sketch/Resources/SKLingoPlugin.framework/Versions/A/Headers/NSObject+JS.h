//
//  NSObject+JS.h
//  Lingo
//
//  Created by Wesley Byrne on 4/27/17.
//  Copyright © 2017 The Noun Project. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "SKLAction.h"


@interface NSObject (Handler)
-(BOOL) callJSTarget:(id)object;
+(void)performBlock:(void (^)(void))block
          afterDelay:(NSTimeInterval)delay;

-(id) metaForKey:(NSString*)key;
//-(void) storeMeta:(id)val forKey:(NSString*)key;

-(id) valueForProperty:(NSString*)key;
@end



@interface NSArray (Remove)
- (NSArray *)arrayByRemovingFirst;
@end

@interface NSArray (ComparisonHash)
- (NSArray *) flattenContents;
@end

@interface NSDictionary (ComparisonHash)
- (NSArray *)sortedKeyValuePairs;
@end




@interface StringSpec : NSObject
@property (strong, nonatomic) NSString * content;
@property (strong, nonatomic) NSColor * color;
@property (strong, nonatomic) NSFont * font;
@property (nonatomic) BOOL italic;

@property (readonly, nonatomic) NSDictionary * attributes;


+(instancetype)specWithContent:(NSString*)str;
+(instancetype)specWithContent:(NSString*)str bold: (BOOL)bold;
+(instancetype)specWithContent:(NSString *)str color:(NSColor*)color bold:(BOOL)bold;
+(instancetype)specWithContent:(NSString *)str color:(NSColor*)color font:(NSFont*)font;
@end


@interface NSAttributedString (Specs)
+(NSAttributedString*)stringWithSpecs:(NSArray*)specs;
+(NSAttributedString*) stringWithSpecContent:(NSString*)content;
@end

