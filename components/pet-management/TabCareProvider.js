import React from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Linking,
    Platform
} from 'react-native';
import PropTypes from 'prop-types';
import ItemProvider from '../../components/provider/ItemProvider';
import PopupConfirm from '../../components/PopupConfirm';

class TabCareProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arrProvider: [
                {name: 'Dr. Jeff Chang (Primary Vet)', address: '2003 N. Mahonia. Pl., Bellingham, WA', icon: require('../../assets/images/activity-vet.png'), phone: '6047816547', map: '', website: 'http://www.WalkMyDog.wa'},
                {name: 'Mary Jones (Walker)', address: '', icon: require('../../assets/images/activity-walk-cat.png'), phone: '0000000000', map: '', website: 'http://www.WalkMyDog.wa'},
                {name: 'Cat House', address: '101 Main St, Bellingham, WA', icon: require('../../assets/images/activity-boarder.png'), phone: '11111111', map: '', website: 'http://www.WalkMyDog.wa'}
            ],
            visibleConfirm: false,
            textButtonConfirm: 'Open',
            descriptionConfirm: '',
            titleConfirm: '',
            statusConfirm: null,
            dataConfirm: null,
            isNegative: false
        }
    };
    static propTypes = {
        data: PropTypes.object
    }

    render() {
        const {
            arrProvider, 
            dataConfirm, 
            textButtonConfirm, 
            descriptionConfirm, 
            titleConfirm, 
            visibleConfirm, 
            isNegative
        } = this.state;

        return (
            <View>
                <FlatList
                    data={arrProvider}
                    renderItem={({item}) => (
                        <ItemProvider
                            data={item}
                            onCall={this._onCall}
                            onWebsite={this._onWebsite}
                            onMap={this._onMap}
                            onDelete={this._deleteProvider}
                            navigation={this.props.navigation}
                        />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />

                <PopupConfirm
                    data={dataConfirm}
                    visible={visibleConfirm}
                    buttonText1={'Cancel'}
                    buttonText2={textButtonConfirm}
                    title={titleConfirm}
                    description={descriptionConfirm}
                    handleButton1={() => this.setState({visibleConfirm: false})}
                    handleButton2={this._handleConfirm}
                    isNegative={isNegative}
                />
            </View>
        )
    }

    _onCall = (data) => {
        this.setState({
            dataConfirm: data,
            titleConfirm: 'Call Mary Jones?',
            descriptionConfirm: data.phone,
            textButtonConfirm: 'Call',
            statusConfirm: 'call',
            isNegative: false,
            visibleConfirm: true
        })
    }

    _onWebsite = (data) => {
        this.setState({
            dataConfirm: data,
            titleConfirm: 'Open browser?',
            descriptionConfirm: data.website,
            textButtonConfirm: 'Open',
            statusConfirm: 'web',
            isNegative: false,
            visibleConfirm: true
        })
    }

    _onMap = (data) => {
        this.setState({
            dataConfirm: data,
            titleConfirm: 'Open Mary Jones in Map?',
            descriptionConfirm: data.map,
            textButtonConfirm: 'Open',
            statusConfirm: 'map',
            isNegative: false,
            visibleConfirm: true
        })
    }

    _deleteProvider = (data) => {
        this.setState({
            dataConfirm: data,
            titleConfirm: 'Meow. Remove Provider?',
            descriptionConfirm: 'Warning: This will permanently delete Maplewood Animal Hospital from your provider list AND all associated appointments and reminders. ',
            textButtonConfirm: 'Delete',
            statusConfirm: 'delete',
            isNegative: true,
            visibleConfirm: true
        });
    }

    _handleConfirm = (data) => {
        const {statusConfirm} = this.state;
        this.setState({
            visibleConfirm: false
        },() => {
            if (statusConfirm === 'call')
                Linking.openURL(`tel:${data.phone}`);
            else if(statusConfirm === 'web')
                Linking.openURL(data.website);
            else if(statusConfirm === 'map') {
                let lat = '48.7138966';//test lat
                let lng = '-122.4513066';//test lng
                const latLng = `${lat},${lng}`;
                const label = '2003 N Mahonia Pl, Bellingham, WA 98229, USA'; //Name address - (formatted_address)
                const url = Platform.select({
                    ios: `maps:0,0?q=${label}@${latLng}`,
                    android: `geo:0,0?q=${label}`,
                });
                Linking.canOpenURL(url).then(supported => {
                    if (supported)
                        Linking.openURL(url); 
                    else
                        Linking.openURL(`https://www.google.com/maps/place/${label}/@${lat},${lng}z`)
                })
            }
            else if(statusConfirm === 'delete'){
                console.log('delete', true);
            }
        })
    }
}

export default TabCareProvider;

const format = StyleSheet.create({
});