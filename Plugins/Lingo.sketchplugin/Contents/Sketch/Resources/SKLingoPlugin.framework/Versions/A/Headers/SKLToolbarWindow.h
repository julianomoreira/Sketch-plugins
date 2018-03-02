//
//  SKLDocumentController.h
//  Lingo
//
//  Created by Wesley Byrne on 4/14/17.
//  Copyright © 2017 The Noun Project. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import "SKLToolbarController.h"



@interface SKLToolbarWindow : NSWindowController

// The sketch document window
@property (weak, nonatomic) NSWindow * documentWindow;
@property (strong, nonatomic) SKLToolbarController * toolbarController;

-(instancetype)initWithDocument: (NSDocument*) doc documentWindow: (NSWindow*)docWindow;
-(void) show;

//-(void) closeButtonSelected;

-(void) actuallyClose;

// Disabling
-(void) enable;
-(void) disableForRestart;
-(void) disableForLingoLaunch;
-(void) disableForLingoUpdate;
-(void) disableForInvalidPlugin;

@end
