//
//  SKLToolbarButton.h
//  Lingo
//
//  Created by Wesley Byrne on 4/14/17.
//  Copyright © 2017 The Noun Project. All rights reserved.
//

#import <Cocoa/Cocoa.h>

IB_DESIGNABLE
@interface SKLToolbarButton : NSButton

@property (nonatomic) IBInspectable BOOL custom;
@property (nonatomic) BOOL keepHighlighted;


@end
