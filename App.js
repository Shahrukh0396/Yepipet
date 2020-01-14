import React from 'react';
import { Platform, StatusBar, StyleSheet, View, NetInfo, AsyncStorage, Text, Dimensions } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import {Provider} from 'react-redux';
import {store} from './src/store';
import { ReduxNetworkProvider,  } from 'react-native-offline';
import AppNavigator from './navigation/AppNavigator';
import { MaterialIcons, EvilIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { TASK } from 'redux-saga/utils';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

// BackgroundFetch.setMinimumIntervalAsync(60);

const TASK_NAME = 'test-background-fetch';

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    console.log('background fetch running', new Date());
    return BackgroundFetch.Result.NewData;
  } catch(error) {
    return BackgroundFetch.Result.Failed;
  }
})

class App extends React.PureComponent {
  state = {
    isLoadingComplete: false,
    isConnected: false,
    test: false,
    isIPhoneX: false,
    fontLoaded: false
  };

  async componentDidMount() {
    console.log('viewportWidth ==============>', viewportWidth)
    await NetInfo.addEventListener("connectionChange", this.handleConnectionChange);
    // await this.initializeregisterTaskAsync();
    await registerFetchTask()
    this.setState({isIPhoneX: Platform.OS === 'ios' && (viewportHeight > 811 || viewportWidth > 811)})
  }

  async componentWillUnmount() {
    await NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleConnectionChange
    );
  }

  initializeregisterTaskAsync = async () => {
    let data = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
    console.log('task registered');
    console.log('isTaskRegisteredAsync', data);

    // this.registerFetchTask()
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <Provider store={store}>
          <AppLoading
            startAsync={this._loadResourcesAsync}
            onError={this._handleLoadingError}
            onFinish={this._handleFinishLoading}
          />
        </Provider>
      );
    } else {
      return (
        <Provider store={store}>
          <ReduxNetworkProvider>
            <View style={styles.container}>
              <AppNavigator />
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              {
                this.state.isConnected ? null
                : 
                <View style={[
                  styles.status_bar,
                  this.state.isIPhoneX ? {bottom: viewportHeight - 50} : null
                ]}
                >
                  <MaterialIcons name="warning" color="#fff" size={12} />
                  <Text style={styles.status_text}> Offline</Text>
                </View>
              }
            </View>
        </ReduxNetworkProvider>
        </Provider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      await Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      await Font.loadAsync({
        // 'material' : require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
        // 'Ionicons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
        // 'material': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
        // 'evilicons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/EvilIcons.ttf'),
        // 'FontAwesome': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome.ttf'),
        // ...AntDesign.font,
        // ...EvilIcons.font,
        // ...FontAwesome.font,
        // ...MaterialIcons.font,
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      })
    ])
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  handleConnectionChange = async(connectionInfo) => {
    await NetInfo.isConnected.fetch().then(async (isConnected) => {
      await this.setState({isConnected}, () => {console.log('isConnected', this.state.isConnected)});
      await AsyncStorage.setItem('isConnected', JSON.stringify(isConnected));
      if(!isConnected)
        await AsyncStorage.getItem('persist:root', async(err, result) => {
          await AsyncStorage.setItem('localStorage', result);
        });
    });
  };

  isIPhoneXSize(dim) {
    return dim.height < 811 || dim.width < 811;
  }

}

registerFetchTask = async() => {
  const status = await BackgroundFetch.getStatusAsync();
  switch (status) {
      case BackgroundFetch.Status.Restricted:
      case BackgroundFetch.Status.Denied:
          console.log("Background execution is disabled");
          return;

      default: {
          console.debug("Background execution allowed");

          let tasks = await TaskManager.getRegisteredTasksAsync();
          if (tasks.find(f => f.taskName === TASK_NAME) == null) {
              console.log("Registering task");
              await BackgroundFetch.registerTaskAsync(TASK_NAME);

              tasks = await TaskManager.getRegisteredTasksAsync();
              console.debug("Registered tasks", tasks);
          } else {
              console.log(`Task ${TASK_NAME} already registered, skipping`);
          }

          console.log("Setting interval to", 15);
          await BackgroundFetch.setMinimumIntervalAsync(15);
      }
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative'
  },
  status_bar: {
    backgroundColor: '#ffcc00', 
    position: 'absolute', 
    zIndex: 1, 
    bottom: viewportHeight - 35,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  status_text: {
    color: '#fff',
    fontSize: 12
  }
});
