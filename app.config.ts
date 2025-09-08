import { ConfigContext, ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.nexcorp.registrala.dev';
  }
  if (IS_PREVIEW) {
    return 'com.nexcorp.registrala.preview';
  }
  return 'com.nexcorp.registrala';
}

const getAppName = () => {
  if (IS_DEV) {
    return 'Registra Dev';
  }
  if (IS_PREVIEW) {
    return 'Registra Prev';
  }
  return 'Registra Lá';
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: `registra-la`,
  owner: "nexcorp",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "registrala",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#392840",
    },
    package: getUniqueIdentifier(),
    edgeToEdgeEnabled: true,
    permissions: ["android.permission.RECORD_AUDIO"],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#392840",
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          usesCleartextTraffic: true,
          minSdkVersion: 25,
        },
      },
    ],
    "@logrocket/react-native",
    [
      "expo-secure-store",
      {
        configureAndroidBackup: true,
        faceIDPermission:
          "Permitir $(PRODUCT_NAME) a acessar sua biometria facial.",
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "The app accesses your photos to let you share them with your friends.",
      },
    ],
    [
      "expo-sqlite",
      {
        enableFTS: true,
        useSQLCipher: true,
        android: {
          enableFTS: false,
          useSQLCipher: false,
        },
        ios: {
          customBuildFlags: [
            "-DSQLITE_ENABLE_DBSTAT_VTAB=1 -DSQLITE_ENABLE_SNAPSHOT=1",
          ],
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: "0c422c0c-86f1-4951-8936-0b5ee55d06b4",
    },
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  updates: {
    checkAutomatically: 'ON_LOAD',
    fallbackToCacheTimeout: 60000,
    url: "https://u.expo.dev/0c422c0c-86f1-4951-8936-0b5ee55d06b4",
  },
});
