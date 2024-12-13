import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useRef, useState } from 'react';
import Icon from '../assets/icons';
import ScreenWrapper from '../components/ScreenWrapper';
import { StatusBar } from 'expo-status-bar';
import BackButton from '../components/BackButton';
import { Link } from 'expo-router';
import { hp, wp } from '../utils/common';
import { theme } from '../constants/theme';
import Input from '../components/Input';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';

const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const email = emailRef.current?.trim();
    const password = passwordRef.current?.trim();

    if (!email || !password) {
      Alert.alert('Login', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    console.log(error);
    if (error) {
      Alert.alert('Login', error.message);
      return;
    }
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />

      <View style={styles.container}>
        {/* Use asChild to keep the existing BackButton styling */}
        <Link href=".." asChild>
          <>
            <BackButton />
          </>
        </Link>

        {/* welcome */}
        <View>
          <Text style={styles.welcomeText}>Hey,</Text>
          <Text style={styles.welcomeText}>Welcome Back</Text>
        </View>

        {/* form */}
        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Please login to continue
          </Text>
          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder="Enter your email"
            onChangeText={(value) => (emailRef.current = value)}
          />
          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={(value) => (passwordRef.current = value)}
          />
          <Text style={styles.forgotPassword}>Forgot Password?</Text>

          {/* Button */}
          <Button title={'Login'} loading={loading} onPress={onSubmit} />
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Link
            href="/signUp"
            style={[
              styles.footerText,
              {
                color: theme.colors.primaryDark,
                fontWeight: theme.fonts.semibold,
              },
            ]}
          >
            Sign Up
          </Link>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  form: {
    gap: 25,
  },
  forgotPassword: {
    textAlign: 'right',
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});
