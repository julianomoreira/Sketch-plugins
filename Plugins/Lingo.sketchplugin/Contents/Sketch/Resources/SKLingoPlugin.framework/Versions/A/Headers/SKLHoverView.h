//
//  SKLHoverView.h
//  Lingo
//
//  Created by Wesley Byrne on 4/25/17.
//  Copyright © 2017 The Noun Project. All rights reserved.
//

#import <Cocoa/Cocoa.h>

@class SKLHoverView;
@protocol SKLHoverViewDelegate <NSObject>

-(void) hoverView:(SKLHoverView*)view didChangeHoverState: (BOOL) hovered;

@end


IB_DESIGNABLE
@interface SKLHoverView : NSView


@property (nonatomic) IBInspectable BOOL useLayer;
@property (nonatomic, strong) IBInspectable NSColor * backgroundColor;
@property (nonatomic, strong) IBInspectable NSColor * highlightedBackgroundColor;

@property (weak, nonatomic) id<SKLHoverViewDelegate> delegate;

-(void) resetHoverState;

@end
