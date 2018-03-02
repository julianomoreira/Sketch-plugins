//
//  SKLBorderView.h
//  Lingo
//
//  Created by Wesley Byrne on 4/14/17.
//  Copyright © 2017 The Noun Project. All rights reserved.
//

#import <Cocoa/Cocoa.h>

IB_DESIGNABLE
@interface SKLBorderView : NSView

@property (nonatomic) IBInspectable CGFloat borderWidth;
@property (nonatomic) IBInspectable CGFloat inset;
@property (nonatomic) IBInspectable BOOL leftBorder;
@property (nonatomic) IBInspectable BOOL rightBorder;

@property (nonatomic) IBInspectable BOOL topBorder;
@property (nonatomic) IBInspectable BOOL bottomBorder;
@property (nonatomic, strong) IBInspectable NSColor * borderColor;

@property (nonatomic, strong) IBInspectable NSColor * backgroundColor;

@end
