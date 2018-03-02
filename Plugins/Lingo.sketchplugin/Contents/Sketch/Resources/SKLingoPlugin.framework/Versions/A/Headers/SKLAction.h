//
//  SKLAction.h
//  Lingo
//
//  Created by Wesley Byrne on 5/3/17.
//  Copyright © 2017 The Noun Project. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "SKLError.h"
#import "SKLSyncObject.h"
#import "SKLToolbarController.h"


@interface SKLAction : NSObject


typedef void (^SKLActionBlock)(id result, SKLError * error);

// Action Names
+(NSString*) PreparePushSessionName;
+(NSString*) ProcessPushDuplicatesName;

+(NSString*) PreparePasteboardName;

+(NSString*) PopulatePullSessionName;
+(NSString*) CreateSharedObjectInstanceName;

+(NSString*) CheckSyncStatusName;
+(NSString*) CreatePoolSourceName;
+(NSString*) GeneratePreviewName;

+(NSString*) RemoveSelectionName;
+(NSString*) AddToDocumentName;


//+(NSString *)GetLayerSyncIdListName;

// Conveniece Initializers
//+(instancetype)updateLinkedKitAction:(NSString*)newKitID;

+(instancetype)bundleForSyncObjectAction:(SKLSyncObject *)obj
                                 toolbar: (SKLToolbarController*)tBar
                                 handler: (SKLActionBlock)block;

@property (readonly, nonatomic) NSString * name;
@property (strong, nonatomic) id object;


@property (readonly, nonatomic) NSObject* document;
@property (readonly, nonatomic) NSObject* syncMap;

@property (strong, nonatomic) NSDictionary* info;
@property (readonly, nonatomic) BOOL debugMode;

-(instancetype)initWithName:(NSString*)aName
                     object:(id)anObject
                    toolbar: (SKLToolbarController*)tBar
                    handler:(SKLActionBlock)block;

-(instancetype)initWithName:(NSString*)aName
                     object:(id)anObject
                    toolbar: (SKLToolbarController*)tBar;


-(void) status:(id)stat;
-(void) success:(id)result;
-(void) error:(SKLError*)err;
-(void) errorWithTitle:(NSString*)title message: (NSString*)message;



@end
