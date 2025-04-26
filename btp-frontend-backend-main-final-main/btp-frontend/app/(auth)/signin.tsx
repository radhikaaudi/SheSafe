import React ,{ useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useWindowDimensions, Platform, Image, Animated } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { CheckCircle } from 'lucide-react-native';

export default function SignIn() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const errorFadeAnim = React.useRef(new Animated.Value(0)).current;

  const showSuccessMessage = () => {
    setShowSuccess(true);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSuccess(false);
      router.replace('/(tabs)');
    });
  };

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
    Animated.sequence([
      Animated.timing(errorFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(errorFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowError(false);
    });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async () => {
    try {
      setError('');
      
      if (!email) {
        showErrorMessage('Please enter your email');
        return;
      }
      
      if (!validateEmail(email)) {
        showErrorMessage('Please enter a valid email address');
        return;
      }
      
      if (!password) {
        showErrorMessage('Please enter your password');
        return;
      }
      
      await signInWithEmailAndPassword(auth, email, password);
      showSuccessMessage();
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        showErrorMessage('Invalid email or password');
      } else if (err.code === 'auth/user-not-found') {
        showErrorMessage('Account does not exist. Please create an account first.');
      } else if (err.code === 'auth/wrong-password') {
        showErrorMessage('Incorrect password. Please try again.');
      } else {
        showErrorMessage(err.message);
      }
    }
  };

  return (

    
    <View style={styles.container}>
      
      {showSuccess && (
        <Animated.View 
          style={[
            styles.successMessage, 
            { 
              opacity: fadeAnim,
              transform: [
                { 
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 0]
                  })
                }
              ]
            }
          ]}
        >
          <CheckCircle size={24} color="#fff" />
          <Text style={styles.successText}>Login Successful!</Text>
        </Animated.View>
      )}
      
      {showError && (
        <Animated.View style={[styles.errorMessage, { opacity: errorFadeAnim }]}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </Animated.View>
      )}
      
      {!isSmallScreen && (
        <View style={styles.imageContainer}>
          <Image
                     source={require('../../image/back.png')}
                     style={styles.backgroundImage}
          />
         
        
      
          <View style={styles.overlay}>
            {/* <Text style={styles.imageTitle}></Text>
            <Text style={styles.imageSubtitle}>Your safety companion</Text> */}
          </View>
        </View>
      )}
      
      <View style={[styles.content, !isSmallScreen && styles.contentWide]}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue your safety journey</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Create an Account</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  imageContainer: {
    flex: 1,
    //display: 'none',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageTitle: {
    fontSize: 48,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
    marginBottom: 16,
  },
  imageSubtitle: {
    fontSize: 24,
    fontFamily: 'Inter_400Regular',
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  contentWide: {
    maxWidth: 480,
    width: '100%',
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666',
  },
  form: {
    gap: 16,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 8,
  },
  input: {
    height: Platform.OS === 'web' ? 52 : 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    backgroundColor: '#F8FAFC',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: '#FF1493',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  button: {
    height: Platform.OS === 'web' ? 52 : 44,
    backgroundColor: '#FF1493',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    color: '#666',
    paddingHorizontal: 16,
    fontFamily: 'Inter_400Regular',
  },
  secondaryButton: {
    height: Platform.OS === 'web' ? 52 : 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  successMessage: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 40,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#388E3C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  successText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  errorMessage: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 40,
    left: 20,
    right: 20,
    backgroundColor: '#DC2626',
    padding: 16,
    borderRadius: 12,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#B91C1C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});