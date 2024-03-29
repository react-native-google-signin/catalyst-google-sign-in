import { NativeModules } from 'react-native';
const { CatalystGoogleSignIn } = NativeModules;

type ConfigParam = {
  scopes?: Array<string>;
};

type AuthState = {
  accessToken: string;
  serverAuthCode: string;
  refreshToken: string;
  idToken: string;
  email?: string;
  scopes: string;
};

export type RNGoogleSignInReturnType = {
  idToken: string;
  serverAuthCode: string;
  scopes: Array<string>;
  user: {
    email: string;
    id: string;
    givenName: string;
    familyName: string;
    photo: string; // url
    name: string; // full name
  };
};

type GoogAuthResponse = {
  id: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
};

type CatalystGoogleSignInType = {
  configure(opts: ConfigParam): Promise<null>;
  retrieveExistingAuthorizationState(opts: ConfigParam): Promise<AuthState>;
  getTokens(): Promise<{ accessToken: string; idToken: string }>;
  signIn(opts: ConfigParam): Promise<AuthState>;
  isSignedIn(): Promise<boolean>;
  resetAuthorizationState(): Promise<null>;
};

const TypedCatalystGoogleSignIn: CatalystGoogleSignInType = CatalystGoogleSignIn;

let configPromise = Promise.resolve(null);

async function hasGooglePlayServices() {
  // just here to mimic the api of https://github.com/react-native-google-signin/google-signin
  return true;
}

function configure(options: ConfigParam = {}) {
  configPromise = TypedCatalystGoogleSignIn.configure(options);
}

async function getReturnObject(gtmAppAuthResult: AuthState) {
  const {
    idToken,
    serverAuthCode,
    accessToken,
    scopes,
    email,
  } = gtmAppAuthResult;
  const {
    given_name,
    family_name,
    name,
    picture,
    id,
  }: GoogAuthResponse = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
  ).then((resp) => resp.json());
  return {
    idToken,
    serverAuthCode,
    scopes: scopes.split(' '),
    user: {
      email: email || '',
      id,
      givenName: given_name,
      familyName: family_name,
      photo: picture, // url
      name, // full name
    },
  };
}

async function signIn(): Promise<RNGoogleSignInReturnType> {
  await configPromise;
  const gtmAppAuthResponse = await TypedCatalystGoogleSignIn.signIn({});
  const result = await getReturnObject(gtmAppAuthResponse);
  return result;
}

function isSignedIn(): Promise<boolean> {
  return TypedCatalystGoogleSignIn.isSignedIn();
}

async function signInSilently(): Promise<RNGoogleSignInReturnType> {
  await configPromise;
  const existingAuth = await TypedCatalystGoogleSignIn.retrieveExistingAuthorizationState(
    {}
  );
  if (!existingAuth) {
    const error = new Error('SIGN_IN_REQUIRED');
    // imitate GIDSignInErrorCode kGIDSignInErrorCodeHasNoAuthInKeychain
    // @ts-ignore
    error.code = -4;
    throw error;
  }
  const result = await getReturnObject(existingAuth);
  return result;
}

async function getCurrentUser(): Promise<RNGoogleSignInReturnType | null> {
  try {
    return await signInSilently();
  } catch (e) {
    return null;
  }
}

async function getTokens(): Promise<{
  idToken: string;
  accessToken: string;
}> {
  await configPromise;
  const tokens = await TypedCatalystGoogleSignIn.getTokens();
  return tokens;
}

async function signOut() {
  return await TypedCatalystGoogleSignIn.resetAuthorizationState();
}

async function revokeAccess(accessToken: string) {
  // see https://github.com/google/GTMAppAuth/issues/9
  const revokeUrl = `https://oauth2.googleapis.com/revoke?token=${accessToken}`;
  return fetch(revokeUrl, { method: 'POST' }).then((resp) => {
    if (resp.ok) {
      return null;
    } else {
      throw new Error('error revoking token, status: ' + resp.status);
    }
  });
}

export default {
  revokeAccess,
  signOut,
  hasGooglePlayServices,
  configure,
  signIn,
  isSignedIn,
  signInSilently,
  getCurrentUser,
  getTokens,
};
