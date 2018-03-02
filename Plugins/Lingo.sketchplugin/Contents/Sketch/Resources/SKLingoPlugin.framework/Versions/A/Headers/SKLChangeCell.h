//
//  SKLChangeCell.h
//  Lingo
//
//  Created by Wesley Byrne on 5/2/17.
//  Copyright © 2017 The Noun Project. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "SKLView.h"
#import "SKLSyncObject.h"
#import "SKLPreviewGenerator.h"



@class SKLChangeCell, SKLResolutionController;

@protocol SKLChangeCellDelegate <NSObject>

-(void) changeCell:(SKLChangeCell*)cell didSelectResolutionType:(SKLResolutionType)type;

@end




@interface SKLChangeCell : NSCollectionViewItem <SKLPreviewGeneratorDelegate>

@property (assign, nonatomic) id<SKLChangeCellDelegate> delegate;


//-(void) setLingoEmpty;
//-(void) setLingoName:(NSString*)name type:(NSString*)type;
//-(void) setSketchName:(NSString*)name type:(NSString*)type;

//-(void)setError:(NSDictionary*)error;
-(void) setupForResolution:(SKLResolutionType)type;

-(void) setupWithObject:(SKLSyncObject*)obj controller: (SKLResolutionController*)controller;

@end
