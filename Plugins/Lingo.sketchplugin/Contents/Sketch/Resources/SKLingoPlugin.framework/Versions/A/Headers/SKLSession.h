//
//  SKLSyncBatch.h
//  Lingo
//
//  Created by Wesley Byrne on 4/27/17.
//  Copyright © 2017 The Noun Project. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "SKLSyncObject.h"
#import "SKLDiff.h"
#import "SKLKit.h"
#import "SKLStorage.h"


typedef enum {
    SKLSyncUpdateTypeUpdateOnly = 0,
    SKLSyncUpdateTypeUpdateAndAdd = 1
} SKLSyncUpdateType;


@interface SKLSession : NSObject


@property (readonly, nonatomic) SKLKit * kit;
@property (readonly, nonatomic) NSMutableSet * unsyncedPool;

// clipboard, sync
@property (strong, nonatomic) NSString * method;


@property (readonly, nonatomic) NSDictionary<NSString*,SKLSyncObject*> * map;
@property (readonly, nonatomic) NSArray<SKLSyncObject*> * allObjects;

@property (readonly, nonatomic) SKLResolutionManager * resolutionManager;

@property (strong, nonatomic) SKLDiff * diff;

-(instancetype)initWithMethod: (NSString*)meth storage:(SKLStorage*)storage;

-(void) addSyncObject:(SKLSyncObject*) object;
-(void) addSketchObject:(NSObject*)obj data: (NSDictionary*)data archive: (NSDictionary*)archive;

-(SKLSyncObject*) objectForSyncID:(NSString*)objectID;

-(void) didUpdateSyncID:(NSString*)updatedID forObject:(SKLSyncObject*)obj;


@property (readonly, nonatomic) BOOL needsResolution;
@property (readonly, nonatomic) BOOL hasSilentChanges;
@property (readonly, nonatomic) NSArray * objectsToAdd; // Cached version of the result of commitResultions
-(NSArray*) commitResolutions;


@property (readonly, nonatomic) NSInteger insertCount;
@property (readonly, nonatomic) NSInteger updateCount;

@end



