import React ,{useState, useEffect} from 'react';
import {View ,Text,StyleSheet,Switch ,TouchableOpacity} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { TextField } from 'react-native-material-textfield';
import {getStatesList,getCitiesList} from '../redux/stores/actions/register_user';
import { Dropdown } from 'react-native-material-dropdown';
import NetInfo from "@react-native-community/netinfo";
import {useDispatch ,useSelector} from 'react-redux';
import MyActivityIndicator from '../CustomUI/MyActivityIndicator';
import { showMessage } from '../Globals/Globals';
import {updateLocationPrefrence} from '../redux/stores/actions/register_user';
import { checkuserAuthentication ,logoutUser} from '../redux/stores/actions/auth_action';
import { StackActions, NavigationActions } from 'react-navigation';

const LocationPrefrences = (props) => {

    const device_token  = useSelector(state => state.auth.device_token);
    let user = useSelector(state => state.register.user);
    let get_states_list1 = useSelector(state => state.register.states_list);
    let [get_cities_list1,setCityList1] = useState([]);

    let get_states_list2 = useSelector(state => state.register.states_list);
    let [get_cities_list2,setCityList2] = useState([]);

    const [state_id1 ,setStateId1 ] = useState(user.preference_one_state);
    const [state_label1 ,setStateLabel1 ] = useState("");
    const [city_label1 ,setCityLabel1 ] = useState("");
    const [city_id1 , setCityId1] = useState(user.preference_one_city);
    
    const [state_id2 ,setStateId2 ] = useState(user.preference_two_state);
    const [state_label2 ,setStateLabel2 ] = useState("");
    const [city_label2 ,setCityLabel2 ] = useState('');
    const [city_id2 , setCityId2] = useState(user.preference_two_city);
    const loading_status = useSelector(state => state.register.loading_status);
    const [toggleSwitch, setToggleSwitch] = useState(user.location_preference == 3 ? true :false)
    
    const dispatch = useDispatch();

   


    useEffect(()=> {

        
        NetInfo.isConnected.fetch().then(isConnected => {

            if(!isConnected){
                props.navigation.navigate("NoNetwork");
                return;
            }else{
              
                dispatch(getStatesList())
                    .then(response => {

                        if(response ==  1){

                            get_states_list1.map(element => {
                    
                                if(element.value == state_id1){
                                    setStateLabel1(element.label);
                                    dispatch(getCitiesList(state_id1))
                                        .then(response => {

                                            if(response.length > 0){

                                                setCityList1(response);
                                                response.map(ele => {

                                                    if(ele.value  == city_id1){
                                                        setCityLabel1(ele.label)
                                                    }
                                                })

                                            }else{
                                                setCityList1([]);
                                            }
                                        })
                                   
                                }

                            });

                            get_states_list2.map(element => {

                                if(element.value == state_id2){
                                    setStateLabel2(element.label);

                                    dispatch(getCitiesList(state_id1))
                                        .then(response => {

                                            if(response.length > 0){

                                                setCityList2(response);
                                                response.map(ele => {

                                                    if(ele.value  == city_id2){
                                                        setCityLabel2(ele.label)
                                                    }
                                                })

                                            }else{
                                                setCityList2([]);
                                            }
                                    })
                                   

                                }
                            })
                        }
                    })

             

               
            
            }
        });

    },[]);

    const onStateChangeListener1 = (id) => {
        
        get_states_list1.forEach(element => {

            
            if(id  == element.value) {
                setStateId1(element.value);
                
                setStateLabel1(element.label);
                NetInfo.isConnected.fetch().then(isConnected => {

                    if(!isConnected){
                        props.navigation.navigate("NoNetwork");
                        return;
                    }else{
                        
                        setCityId1("");
                        setCityLabel1("");
                        dispatch(getCitiesList(id))
                        .then(response => {
                            if(response.length > 0){
                                setCityList1(response)
                                response.map(element => {
                                    console.log(element.value,element.label);

                                    if(element.value == city_id1){
                                        console.log(element.value,element.label);
                                        setCityLabel1(element.label)
                                    }
                                    
                                    
                                })
                            }else{
                                setCityList1([])
                            }
                        })
                    }
                });
            }
        })
    }

    const onCityChangeListener1 = (id) => {

        get_cities_list1.forEach(ele => {

            if(ele.value  == id){

                setCityId1(ele.value);
                setCityLabel1(ele.label)
            }
        })
    }

    const onStateChangeListener2 = (id) => {
        
        get_states_list2.forEach(element => {

            
            if(id  ===  element.value) {
                setStateId2(element.value);
                
                setStateLabel2(element.label);
                NetInfo.isConnected.fetch().then(isConnected => {

                    if(!isConnected){
                        props.navigation.navigate("NoNetwork");
                        return;
                    }else{
                        
                        setCityId2("");
                        setCityLabel2("");
                        dispatch(getCitiesList(id))
                        .then(response => {
                            if(response.length > 0){
                                setCityList2(response)
                                response.map(element => {
                                    console.log(element.value,element.label);

                                    if(element.value == city_id2){
                                        console.log(element.value,element.label);
                                        setCityLabel2(element.label)
                                    }
                                    
                                    
                                })
                            }else{
                                setCityList2([])
                            }
                        })
                    }
                });
            }
        })
    }

    const onCityChangeListener2 = (id) => {

        get_cities_list2.forEach(ele => {

            if(ele.value  == id){

                setCityId2(ele.value);
                setCityLabel2(ele.label)
            }
        })
    }

    const cancelBtn =() => {
        props.navigation.goBack();
    }

    const isValid = () => {
        if(state_id1){
            if(!city_id1){

                showMessage(0,'Please enter City for 1st Prefrence', 'Location Prefrence', true, false);
                return;
            }
        }

        if(state_id2){
            if(city_id2){
                showMessage(0,'Please enter City for 2nd Prefrence', 'Location Prefrence', true, false);
                return;
            }
        }
    }

    const submitLocationPrefrence = () => {
        NetInfo.isConnected.fetch().then(isConnected => {

            if(!isConnected){
                props.navigation.navigate("NoNetwork");
                return;
            }else{
                let loc_pref;
                if(city_id1 || city_id2 ){
                    loc_pref = 1;
                }else if(toggleSwitch){
                    loc_pref = 3;
                }else{
                    loc_pref = 2;
                }

                dispatch(checkuserAuthentication(user.id,device_token))
                .then(response => {
                    if(response.data.error){
                        showMessage(0, 'Session Expired! Please Login.', 'Location Preferences', true, false);
                        dispatch(logoutUser());
                        props.navigation.navigate("Login")
                        const resetAction = StackActions.reset({
                            index: 0,
                            key: 'Login',
                            actions: [NavigationActions.navigate({ routeName: 'Login' })],
                        });
                        props.navigation.dispatch(resetAction);

                    }else{
                       
                    dispatch(updateLocationPrefrence(user.id,loc_pref,state_id1 ,city_id1,state_id2,city_id2,props.navigation))


                    }
                })
       
              
            }
        });
    }

    const setToggleValues = () => {

        setStateId1("");
        setCityId1("");
        setCityLabel1("");
        setCityLabel2("");
        setStateLabel1("");
        setStateLabel2("");
        setStateId2("");
        setCityId2("");
        setToggleSwitch(!toggleSwitch);
    }


    if(loading_status){

        return <MyActivityIndicator /> 
    }

    return(
      <KeyboardAwareScrollView>
          <View style={styles.container}>
              <Text style={styles.firstPrefText}>1st Preference</Text>
              <Dropdown
                    label='Select States'
                    data={get_states_list1}
                    value={state_label1}
                    onChangeText={(value) => { onStateChangeListener1(value) }} // passing id here
                />

                <Dropdown
                    label='Select City'
                    data={get_cities_list1}
                    value={city_label1}
                    onChangeText={(value) => { onCityChangeListener1(value) }} // passing id here
                />


                <Text style={styles.secPrefText}>2nd Preference</Text>
                <Dropdown
                    label='Select States'
                    data={get_states_list2}
                    value={state_label2}
                    onChangeText={(value) => { onStateChangeListener2(value) }} // passing id here
                />

                <Dropdown
                    label='Select City'
                    data={get_cities_list2}
                    value={city_label2}
                    onChangeText={(value) => { onCityChangeListener2(value) }} // passing id here
                />

                <Text style={styles.secPrefText}>3rd Preference</Text>

                <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:15}}>
                    <Text style={styles.textStyle}>10km to 20km from my location</Text>
                    <Switch 
                     trackColor={{true: '#4C74E6', false: 'grey'}}
                     thumbColor='#4C74E6'
                     onValueChange = {setToggleValues}
                     value = {toggleSwitch}
                    />
                </View>

                <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:15}}>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={cancelBtn}
                    underlayColor='#fff'>
                    <Text style={styles.submitText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.submitButton1}
                    onPress={submitLocationPrefrence}
                    underlayColor='#fff'>
                    <Text style={styles.submitText1}>Submit</Text>
                </TouchableOpacity>
                </View>
               


          </View>
      </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({

    container: {
		backgroundColor: 'white',
        paddingTop:10,
        paddingLeft:20,
        paddingRight:20

    },
    firstPrefText:{
        fontFamily:'roboto-bold',
		color: '#4C74E6',
		textAlign: 'left',
        fontSize:15,
    },
    secPrefText:{
        fontFamily:'roboto-bold',
		color: '#4C74E6',
		textAlign: 'left',
        fontSize:15,
        marginTop:15
    },
    textStyle:{
        fontFamily:'roboto-regular',
		color: 'black',
		textAlign: 'left',
        fontSize:14,

    },
    submitButton: {
        width:'40%',
        
		marginTop: 10,
		paddingTop: 10,
        paddingBottom: 10,
        borderRadius:4,
        borderColor:'red',
		backgroundColor: 'white',
		borderWidth: 1,
        marginTop: 20,
        alignSelf:'center'
	},
	submitText: {
		fontFamily:'Roboto-Light',
		color: 'red',
		textAlign: 'center',
		paddingLeft: 10,
		paddingRight: 10,
		fontSize: 14,
		
	},
    submitButton1: {
        width:'40%',
		marginTop: 10,
		paddingTop: 10,
        paddingBottom: 10,
        borderRadius:4,
		backgroundColor: '#4C74E6',
        marginTop: 20,
        alignSelf:'center'
	},
	submitText1: {
		fontFamily:'Roboto-Light',
		color: 'white',
		textAlign: 'center',
		paddingLeft: 10,
		paddingRight: 10,
		fontSize: 14,
		
	},


})


export default LocationPrefrences ;