//
//  SKLKitPicker.h
//  Lingo
//
//  Created by Wesley Byrne on 4/25/17.
//  Copyright © 2017 The Noun Project. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AppKit/AppKit.h>
#import "SKLKit.h"

@class SKLKitPicker;

@protocol SKKitPickerDelegate <NSObject>

-(void) kitPicker: (SKLKitPicker*)controller didSelectKit: (SKLKit*)kit;

@end



@interface SKLKitPicker : NSViewController <NSCollectionViewDataSource, NSCollectionViewDelegateFlowLayout, NSCollectionViewDelegate>

@property (weak, nonatomic) id <SKKitPickerDelegate> delegate;

-(void) refresh: (SKLKit*) currentKit;

@end

