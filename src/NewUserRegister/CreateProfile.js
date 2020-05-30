import React ,{useEffect , useState } from 'react';
import { 	Text, View, Button, StyleSheet, SafeAreaView,
	Dimensions, Platform, PixelRatio, ScrollView,
	PermissionsAndroid, Image, FlatList, ActivityIndicator, TouchableOpacity, ToastAndroid, TouchableWithoutFeedback} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { TextField } from 'react-native-material-textfield';
import NetInfo from "@react-native-community/netinfo";
import { Dropdown } from 'react-native-material-dropdown';
import { Card, CheckBox } from 'react-native-elements';
import { showMessage } from '../Globals/Globals';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import MyActivityIndicator from '../CustomUI/MyActivityIndicator';
import { useDispatch, useSelector } from "react-redux";
import {fetchJobCategories,fetchSpecialities,submitCreateProfile1,getStatesList,getCitiesList, showSpinner, hideSpinner} from '../redux/stores/actions/register_user';
//import Geocoder from 'react-native-geocoder';

import Geocoder from 'react-native-geocoding';

const CreateProfile = (props,navigation) => {


    const [email ,setEmail ] = useState(props.navigation.getParam('email'));
    const [profession_id ,setProfessionId ] = useState("");
    const [profession_label ,setProfessionLabel ] = useState("");
    const [speciality_id ,setSpecialityId ] = useState("");
    const [speciality_label ,setSpecialityLabel ] = useState("");
    const [ic_no ,setIcNo ] = useState("");

    const [mmc_no ,setMmcNo ] = useState("");
    const [apc_no ,setApcNo ] = useState("");
    const [post_code ,setPostcode ] = useState("");
    const [street_1 ,setStreet1 ] = useState("");
    const [street_2 ,setStreet2 ] = useState("");
    

    const [degree ,setDegree ] = useState("");
    const [experience ,setExperience ] = useState("");
    const [address ,setAddress ] = useState("");
    const [current_work ,setCurrentWork ] = useState("");
    const [description ,setDescription ] = useState("");
    const [checked ,setChecked ] = useState(false);
    //const [license ,setLicense ] = useState("");
    const [first_name ,setFirstName ] = useState(props.navigation.getParam('first_name')) ;
    const [last_name ,setLastName ] = useState(props.navigation.getParam('last_name')) ;
    const [mobile ,setMobile  ] = useState(props.navigation.getParam('mobile'));
    const loading_status = useSelector(state => state.register.loading_status);
   // const grades  =  useSelector(state => state.register.grades);
    const [grades_id,setGrade] = useState("");
    const [grades_label,setGradeLabel] = useState("");
    const profession_categories =  useSelector(state => state.register.profession_categories);
    const specialities  = useSelector(state => state.register.specialities);
    const temp_register_id =  useSelector(state => state.register.register_id);
    const get_states_list = useSelector(state => state.register.states_list);
    const get_cities_list = useSelector(state => state.register.cities_list);
    const [state_id ,setStateId ] = useState("");
    const [state_label ,setStateLabel ] = useState("");
    const [city_label ,setCityLabel ] = useState("");
    const [city_id , setCityId] = useState("");
    const [user_address,setUserAddress] = useState("");
     const dispatch = useDispatch();

    //  let  region1 = {
    //     latitude: 3.148561,
    //     longitude: 101.652778,
    //     latitudeDelta: 0.2,
    //     longitudeDelta: 0.9
    //   };

      const LATITUDE_DELTA = 0.1;
      const LONGITUDE_DELTA = 0.1;

    //  const [region ,setRegion] = useState(region1);
    

    useEffect(()=> {

        
        NetInfo.isConnected.fetch().then(isConnected => {

            if(!isConnected){
                props.navigation.navigate("NoNetwork");
                return;
            }else{
                dispatch(fetchJobCategories())
                    .then(response =>{
                        if(response == 1){

                            dispatch(getStatesList());
                            
                        }
                       
                    })
                
                
            }
        });

        console.log(profession_categories);

    },[setProfessionId],[setStateId]);


    const onStateChangeListener = (id) => {
        
        get_states_list.forEach(element => {

            
            if(id  ===  element.value) {
                setStateId(element.value);
                
                setStateLabel(element.label);
                NetInfo.isConnected.fetch().then(isConnected => {

                    if(!isConnected){
                        props.navigation.navigate("NoNetwork");
                        return;
                    }else{
                        
                        setCityId("");
                        setCityLabel("");
                        dispatch(getCitiesList(id));
                    }
                });
            }
        })
    }

    const onCityChangeListener = (id) => {

        get_cities_list.forEach(ele => {

            if(ele.value  == id){

                setCityId(ele.value);
                setCityLabel(ele.label)
            }
        })
    }

    const onProfessionChangeListener = (id) => {

        profession_categories.forEach(element => {

            if(element.value  === id){
                
                setProfessionId(element.value);
                setProfessionLabel(element.label);
                
                NetInfo.isConnected.fetch().then(isConnected => {

                    if(!isConnected){
                        props.navigation.navigate("NoNetwork");
                        return;
                    }else{
                        setSpecialityLabel("");
                        setSpecialityId("");
                        dispatch(fetchSpecialities(id));
                    }
                });
             
            }
        });

        
    }

    const onSpecialityChangeListener = (id) => {

        specialities.forEach(ele => {

            if(ele.value  == id){

                setSpecialityId(id);
                setSpecialityLabel(ele.label)
            }
        })
    }

    // const onGradeChangeListener = (id) => {

    //     grades.forEach(element => {
    //         if(element.value == id) {
    //             setGrade(id);
    //             setGradeLabel(element.label)
    //         }
    //     })
    // }

    const isValid = () => {
		var regexp = /^\d*\.?\d*$/;
		var isnum = regexp.test(experience);
		let valid = false;

		if (degree.length > 0) {
			valid = true;
        }
        
        if (state_id.length === 0) {

			showMessage(0, 'Select your State', 'Profile', true, false);

			return false
        }
        if (street_1.length === 0) {

			showMessage(0, 'Enter your Street 1', 'Profile', true, false);

			return false
        }
        
        if (street_2.length === 0) {

			showMessage(0, 'Enter your Street 2', 'Profile', true, false);

			return false
        }
        
        if (post_code.length === 0) {

			showMessage(0, 'Enter your Postcode', 'Profile', true, false);

			return false
		}

		if (profession_id.length === 0) {

			showMessage(0, 'Enter your profession', 'Profile', true, false);

			return false
		}
		else if (speciality_id.length === 0) {

			showMessage(0, 'Enter your specialities', 'Profile', true, false);

			return false
		}
		else if (degree.length === 0) {

			showMessage(0, 'Enter  your degree', 'Profile', true, false);

			return false;
        }
        
        else if (degree.length === 0) {

			showMessage(0, 'Enter  your degree', 'Profile', true, false);

			return false;
        }
        else if (mmc_no.length === 0) {

			showMessage(0, 'Enter  your MMC/MDC/NBM/PBM Number', 'Profile', true, false);

			return false;
        }
        else if (apc_no.length === 0) {

			showMessage(0, 'Enter  your APC Number', 'Profile', true, false);

			return false;
        }
        else if (ic_no.length === 0) {

			showMessage(0, 'Enter  your IC Number', 'Profile', true, false);

			return false;
		}
		// else if (user_address.length === 0) {

		// 	showMessage(0, 'Enter  your Adrress', 'Profile', true, false);

		// 	return false;
		// }
		// else if (license.toString().trim().length === 0) {

		// 	showMessage(0, 'Enter your license number', 'Profile', true, false);

		// 	return false;
		// }
		// else if (ic_no.toString().trim().length === 0) {

		// 	showMessage(0, 'Enter your IC number', 'Profile', true, false);

		// 	return false;
		// }


		// 	else if(!isnum){
		// 		ToastAndroid.show("Please Enter Valid Experience", ToastAndroid.SHORT);
		// 	 return false;
        //  }
        else if(experience.length === 0){
            showMessage(0, 'Pleease enter experience', 'Profile', true, false);
            return false;
        }

        else if(!isnum){
            showMessage(0, 'Pleease enter valid experience', 'Profile', true, false);
            return false;
        }

		else if (description.toString().trim().length === 0) {

			showMessage(0, 'Enter Description', 'Profile', true, false);

			return false;
		}

		else if (description.toString().trim().length < 10) {

			showMessage(0, 'Description Should be 10 characters long', 'Profile', true, false);

			return false;
		}

		else if (!checked) {

			showMessage(0, 'Accept terms and condition', 'Profile', true, false);


			return false;
		}

		return valid;
	}

    const getCurrentPosition = async() => {
        try {
            await Geolocation.getCurrentPosition(
            (position) => {
              const region = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              };
            //  setRegion(region);

            return position;
            },
             (error) => {
              //TODO: better design
              showMessage(1,'To get the jobs from your current location , please allow access to location services from Settings.', 'Location', true, false);
              console.log("error on map",error);
             
            },
            {enableHighAccuracy: false, timeout: 20000, maximumAge: 0}
          );
        } catch(e) {
          alert(e.message || "");
        }
      };  

    const submitCreateProfile = () => {


            NetInfo.isConnected.fetch().then(isConnected => {

                if(!isConnected){
                    props.navigation.navigate("NoNetwork");
                    return;
                }else{
                    if(isValid()){
                        dispatch(showSpinner())
                        let userposition =   getCurrentPosition();
                        Geocoder.init("AIzaSyDBxQEvhACIZ73YCvPF9fI7A2l6lULic0E");
                        Geocoder.from(street_1)
                        .then(json => {
                          
                            dispatch(hideSpinner())
                           // var location = json.results[0].geometry.location;
                           // console.log(json);
                           // console.log("location",location);

                            dispatch(submitCreateProfile1(temp_register_id,first_name,last_name,profession_id,mobile,degree,speciality_id,grades_id,experience
                                ,user_address,current_work,description,location.lat ,location.lng,state_id, city_id,street_1,street_2,post_code,ic_no,mmc_no,apc_no, props.navigation));
                        })
                        .catch(error => 
                            {
                                dispatch(hideSpinner())
                                console.log("er",error);
                                if(error.origin.results.length  <= 0 )
                                {
                                    showMessage(0, 'Please Enter valid Street 1', 'Profile', true, false);

                                }

                            }
                           
                            );

                       
                    }
                  
                }
            });
         


    }


    const setUserAddressGeocoder = async(value) => {
        setUserAddress(value);
        console.log(user_address);
      
    }






    if (loading_status) {
        return (
           <MyActivityIndicator />
        );
    }


    return (
        <View style={{ flex: 1,marginBottom:20 }}>
            <SafeAreaView style={{ backgroundColor: '#4C74E6' }} />


            <View style={styles.container}>
               
                <KeyboardAwareScrollView >
                    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                   
                    <View style={{width:Dimensions.get('window').width * 0.9,marginTop:40 }}>
                            <TextField
                                 labelHeight={15}
                                 labelPadding={0}
                                 fontSize={14}
                                style={{ alignSelf: 'center',color:'#A9A9A9' }}
                                label='First Name'
                                value={first_name}
                                editable={false}
                                onChangeText={(value) => setFirstName(value)}
                            />

                            <TextField
                                labelHeight={15}
                                labelPadding={0}
                                fontSize={14}
                                style={{ alignSelf: 'center',color:'#A9A9A9' }}
                                label='Last Name'
                                value={last_name}
                                editable={false}
                                onChangeText={(value) => setLastName(value)}
                            />
                            <TextField
                                labelHeight={15}
                                labelPadding={0}
                                fontSize={14}
                                style={{ alignSelf: 'center',color:'#A9A9A9' }}
                                label='Email'
                                value={email}
                                editable={false}
                                onChangeText={(email) => setEmail(email)}
                            />

                            <TextField
                                labelHeight={15}
                                labelPadding={0}
                                fontSize={14}
                                style={{ alignSelf: 'center',}}
                                label='Mobile'
                                keyboardType='numeric'
                                textContentType='telephoneNumber'
                                value={mobile}
                                editable={false}
                                onChangeText={(mobile) => setMobile(mobile)}
                            />

                            <TextField
                                labelHeight={15}
                                labelPadding={0}
                                fontSize={14}
                                style={{ alignSelf: 'center',color:'#A9A9A9' }}
                                label='Country'
                                value="Malaysia"
                                editable={false}
                                onChangeText={(email) => {}}
                            />

                            <Dropdown
                                labelHeight={15}
                                labelPadding={0}
                                fontSize={14}
                                label='Select States'
                                data={get_states_list}
                                value={state_label}
                                onChangeText={(value) => { onStateChangeListener(value) }} // passing id here
                            />

                            <Dropdown
                                labelHeight={15}
                                labelPadding={0}
                                fontSize={14}
                                label='Select City'
                                data={get_cities_list}
                                value={city_label}
                                onChangeText={(value) => { onCityChangeListener(value) }} // passing id here
                            />

                            <TextField
                                labelHeight={15}
                                labelPadding={0}
                                fontSize={14}
                                style={{ alignSelf: 'center',}}
                                label='Street 1'
                                value={street_1}
                                onChangeText={(value) => setStreet1(value)}
                            />
                             <TextField
                                labelHeight={15}
                                labelPadding={0}
                                fontSize={14}
                                style={{ alignSelf: 'center',}}
                                label='Street 2'
                                value={street_2}
                                onChangeText={(value) => setStreet2(value)}
                            />
                            <TextField
                                labelHeight={15}
                                labelPadding={0}
                                fontSize={14}
                                style={{ alignSelf: 'center',}}
                                label='Postcode'
                                maxLength={6}
                                keyboardType="number-pad"
                                value={post_code}
                                onChangeText={(value) => setPostcode(value)}
                            />
                             {/* <TextField
                                labelHeight={15}
                                labelPadding={0}
                                fontSize={14}
                                style={{ alignSelf: 'center',}}
                                label='Address'
                                value={user_address}
                                onChangeText={(value) => setUserAddressGeocoder(value)}
                            /> */}

                           
                            <Dropdown
                             labelHeight={15}
                             labelPadding={0}
                             fontSize={14}
                                label='Select Job Profile'
                                data={profession_categories}
                                value={profession_label}
                                onChangeText={(value) => { onProfessionChangeListener(value) }} // passing id here
                            />

                            <Dropdown
                             labelHeight={15}
                             labelPadding={0}
                             fontSize={14}
                                label='Select Specialities'
                                data={specialities}
                                value={speciality_label}
                                onChangeText={(value) => { onSpecialityChangeListener(value) }}
                              
                            />
                            {/* <Dropdown
                             labelHeight={15}
                             labelPadding={0}
                             fontSize={14}
                                label='Select Grades'
                                data={grades}
                                value={grades_label}
                                onChangeText={(value) => {onGradeChangeListener(value) }}
                                
                            />
                             */}
                            
                            <TextField
                             labelHeight={15}
                             labelPadding={0}
                             fontSize={14}
                                style={{ alignSelf: 'center',}}
                                label='Degree'
                                value={degree}
                                onChangeText={(degree) => setDegree(degree)}
                            />


                            <TextField
                                labelHeight={15}
                                labelPadding={0}
                                fontSize={14}
                                style={{ alignSelf: 'center',}}
                                label='MMC/MDC/NBM/PBM Number'
                                value={mmc_no}
                                onChangeText={(value) => setMmcNo(value)}
                            />

                            <TextField
                                labelHeight={15}
                                labelPadding={0}
                                fontSize={14}
                                style={{ alignSelf: 'center',}}
                                label='Valid APC Number'
                                value={apc_no}
                                onChangeText={(value) => setApcNo(value)}
                            />


                            <TextField
                                labelHeight={15}
                                labelPadding={0}
                                fontSize={14}
                                style={{ alignSelf: 'center', }}
                                label='IC Number'
                                value={ic_no}
                                onChangeText={(ic_no) => setIcNo(ic_no)}

                            /> 

{/* 
                            <TextField
                             labelHeight={15}
                             labelPadding={0}
                             fontSize={14}
                                style={{ alignSelf: 'center',}}
                                label='Current Work'
                                value={current_work}
                                onChangeText={(current_work) => setCurrentWork(current_work)}
                            /> */}

                            {/* <TextField
                                style={{ alignSelf: 'center',marginTop:10  }}
                                label='Address'
                                value={address}
                                onChangeText={(address) => setAddress(address)}
                            /> */}

                            {/* <TextField
                                style={{ alignSelf: 'center',marginTop:10  }}
                                label='License Number'
                                value={license}
                                onChangeText={(license) => setLicense(license)}
                            />*/}



                            <TextField
                             labelHeight={15}
                             labelPadding={0}
                             fontSize={14}
                                style={{ alignSelf: 'center',}}
                                label='Experience'
                                keyboardType='phone-pad'
                                maxLength={3}
                                onChangeText={(experience) => { 
                                    setExperience(experience)
                                
                                    }}
                                value={experience}
                            />




                            <TextField
                             labelHeight={15}
                             labelPadding={0}
                             fontSize={14}
                             multiline={true}
                             maxLength={150}
                                style={{ alignSelf: 'center',}}
                                label='Description'
                                value={description}
                                onChangeText={(description) => setDescription( description )}
                            />

                            {/*checkbox */}

                            <View style={{ flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', marginTop: 10, marginBottom: 4 }}>


                                <CheckBox
                                    onPress={() => setChecked(!checked)}
                                    checked={checked}
                                    checkedColor="blue"

                                />
                                <TouchableOpacity onPress={() => props.navigation.navigate('TermsCondition')}>
                                {/* <TouchableOpacity onPress={() => {}}> */}
                                    <View style={{ flexDirection: 'row', marginLeft: -15, flexWrap: 'wrap', flexShrink: 1 }}>
                                        <Text style={{ color: 'black' }}>Accept  </Text>
                                        <Text style={{ textDecorationLine: 'underline', marginLeft: 2, color: 'bluye' }}>Terms & Condition</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>




                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={submitCreateProfile}
                                underlayColor='#fff'>
                                <Text style={styles.submitText}>Create</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </KeyboardAwareScrollView>
                
            </View>
        </View >

    )


}

let styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		alignItems: 'center',

	},
	submitButton: {
        width: '90%',
        borderRadius:5,
		marginTop: 10,
		paddingTop: 10,
		paddingBottom: 10,
		backgroundColor: '#4C74E6',
		borderWidth: 1,
		borderColor: '#fff',
        marginTop: 20,
        alignSelf:'center'
	},
	submitText: {
		fontFamily:'Roboto-Light',
		color: 'white',
		textAlign: 'center',
		paddingLeft: 10,
		paddingRight: 10,
		fontSize: 20,
		fontWeight: 'bold'
	},

	indicator: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: 80
	}

});





export default CreateProfile;