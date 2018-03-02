//
//  KitListItem.h
//  Lingo
//
//  Created by Wesley Byrne on 4/25/17.
//  Copyright © 2017 The Noun Project. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "SKLHoverView.h"

@interface SKLListItem : NSCollectionViewItem <NSCollectionViewElement, SKLHoverViewDelegate>

@property (weak) IBOutlet NSTextField *titleLabel;
@property (weak) IBOutlet NSImageView *badgeImageView;

@property (nonatomic) BOOL enabled;




@end
