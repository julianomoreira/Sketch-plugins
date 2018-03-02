//
//  SKLSyncBundle.h
//  Lingo
//
//  Created by Wesley Byrne on 4/27/17.
//  Copyright © 2017 The Noun Project. All rights reserved.
//

#import <Foundation/Foundation.h>

@class SKLSession;

typedef NS_ENUM(NSInteger, SKLDiffType) {
    SKLDiffTypeUpToDate = 0,
    SKLDiffTypeConflict = 1,
    SKLDiffTypeSketchModified = 2,
    SKLDiffTypeLingoModified = 3,
    SKLDiffTypeSketchNew = 4,
    SKLDiffTypeLingoNew = 5,
    SKLDiffTypeError = 6
};

typedef enum {
    SKLResolutionTypeNone = 0,
    SKLResolutionTypeInsertOrUpdate = 1,
    SKLResolutionTypeKeepBoth = 2
} SKLResolutionType;

typedef NS_ENUM(NSInteger, SKLConflictType) {
    SKLConflictTypeNone = 0,
    SKLConflictTypeMeta = 1,
    SKLConflictTypeData = 2,
    SKLConflictTypeName = 3
};


typedef NS_OPTIONS(NSInteger, SKLMergeWarning) {
    SKLMergeWarningOverwriteChanges = 1 << 0,
    SKLMergeWarningVersionChange    = 1 << 1,
    SKLMergeWarningBackwardsVersionChange    = 1 << 2,
};


@interface SKLSyncObject : NSObject

@property (strong, nonatomic) NSObject * object;
@property (readonly, nonatomic) NSString * syncID;

@property (readonly, nonatomic) NSString * storageKey;


@property (strong, nonatomic) NSDictionary * lingoJSON;


@property (readonly, nonatomic) NSInteger unarchiveVersion;

@property (strong, nonatomic) NSData * lingoArchiveData; // This has to be unarchived by sketch
@property (readonly, nonatomic) NSString * lingoArchiveString;
@property (readonly, nonatomic) NSString * lingoHashingVersion;

@property (strong, nonatomic) NSDictionary * sketchJSON;
@property (readonly, nonatomic) NSDictionary * sketchArchive;
@property (readonly, nonatomic) NSString * sketchHashingVersion;



@property (readonly, nonatomic) NSString * type;
@property (readonly, nonatomic) NSString * typeDisplayName;
@property (readonly, nonatomic) NSInteger typeRank;

@property (nonatomic) NSInteger skOrder;
@property (nonatomic) NSString * sectionUUID;

@property (strong, nonatomic) NSString * warningMessage;
@property (nonatomic) SKLMergeWarning mergeWarnings;
@property (nonatomic) SKLResolutionType resolutionType;

@property (nonatomic) SKLConflictType conflictType;
@property (readonly, nonatomic) BOOL isDataChanged;
@property (readonly, nonatomic) BOOL isSilentChange;

@property (readonly, nonatomic) BOOL hasWarnings;

@property (readonly, nonatomic) BOOL isNewObject;

@property (strong, nonatomic) NSDictionary * error;


+(NSInteger)rankForType:(NSString*)t;

-(instancetype) initWithSketchObject: (NSObject*)obj data: (NSDictionary*)data archive: (NSDictionary*)archive;
-(instancetype) initWithLingoData: (NSDictionary*) data;
-(void) populateSketchObject: (NSObject*)obj data:(NSDictionary*) data archive: (NSDictionary*)archive;

-(void) updateSyncID:(NSString*)newID;

-(void) addToDiffForSession:(SKLSession*)session;

-(NSComparisonResult) compare:(SKLSyncObject*)other;

@end
