# @react-native-google-signin/catalyst-google-sign-in

Deprecated: please use https://github.com/react-native-google-signin/google-signin


This is an implementation of google sign for react native (supports iOS only!) which supports Mac Catalyst.

The api is very similar to the existing [react-native-google-signin](https://github.com/react-native-google-signin/google-signin)

## Installation

```sh
npm install @react-native-google-signin/catalyst-google-sign-in
```

In your `Podfile` add:

```
pod 'GAppAuth'
pod 'GTMAppAuth', :modular_headers => true
pod 'AppAuth', :modular_headers => true
```

In your `Info.plist` file add:

```
  <key>GAppAuth</key>
  <dict>
      <key>RedirectUri</key>
      <string>com.googleusercontent.apps.YOUR_CLIENT_ID:/oauthredirect</string>
      <key>ClientId</key>
      <string>YOUR_CLIENT_ID.apps.googleusercontent.com</string>
  </dict>
  <key>CFBundleURLTypes</key>
  <array>
    <dict>
      <key>CFBundleURLSchemes</key>
      <array>
        <string>com.googleusercontent.apps.YOUR_CLIENT_ID</string>
      </array>
    </dict>
  </array>
```

In your `AppDelegate.m` add:

```
#import <RNCatalyst-google-sign-in/CatalystGoogleSignIn-Bridging-Header.h>

// ...

+ (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options {
  BOOL result = [CatalystGoogleSignIn application:app openURL:url options:options];

  return result;
}
```

## Usage

```js
import CatalystGoogleSignIn from "@react-native-google-signin/catalyst-google-sign-in";

// see the example project, documentation is lacking :D
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
