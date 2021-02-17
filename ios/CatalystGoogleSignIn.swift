import GAppAuth


@objc(CatalystGoogleSignIn)
class CatalystGoogleSignIn: NSObject {
  
  @objc func configure(_ options: NSDictionary, resolver: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) -> Void {
    if let scopes: Array<String> = options["scopes"] as? Array<String>  {
      for scope in scopes {
        GAppAuth.shared.appendAuthorizationRealm(scope)
      }
    } else {
      GAppAuth.shared.appendAuthorizationRealm(OIDScopeProfile)
    }
    
    resolver(NSNull())
  }
  
  @objc func isSignedIn(_ resolver: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) -> Void {
    let result = GAppAuth.shared.isAuthorized()
    resolver(NSNumber(value: result))
  }
  
  @objc func resetAuthorizationState(_ resolver: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) -> Void {
    GAppAuth.shared.resetAuthorizationState()
    resolver(NSNull())
  }
  
  @objc func getTokens(_ resolver: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock) -> Void {
    if (!GAppAuth.shared.isAuthorized()) {
      rejecter("getTokens", "getTokens requires a user to be signed in", nil)
    }
    
    resolver(self.getDictFromAuthState())
  }
  
  @objc func retrieveExistingAuthorizationState(_ options: NSDictionary, resolver:RCTPromiseResolveBlock, rejecter:RCTPromiseRejectBlock) -> Void {
    GAppAuth.shared.retrieveExistingAuthorizationState()
    if (GAppAuth.shared.isAuthorized()) {
      let dict = self.getDictFromAuthState()
      resolver(dict)
    } else {
      resolver(NSNull())
    }
  }
  
  @objc func signIn(_ options: NSDictionary, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) -> Void {
    DispatchQueue.main.async {
      if let vc = RCTPresentedViewController() {
        do {
          try GAppAuth.shared.authorize(in: vc) { auth in
            if auth {
              if GAppAuth.shared.isAuthorized() {
                let dict = self.getDictFromAuthState()
                resolver(dict)
              }
            } else {
              rejecter("no_auth", "login cancelled/failed", NSError.init(domain: "login_failed", code: 1, userInfo: nil))
            }
          }
        } catch let error {
          rejecter("auth_err", error.localizedDescription, error)
        }
      } else {
        rejecter("no_viewController", "no viewcontroller to present login ui in", NSError.init(domain: "no_viewController", code: 2, userInfo: nil))
      }
    }
  }
  
  func getDictFromAuthState() -> Dictionary<String, Optional<String>> {
    let authorization = GAppAuth.shared.getCurrentAuthorization()
    
    
    let tokenResponse = authorization?.authState.lastTokenResponse
    let serverAuthCode = tokenResponse?.additionalParameters?["server_code"] as? String
    
    let dict = [
      "accessToken": tokenResponse?.accessToken ?? "",
      "refreshToken": tokenResponse?.refreshToken ?? "",
      "idToken": tokenResponse?.idToken ?? "",
      "scopes": tokenResponse?.scope ?? "",
      "email": authorization?.userEmail,
      "serverAuthCode": serverAuthCode
    ]
    return dict
  }
  
//  does not appear to be needed actually
//  func watchUpdates() {
//    GAppAuth.shared.stateChangeCallback = { (state: OIDAuthState) -> Void in
//      let dict = self.getDictFromAuthState()
//      print(dict)
//    }
//    GAppAuth.shared.errorCallback = { state, err -> Void in
//      let dict = self.getDictFromAuthState()
//      print(dict)
//      print(err)
//    }
//  }
  
  @objc static func application(app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    let willContinueWithAuth = GAppAuth.shared.continueAuthorization(with: url, callback: nil)
    return willContinueWithAuth
  }
}
