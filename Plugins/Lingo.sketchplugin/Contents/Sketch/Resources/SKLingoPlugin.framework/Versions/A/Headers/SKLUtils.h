//
//  LingoHelpers.h
//  Lingo
//
//  Created by Wesley Byrne on 4/19/17.
//  Copyright © 2017 The Noun Project. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AppKit/AppKit.h>

typedef void (^Block)(void);
void run_main(Block block);


extern void SKLLog(NSString * _Nonnull format, ...);

extern void SKLDebugLog(NSString * _Nonnull format, ...);

extern void SKLDump(id _Nullable object);


@interface SKLUtils : NSObject

+(NSString*)debugLogPath;



// Block Helpers
+(void) runMainAndWait:(NSObject*)block;


// Hashing

+(BOOL) isSketchColor:(NSDictionary*)sk equalToLingoColor:(NSDictionary*)lg;
+(NSString *)hashForHue:(CGFloat)hue saturation:(CGFloat)saturation brightness:(CGFloat)brightness alpha: (CGFloat)alpha;

+(NSString*) hashForLayerArchive:(NSData*)data;
+(NSArray *) modifiedLayerArchive:(NSData *)data;

+(NSString*) hashForStyleArchive:(NSData*)data;
+(NSArray *) modifiedStyleArchive:(NSData *)data;

+(NSImage*)imageNamed:(NSString*)name;

+(void) addSymbolsToPasteboard:(NSArray*)symbols layers: (NSArray*)layers;
+(NSString*) rgbaFromNSString:(NSColor*)color;
+ (NSString *)hexStringFromColor:(NSColor *)color;



@end


@interface SKLMenuItem : NSMenuItem

@property (strong, nonatomic) NSString * versionIdentifier;
-(instancetype) initWithTitle:(NSString*)title identifier:(NSString*)identifier target:(id)aTarget selector:(SEL)aSelector;
@end


@interface NSString (Plural)

-(NSString*) pluralize:(NSInteger)count;

@end


@interface NSView (Constraints)
-(void)setWidthConstraint:(CGFloat)width;
-(void)setWidthConstraint:(CGFloat)width relation:(NSLayoutRelation)relation;
-(void)setHeightConstraint:(CGFloat)height;
-(void)setHeightConstraint:(CGFloat)height relation:(NSLayoutRelation)relation;
-(NSLayoutConstraint*)constraintLockingAttribute:(NSLayoutAttribute)attribute toAttribute:(NSLayoutAttribute)otherAttr ofView:(NSView*)otherView;
-(NSLayoutConstraint *)constraintLockingAttribute:(NSLayoutAttribute)attribute toAttribute:(NSLayoutAttribute)otherAttr ofView:(NSView *)otherView constant:(CGFloat)constant;
-(void) addConstraintsToParent:(CGFloat)left top:(CGFloat)top right:(CGFloat)left bottom:(CGFloat)bottom;
@end

