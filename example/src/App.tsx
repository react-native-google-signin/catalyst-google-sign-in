import * as React from 'react';

import { StyleSheet, Text, Button, ScrollView, View } from 'react-native';
import CatalystGoogleSignIn from '@react-native-google-signin/catalyst-google-sign-in';
// @ts-ignore
import GDrive from 'react-native-google-drive-api-wrapper';
import { useEffect } from 'react';

const SelectableText = (props: any) => <Text selectable {...props} />;

const stringifier = (json: Record<string, any>) =>
  JSON.stringify(json, null, 2);

const Divider = () => (
  <View style={{ height: 1, width: '100%', backgroundColor: 'black' }} />
);

export default function App() {
  const [authorizeResult, setAuthorizeResult] = React.useState<any>();
  const [currentUser, setCurrentUser] = React.useState<any>();
  const [existingResult, setExistingResult] = React.useState<any>();
  const [isSignedIn, setIsSignedIn] = React.useState<any>();
  const [isReset, setIsReset] = React.useState<any>(false);
  const [fileCreateResult, setFileCreateResult] = React.useState<any>(null);
  const [accessTokens, setAccessTokens] = React.useState<Array<string>>([]);

  useEffect(() => {
    CatalystGoogleSignIn.configure({
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    CatalystGoogleSignIn.signInSilently().then(setExistingResult);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <SelectableText>
        signIn result: {stringifier(authorizeResult)}
      </SelectableText>
      <Button
        title={'signIn'}
        onPress={() => {
          CatalystGoogleSignIn.signIn().then(setAuthorizeResult);
        }}
      />
      <Divider />

      <SelectableText>
        existingResult: {stringifier(existingResult)}
      </SelectableText>
      <Button
        title={'signInSilently'}
        onPress={() => {
          CatalystGoogleSignIn.signInSilently().then(setExistingResult);
        }}
      />
      <Divider />

      <SelectableText>isSignedIn: {stringifier(isSignedIn)}</SelectableText>
      <Button
        title={'isSignedIn'}
        onPress={() => {
          CatalystGoogleSignIn.isSignedIn().then(setIsSignedIn);
        }}
      />
      <Divider />

      <SelectableText>
        getCurrentUser: {stringifier(currentUser)}
      </SelectableText>
      <Button
        title={'getCurrentUser'}
        onPress={() => {
          CatalystGoogleSignIn.getCurrentUser().then(setCurrentUser);
        }}
      />
      <Divider />

      <SelectableText>isReset: {stringifier(isReset)}</SelectableText>
      <Button
        title={'signOut'}
        onPress={() => {
          CatalystGoogleSignIn.signOut().then(setIsReset);
        }}
      />
      <Divider />

      <Text>accessTokens</Text>
      <Text>{accessTokens.join(', ')}</Text>
      <Divider />

      <SelectableText>
        google drive magic result: {stringifier(fileCreateResult)}
      </SelectableText>
      <Button
        title={'create a file'}
        onPress={async () => {
          const { accessToken } = await CatalystGoogleSignIn.getTokens();
          setAccessTokens((currentTokens) => [...currentTokens, accessToken]);
          GDrive.setAccessToken(accessToken);
          GDrive.init();
          const contents = `Welcome from react native! ${new Date().toISOString()}`;
          const isBase64 = false;
          const result = await GDrive.files.createFileMultipart(
            contents,
            'text/plain',
            {
              parents: ['root'],
              name: 'My file',
            },
            isBase64
          );
          const json = await result.json();
          setFileCreateResult({
            result,
            json,
          });
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 15,
    marginTop: 50,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
