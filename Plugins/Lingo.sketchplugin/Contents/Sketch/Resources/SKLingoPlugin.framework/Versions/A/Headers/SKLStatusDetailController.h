//
//  StatusDetailController.h
//  Lingo
//
//  Created by Wesley Byrne on 5/11/17.
//  Copyright © 2017 The Noun Project. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "SKLStatusItemCell.h"
#import "SKLStatusItem.h"


@protocol SKLStatusDetailControllerDelegate;


@interface SKLStatusDetailController : NSViewController <NSCollectionViewDataSource, NSCollectionViewDelegateFlowLayout, NSCollectionViewDelegate, SKLStatusItemCellDelegate>


@property (weak, nonatomic) id<SKLStatusDetailControllerDelegate> delegate;
@property (strong, nonatomic) NSArray * statusItems;


@end


@protocol SKLStatusDetailControllerDelegate <NSObject>

-(void) statusDetailController:(SKLStatusDetailController*)controller didSelectItem:(SKLStatusItem*)item;

@end
