//
//  SKLListHeaderView.h
//  Lingo
//
//  Created by Wesley Byrne on 4/26/17.
//  Copyright © 2017 The Noun Project. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import <AppKit/AppKit.h>
#import "SKLBorderView.h"

@interface SKLListHeaderView : SKLBorderView <NSCollectionViewElement>

@property (strong, nonatomic) NSTextField * titleLabel;

@end

