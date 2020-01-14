import React from 'react';
import colorClass, { colors } from '../constants/Colors';

import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableHighlight,
  SafeAreaView,
  ScrollView,
  AsyncStorage
} from 'react-native';

import HomeSlide from '../components/HomeSlide';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
import {connect} from 'react-redux';
import userSessionAction from '../src/apiActions/user/userSession';
class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    if(userToken){
      await this.props.userSessionAction(userToken);
      this.props.navigation.navigate(this.props.userSession.user ? 'App' : 'Auth');
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <HomeSlide navigation={this.props.navigation}/>
          {/* <View style={styles.button_style}>
            <TouchableHighlight
            onPress={() => navigate('CreateAccount')}
            >
              <Text style={styles.button_text}> Create Account </Text>
            </TouchableHighlight>
          </View>
          <View style={[styles.button_style, styles.button_blue]}>
            <TouchableHighlight
              onPress={() => navigate('SignIn')}
              >
                <Text style={styles.button_text}> Login </Text>
            </TouchableHighlight>
          </View>
          <View>
            <Text style={styles.privacy}>By signing up, you agree with the <Text style={colorClass.blue}>Terms of Service</Text> and <Text style={colorClass.blue}>Privacy Policy</Text></Text>
          </View> */}
        </View>
      </SafeAreaView>
    );
  }
  onPressCreateAccount() {
  
  }
  onPressLogin() {
  
  }
}

const mapStateToProps = state => ({
  login: state.login,
  userSession: state.userSession
});

const mapDispatchToProps = {
  userSessionAction
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fcfcfc',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: viewportHeight
  },
  button_style: {
    borderColor: colors.orange,
    borderWidth: 1,
    borderRadius: 30,
    width: viewportWidth*0.8,
    height: 50,
    backgroundColor: colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: "center",
    textAlign: "center",
    marginBottom: 20,
  },
  button_blue: {
    borderColor: colors.blue,
    backgroundColor: colors.blue,
  },
  button_text: {
    color: "#FFFFFF",
    fontWeight: "500"
  },
  privacy: {
    width: viewportWidth*0.8,
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 22
  },
});
