import { NativeModules } from 'react-native';

type CatalystGoogleSignInType = {
  multiply(a: number, b: number): Promise<number>;
};

const { CatalystGoogleSignIn } = NativeModules;

export default CatalystGoogleSignIn as CatalystGoogleSignInType;
