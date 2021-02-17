#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>


@interface CatalystGoogleSignIn : NSObject
+(BOOL)application:(UIApplication *)app
           openURL:(NSURL *)url
           options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options;
@end
