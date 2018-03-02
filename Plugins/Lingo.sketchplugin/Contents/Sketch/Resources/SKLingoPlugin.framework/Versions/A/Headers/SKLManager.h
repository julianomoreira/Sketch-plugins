//
//  SketchLingoPlugin.h
//  SketchLingoPlugin
//
//  Created by Wesley Byrne on 4/14/17.
//  Copyright © 2017 The Noun Project. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AppKit/AppKit.h>
#import "SKLToolbarWindow.h"
#import "SKLUtils.h"
#import "SKLError.h"

typedef enum {
    SKLPluginStatusNeedsRestart,
    SKLPluginStatusNeedsLingoUpdate,
    SKLPluginStatusInvalidPlugin,
    SKLPluginStatusNeedsLingoOpen,
    SKLPluginStatusOK
} SKLPluginStatus;


@interface SKLManager : NSObject

@property (strong, readonly) NSStoryboard * _Nonnull storyboard;
@property (strong, readonly) NSBundle * _Nonnull bundle;


@property (readonly, nonatomic) NSInteger sketchVersion;
@property (readonly, nonatomic) NSInteger pluginVersion;
@property (nonatomic) BOOL debugMode;

@property (nonatomic) SKLPluginStatus pluginStatus;

@property (strong, nonatomic) NSString * lingoBundleID;


+(SKLManager*_Nonnull)shared;

// Used in the plugin
-(void) pluginDidReload;
-(SKLToolbarController*) toolbarForDocument:(NSDocument*)doc;
-(void) removeToolbar:(SKLToolbarController*)t;

-(void) updateLastCopyToolbar:(SKLToolbarController*)toolbar;
-(void) updatePossibleDragToolbar:(SKLToolbarController*)toolbar;


-(void) restartSketch;
-(void) updateLingo;
-(void) openLingo;
-(void) updatePlugin;
-(void) checkLingoStatus;

// Internal use


-(void) makeDataRequest:(NSString *_Nonnull)method
                  toPath:(NSString * _Nonnull)path
                withBody:(NSDictionary * _Nullable)body
       completionHandler:(void(^_Nonnull)(NSDictionary * _Nullable response, SKLError * _Nullable error)) handler;


@end



