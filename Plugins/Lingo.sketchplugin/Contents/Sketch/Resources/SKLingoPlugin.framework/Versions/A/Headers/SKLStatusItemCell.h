//
//  SKLStatusItemCell.h
//  Lingo
//
//  Created by Wesley Byrne on 7/17/17.
//  Copyright © 2017 The Noun Project. All rights reserved.
//

#import <Cocoa/Cocoa.h>


@protocol SKLStatusItemCellDelegate;

@interface SKLStatusItemCell : NSCollectionViewItem

@property (weak, nonatomic) id<SKLStatusItemCellDelegate> delegate;

@property (weak) IBOutlet NSImageView *badgeImageView;
@property (weak) IBOutlet NSTextField *titleLabel;
@property (weak) IBOutlet NSButton *button;

@end



@protocol SKLStatusItemCellDelegate <NSObject>

-(void) statusItemCellDidSelectButton:(SKLStatusItemCell*)cell;

@end
