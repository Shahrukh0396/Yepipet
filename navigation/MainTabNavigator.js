import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator , createAppContainer} from 'react-navigation';
import { FontAwesome } from '@expo/vector-icons';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import CreateAccountScreen from '../screens/user/CreateAccountScreen';
import UserProfileScreen from '../screens/user/ProfileScreen';
import UserManageScreen from '../screens/user/UserManageScreen';
import SignInScreen from '../screens/user/SignInScreen';
import ForgotPasswordScreen from '../screens/user/ForgotPasswordScreen';
import ChangePasswordScreen from '../screens/user/ChangePasswordScreen';

const AppNavigator = createBottomTabNavigator(
  {
    Home: {
      // screen: HomeScreen,
      screen: UserManageScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) =>
          <FontAwesome name="home" size={25} color={tintColor} />
      }
    },
    HighScores: {
      screen: SignInScreen,
      navigationOptions: {
        tabBarLabel: 'High Scores',
        tabBarIcon: ({tintColor}) =>
          <FontAwesome name="rocket" size={25} color={tintColor} />
      }
    },
    Settings: {
      screen: UserProfileScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) =>
          <FontAwesome name="cogs" size={25} color={tintColor} />
      }
    }
  }
);

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  CreateAccount: CreateAccountScreen,
  SignIn: SignInScreen,
  ForgotPassword: ForgotPasswordScreen,
  ChangePassword: ChangePasswordScreen,
  UserProfile: UserProfileScreen,
  UserManage: UserManageScreen,
}, {
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
 }
);



// const AllStack = createStackNavigator({
//   Tabs: AppNavigator,
//   Home: HomeStack
// }, {
//   headerMode: 'none',
//   navigationOptions: {
//     headerVisible: false,
//   }
//  })

const App = createAppContainer(HomeStack);
export default App;
