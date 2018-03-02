//
//  SKLAssetErrorCell.h
//  Lingo
//
//  Created by Wesley Byrne on 7/17/17.
//  Copyright © 2017 The Noun Project. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "SKLPreviewGenerator.h"

@interface SKLAssetErrorCell : NSCollectionViewItem <SKLPreviewGeneratorDelegate>
@property (weak) IBOutlet NSTextField *titleLabel;
@property (weak) IBOutlet NSTextField *detaiLabel;
@property (weak) IBOutlet NSImageView *previewImageView;


-(void)setHasBorder:(BOOL)bordered;

@end
