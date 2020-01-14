import React from 'react';
import {Image, View} from 'react-native';
import { createAppContainer, createSwitchNavigator, createStackNavigator, createBottomTabNavigator } from 'react-navigation';

// Auth
import HomeScreen from '../screens/HomeScreen';
import SignInScreen from '../screens/user/SignInScreen';
import CreateAccountScreen from '../screens/user/CreateAccountScreen';
import ForgotPasswordScreen from '../screens/user/ForgotPasswordScreen';
//Menu
import Menu from '../components/Menu';
// User
import UserProfileScreen from '../screens/user/ProfileScreen';
import UserManageScreen from '../screens/user/UserManageScreen';
import ChangePasswordScreen from '../screens/user/ChangePasswordScreen';

// Pet
import PantryScreen from '../screens/other/PantryScreen';
import AddNewPetScreen from '../screens/pet/AddNewPetScreen';
import VaccineRecordScreen from '../screens/pet/vaccine-record/VaccineRecordScreen';
import VaccineDetailScreen from '../screens/pet/vaccine-record/VaccineDetailScreen';
import PetManagementScreen from '../screens/pet/PetManagementScreen.js';
import CareScheduleScreen from '../screens/pet/schedule/CareScheduleScreen.js';
import ScheduleDetailScreen from '../screens/pet/schedule/ScheduleDetailScreen';
import ApproximateAgeScreen from '../screens/pet/ApproximateAgeScreen.js';
import UpdateProfileScreen from '../screens/pet/UpdateProfileScreen';
import ScheduleManagerScreen from '../screens/pet/schedule/ScheduleManagerScreen';
import ViewCompleteTaskScreen from '../screens/pet/schedule//ViewCompleteTaskScreen';
import AddObservationScreen from '../screens/pet/AddObservationScreen';
import NoteObservationScreen from '../screens/pet/NoteObservationScreen';
import WeightGrowthScreen from '../screens/pet/weight/WeightGrowthScreen';
import WeightInstructionScreen from '../screens/pet/weight/WeightInstructionScreen';
import EditWeightScreen from '../screens/pet/weight/EditWeightScreen';

//Provider
import ProviderScreen from '../screens/provider/ProviderScreen';
import ProviderDetailScreen from '../screens/provider/ProviderDetailScreen';
import EditProviderScreen from '../screens/provider/EditProviderScreen';
import SearchProviderScreen from '../screens/provider/SearchProviderScreen';
import ProviderResultListScreen from '../screens/provider/ProviderResultListScreen';
import ProviderResultMapScreen from '../screens/provider/ProviderResultMapScreen';

// Other
import InboxScreen from '../screens/other/InboxScreen';
import AddProduct from '../screens/other/AddProduct';
import UsageAmount from '../screens/other/UsageAmount';
import Pantry from '../screens/other/PantryScreen';
import EditProduct from '../screens/other/EditProduct';
import BarcodeScanner from '../screens/Barcode_Scanner';
import AddObservation from '../screens/other/AddObservation';


const AppStack = createStackNavigator({
    UserManage: UserManageScreen,
    ChangePassword: ChangePasswordScreen,
    UserProfile: UserProfileScreen,
    AddNewPet: AddNewPetScreen,
    VaccineRecord: VaccineRecordScreen,
    PetManagement: PetManagementScreen,
    VaccineDetail: VaccineDetailScreen,
    CareSchedule: CareScheduleScreen,
    ApproximateAge: ApproximateAgeScreen,
    ScheduleDetail: ScheduleDetailScreen,
    AddProduct: AddProduct,
    UpdateProfile: UpdateProfileScreen,
    ScheduleManager: ScheduleManagerScreen,
    Pentry: PantryScreen,
    Provider: ProviderScreen,
    Notify: ScheduleManagerScreen,
    Inbox: InboxScreen,
    ViewCompleteTask: ViewCompleteTaskScreen,
    AddObservation: AddObservationScreen,
    CareProviderDetail: ProviderDetailScreen,
    EditProvider: EditProviderScreen,
    SearchProvider: SearchProviderScreen,
    ProviderResultList: ProviderResultListScreen,
    ProviderResultMap: ProviderResultMapScreen,
    NoteObservation: NoteObservationScreen,
    WeightGrowth: WeightGrowthScreen,
    WeightInstruction: WeightInstructionScreen,
    EditWeight: EditWeightScreen,
    UsageAmount:UsageAmount,
    pentry:Pantry,
    EditProduct:EditProduct,
    BarcodeScanner:BarcodeScanner,
    Menu:Menu,
    AddObservation:AddObservation,
    
    


},
 {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
});

const AuthStack = createStackNavigator({
    Home: HomeScreen,
    CreateAccount: CreateAccountScreen,
    SignIn: SignInScreen,
    ForgotPassword: ForgotPasswordScreen,
}, {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
});

const MainApp = createBottomTabNavigator(
    {
        Home: AppStack,
        Notify: ScheduleManagerScreen,
        Provider: ProviderScreen,
        Pentry: PantryScreen,
        Inbox: InboxScreen
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
          tabBarIcon: ({ focused, horizontal, tintColor }) => {
            const { routeName } = navigation.state;
            if (routeName === 'Home') {
              return (
                <Image
                  source={ require('../assets/images/icon-tab-1.png') }
                  style={{ width: 31, height: 31, }} />
              );
            } else if (routeName === 'Notify') {
                return (
                    <Image
                        source={ require('../assets/images/icon-tab-3.png') }
                        style={{width: 28, height: 30}} />
                )
            } else if (routeName === 'Provider') {
                return (
                    <Image
                        source={ require('../assets/images/icon-tab-5.png') }
                        style={{width: 24, height: 30,}} />
                )
            } else if (routeName === 'Pentry') {
              return (
                <Image
                  source={ require('../assets/images/icon-tab-2.png') }
                  style={{ width: 31, height: 31, opacity: 0.5 }} />
              );
            } else {
                return (
                    <Image
                        source={ require('../assets/images/icon-tab-4.png') }
                        style={{width: 32, height: 24, opacity: 0.5}} />
                )
            }
          },
          tabBarLabel: <View/>
        }),
        tabBarOptions: {
          activeTintColor: '#FF6F00',
          inactiveTintColor: '#263238',
        },
    }
)

export default createAppContainer(createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Auth: AuthStack,
    App: MainApp,
}, {
    initialRouteName: 'Auth',
}
));