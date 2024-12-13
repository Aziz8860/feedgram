import { View, Text, LogBox } from 'react-native';
import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Stack, useRouter, withLayoutContext } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { getUserData } from '../services/userService';

// START OF: untuk modal seperti iOS
// package yang dipake: @react-navigation/stack & react-navigation/native jadi kalo gaperlu dihapus aja tu di package.json
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';

const { Navigator } = createStackNavigator();

export const JsStack = withLayoutContext(Navigator);
// END OF: untuk modal seperti iOS

LogBox.ignoreLogs([
  'Warning: TNodeChildrenRenderer',
  'Warning: MemoizedTNodeRenderer',
  'Warning: TRenderEngineProvider',
]);
const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log('session user', session?.user?.id);

      if (session) {
        setAuth(session?.user);
        updateUserData(session?.user, session?.user?.email);
        router.replace('/home');
      } else {
        setAuth(null);
        router.replace('/welcome');
      }
    });
  }, []);

  const updateUserData = async (user, email) => {
    let res = await getUserData(user?.id);
    if (res.success) {
      setUserData({ ...res.data, email });
    }
  };

  return (
    <JsStack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="(main)/postDetails"
        options={{
          ...TransitionPresets.ModalPresentationIOS,
          presentation: 'modal',
          gestureEnabled: true,
        }}
      />
    </JsStack>
  );
};

export default _layout;
