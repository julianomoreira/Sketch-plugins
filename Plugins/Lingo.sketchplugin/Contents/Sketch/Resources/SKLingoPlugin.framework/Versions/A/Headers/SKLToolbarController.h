//
//  MainController.h
//  Lingo
//
//  Created by Wesley Byrne on 4/14/17.
//  Copyright © 2017 The Noun Project. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import <AppKit/AppKit.h>
#import "SKLToolbarButton.h"
#import "SKLKitPicker.h"
#import "SKLResolutionController.h"
#import "SKLStorage.h"
#import "SKLError.h"
#import "SKLStatusDetailController.h"
#import "SKLKit.h"
#import "SKLButton.h"
#import "SKLPullSession.h"
#import "SKLPushSession.h"


@class SKLToolbarWindow;

@interface SKLToolbarController : NSViewController <NSPopoverDelegate, SKKitPickerDelegate, SKLResolutionControllerDelegate, SKLStatusDetailControllerDelegate, SKLPushSessionDelegate, SKLPullSessionDelegate>


@property (readonly, nonatomic) BOOL isValid;

@property (weak) IBOutlet SKLButton *kitButton;

// Set during initialization in SKLmanager/SKLToolbarWindow
@property (weak, nonatomic) NSDocument * document;
@property (strong, nonatomic) NSString * documentID;

@property (readonly, nonatomic) SKLStorage * storage;

@property (strong, nonatomic) NSObject * command;

@property (readonly, nonatomic) BOOL shouldAutoShow;
@property (readonly, nonatomic) BOOL isSetup;
@property (weak, nonatomic) SKLToolbarWindow * toolbarWindow;

// Used to make calls back to JS passing SKLActions
@property (strong, nonatomic) NSObject * actionHandler;

// UI State
@property (nonatomic) BOOL showingPopover;

@property (strong, nonatomic) NSTimer * statusTimer;

// Data
@property (strong, nonatomic) SKLKit * kit;
@property (nonatomic) int selectionCount;

-(instancetype) initWithDocument:(NSDocument*)doc;

// Setup/Showing
-(void) setHandler: (NSObject*) h;
-(BOOL) show;

-(void) updateStatus:(NSInteger)stat;
-(void) updateStatusMessage:(NSString*)str;

-(void) pasteInDocument;
-(void) didDetectDragToDocument;
-(void) sendPasteboardDataToLingo;

-(void)showErrorAlert:(SKLError*)err;

-(void) refreshKitStatus;
//-(void) setSyncStatus:(SKLSyncStatus)stat;
//-(void) checkSyncStatusIfNeeded;

-(void) disableWithMessage:(NSString*)message action:(NSString*)action;

@end
