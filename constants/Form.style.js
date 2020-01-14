import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './Colors';
import { iOS } from '../src/common'
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fcfcfc',
        paddingTop: 20,
        position: 'relative'
    },
    container: {
        flex: 1,
        backgroundColor: '#fcfcfc',
        padding: 16
    },
    button_style: {
        borderRadius: 30,
        width: viewportWidth*0.8,
        height: 50
    },
    button_text: {
        color: '#fff', 
        fontWeight: '700', 
        fontSize: iOS ? 10 : 13, 
        textAlign: 'center'
    },
    title_head: {
        fontSize: iOS ? 17 : 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000'
    },
    button_back: {
        backgroundColor: 'transparent',
        width: 30,
        height: 30,
        color: '#000',
        borderRadius: 0,
        position:'absolute',
        zIndex: 1,
        // top: 0
    },
    button_logout: {
        backgroundColor: 'transparent',
        width: 30,
        height: 30,
        color: '#000',
        borderRadius: 0,
        position:'absolute',
        zIndex: 1
    },
    container_form: {
        borderWidth: 1, 
        borderColor: '#e0e0e0', 
        padding: 20, 
        backgroundColor: '#fff',
        borderRadius: 16
    },
    title_container: {
        fontSize: iOS ? 15 : 18,
        fontWeight: '500',
        color: '#202c3c',
        marginBottom: 29
    },  
    title_form: {
        fontSize: iOS ? 13 : 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 10,
        textAlign: 'center'
    },
    form_group: {
        flexDirection:'row', 
        flexWrap:'wrap',
        alignItems: 'center',
        marginBottom: 15
    },
    form_label: {
        fontSize: iOS ? 12 : 15,
        fontWeight: 'normal',
        flex: 0.4,
        color: 'rgba(32, 44, 60,0.4)'
    },
    form_label_small: {
        color: 'rgba(32, 44, 60,0.4)',
        fontWeight: 'normal',
        fontSize: iOS ? 10 : 13,
        marginBottom: 8
    },
    form_label_error: {
        fontSize: iOS ? 10 : 13,
        fontWeight: 'normal',
        color: 'red',
        position: 'relative',
        top: -10,
        right: 0,
        width: '100%',
        textAlign: 'right'
    },
    form_input: {
        height: 44,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        backgroundColor: '#fcfcfc',
        borderRadius: 4,
        fontSize: iOS ? 13 : 16,
        flex: 0.6,
        fontWeight: 'normal',
        paddingVertical: 10,
        paddingHorizontal: 13
    },
    form_autocomplete: {
        borderColor: '#e0e0e0',
        width: '100%'
    },

    form_value: {
        flex: 0.6,
    },
    form_input_error: {
        borderColor: '#f95454'
    },  
    form_button: {
        height: 44,
        borderRadius: 44,
        backgroundColor: '#ee7a23',
        padding: 12,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: "center",
        textAlign: "center",
    },
    form_dropdown: {
        borderWidth:1,
        borderColor:'#e0e0e0',
        borderRadius:4,
        height: 44,
        paddingHorizontal: 13,
        justifyContent: 'center',
    },
    form_datepicker: {
        flexDirection:'row',
        flexWrap:'wrap',
        borderWidth: 1, 
        borderColor: '#e0e0e0',
        borderRadius: 4,
        backgroundColor:'#fcfcfc',
        alignItems: 'center'
    },
    group_radio: {
        flex: 0.7,
        flexDirection:'row',
        flexWrap:'wrap',
        borderWidth: 1, 
        borderColor: '#e0e0e0',
        borderRadius: 4,
        marginLeft: 0,
        overflow: 'hidden'
    },
    btn_radio: {
        height: 44,
        paddingVertical: 12,
        paddingHorizontal: 5,
        borderLeftWidth: 1,
        borderLeftColor: '#e0e0e0'
    },
    btn_radio_noborder: {
        borderLeftWidth: 0
    },
    btn_radio_active: {
        backgroundColor: '#ee7a23'
    },
    button_blue: {
        borderColor: colors.blue,
        backgroundColor: colors.blue,
    },
    image_circle: {
        width: 70, 
        height: 70, 
        borderRadius: 70/2, 
        alignSelf: 'center', 
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ee7a23',
        resizeMode: 'cover'
    },
    group_avatar: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#f3f3f3',
        marginBottom: 20
    },
    input_required: {
        borderWidth: 1,
        borderColor: 'red'
    },
    autocomplete_required: {
        borderWidth: 1,
        borderColor: 'red',
        height: 44,
        borderRadius: 4
    },
    datepicker_required: {
        borderWidth: 1,
        borderColor: 'red',
        height: 44,
        borderRadius: 4
    },
    dropdown_required: {
        borderWidth: 1,
        borderColor: 'red',
        borderBottomColor: 'red',
        borderBottomWidth: 1,
        height: 44,
        borderRadius: 4,
    },
    autocompletelistStyle: {
        flex: 1,
        position: 'relative',
        maxHeight: 200,
        borderRadius:3,
        zIndex: 1
    },
    autocompleteItem: {
        padding:12,
        fontSize: iOS ? 10 : 13,
        borderBottomWidth:1,
        borderBottomColor: '#eee'
    },
    autocompleteInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        backgroundColor: '#fcfcfc',
        borderRadius: 4,
        paddingLeft: 10,
        paddingRight: 10
    },
    text_skip: {
        fontSize: iOS ? 12 : 15,
        color: '#4e94b2',
        fontWeight: '600'
    },
    pet_name: {
        fontSize: iOS ? 19 : 22,
        fontWeight: '700',
        color: '#000',
        paddingRight: 14
    },
    pet_info: {
        backgroundColor: '#eafbf7',
        borderRadius: 16,
        fontSize: iOS ? 9 : 12,
        color: '#000',
        height: 16,
        alignSelf: 'center',
        paddingHorizontal: 7,
        borderRadius: 16/2,
        overflow: 'hidden'
    },
    form_input_required: {
        borderWidth: 1,
        borderColor: 'red'
    }
})