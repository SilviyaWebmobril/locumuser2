import React ,{useState, useEffect } from 'react';
import {View ,StyleSheet ,Text, TouchableOpacity} from 'react-native';
import MyHOC from '../HOC/MyHOC';
import {useDispatch ,useSelector} from 'react-redux';
import MyActivityIndicator from '../CustomUI/MyActivityIndicator';
import { TextField } from 'react-native-material-textfield';
import NetInfo from "@react-native-community/netinfo";
import { Dropdown } from 'react-native-material-dropdown';
import {fetchJobCategories,fetchGrades,fetchSpecialities,submitEditProfile,getStatesList,getCitiesList, showSpinner, hideSpinner} from '../redux/stores/actions/register_user';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Geocoder from 'react-native-geocoding';
import {showMessage} from '../Globals/Globals';
import {checkuserAuthentication,logoutUser} from '../redux/stores/actions/auth_action';

import {
	StackActions, NavigationActions
} from 'react-navigation';



const EditProfile = (props) => {

    const device_token  = useSelector(state => state.auth.device_token);
    const user = useSelector(state => state.register.user);
    const [email ,setEmail ] = useState(user.email);
    const [first_name ,setFirstName ] = useState(user.first_name) ;
    console.log("first_name",first_name);
    const [last_name ,setLastName ] = useState(user.last_name) ;
    const [profession_id ,setProfessionId ] = useState(user.profile_id);
    const [profession_label ,setProfessionLabel ] = useState("");
    const [speciality_id ,setSpecialityId ] = useState(user.speciality_id);
    const [speciality_label ,setSpecialityLabel ] = useState("");
    //const [ic_no ,setIcNo ] = useState(user.ic_no);
    const [degree ,setDegree ] = useState(user.degree);
    const [experience ,setExperience ] = useState(user.experience);
    const [mobile ,setMobile  ] = useState(user.mobile);
    const [address ,setAddress ] = useState(user.address);
    const [current_work ,setCurrentWork ] = useState(user.current_work);
    const [description ,setDescription ] = useState(user.description);
    //const [license ,setLicense ] = useState(user.license);
    const grades  =  useSelector(state => state.register.grades);
    const [grades_id,setGrade] = useState(user.grade);
    const [grades_label,setGradeLabel] = useState("");
    let profession_categories =  useSelector(state => state.register.profession_categories);
    let get_states_list = useSelector(state => state.register.states_list);
    let get_cities_list = useSelector(state => state.register.cities_list);
    const [state_id ,setStateId ] = useState(user.state_id);
    const [state_label ,setStateLabel ] = useState("");
    const [city_label ,setCityLabel ] = useState("");

    const [ic_no ,setIcNo ] = useState(user.ic_no);

    const [mmc_no ,setMmcNo ] = useState(user.mmc_no);
    const [apc_no ,setApcNo ] = useState(user.apc_no);
    const [post_code ,setPostcode ] = useState(user.post_code);
    const [street_1 ,setStreet1 ] = useState(user.street_1);
    const [street_2 ,setStreet2 ] = useState(user.street_2);
    

    // const [weekly_rate ,setWeeklyRate ] = useState(user.weekly_rate);
    // const [monthly_rate ,setMonthlyRate ] = useState(user.monthly_rate);
    // const [hourly_rate ,setHourlyRate ] = useState(user.hourly_rate);

    const [city_id , setCityId] = useState(user.city_id);
    const specialities  = useSelector(state => state.register.specialities);
    const [user_address,setUserAddress] = useState(user.address);

    const dispatch = useDispatch();
   
    const loading_status = useSelector(state => state.register.loading_status);

    useEffect(()=> {

        
        NetInfo.isConnected.fetch().then(isConnected => {

            if(!isConnected){
                props.navigation.navigate("NoNetwork");
                return;
            }else{
                dispatch(fetchJobCategories())
                .then(response =>{
                    if(response == 1){
                        dispatch(fetchSpecialities(profession_id))
                            .then(response =>{

                                if(response ==  1){
                                    specialities.forEach(ele => {

                                        if(ele.value  == speciality_id){
                                           
                                            setSpecialityLabel(ele.label)
                                        }
                                    });
                                    profession_categories.forEach(element => {

                                        if(element.value  == profession_id){
                                            
                                            setProfessionLabel(element.label);
                                            
                                        }
                                    });

                                    dispatch(fetchGrades())
                                    .then(response =>{
        
                                        if(response ==1 ){
                                            grades.forEach(element => {
                                                console.log("ele-- grades",element);
                                                if(element.value == grades_id) {
                                                   
                                                    setGradeLabel(element.label)
                                                }
                                            });
                                            dispatch(getStatesList())
                                                .then(response => {
                                                    if(response == 1){

                                                        get_states_list.map(element => {
                    
                                                            if(element.value == state_id){
                                                                setStateLabel(element.label);
                                                                dispatch(getCitiesList(state_id))
                                                                    .then(response =>{

                                                                        if(response.length >0 ){

                                                                            response.forEach(ele => {

                                                                                if(ele.value  == city_id){
                                                                    
                                                                                    // setCityId(ele.value);
                                                                                    setCityLabel(ele.label)
                                                                                   
                                                                                }

                                                                            })
                                                                           
                                                                        }
                                                                       

                                                                    })
                                                               
                                                            }
                                                        });

                                                    }
                                                })
                                        }
                                    })
                                }

                            })
                       
                       
                       
                    }
                });
               
               
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
                        dispatch(getCitiesList(id))
                        .then(response =>{

                            if(response.length >0 ){

                                response.forEach(ele => {

                                    if(ele.value  == city_id){
                        
                                        // setCityId(ele.value);
                                        setCityLabel(ele.label)
                                       
                                    }

                                })
                              
                            }
                           

                        })
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

    const onGradeChangeListener = (id) => {

        grades.forEach(element => {
            if(element.value == id) {
                setGrade(id);
                setGradeLabel(element.label)
            }
        })
    }

    const isValid = () => {
		var regexp = /^\d*\.?\d*$/;
		var isnum = regexp.test(experience);
		let valid = false;

		if (degree.length > 0) {
			valid = true;
		}

		if (profession_id.length === 0) {

			showMessage(0, 'Enter your profession', 'Profile', true, false);

			return false
		}
		else if (speciality_id.length === 0) {

			showMessage(0, 'Enter your specialities', 'Profile', true, false);

			return false
		}
		// else if (grades_id.length === 0) {

		// 	showMessage(0, 'Enter your grades', 'Profile', true, false);

		// 	return false
		// }
		else if (degree.length === 0) {

			showMessage(0, 'Enter  your degree', 'Profile', true, false);

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

	
		return valid;
    }
    
    const setLocationPref =() => {
        props.navigation.navigate('LocationPrefrences');
    }

    const setUserAddressGeocoder = async(value) => {
        setUserAddress(value);
        console.log(user_address);
      
    }


    const submitEditProfile11 = () => {


        NetInfo.isConnected.fetch().then(isConnected => {

            if(!isConnected){
                props.navigation.navigate("NoNetwork");
                return;
            }else{
                if(isValid()){

                    dispatch(showSpinner())
                    Geocoder.init("AIzaSyDBxQEvhACIZ73YCvPF9fI7A2l6lULic0E");
                    Geocoder.from(street_1)
                    .then(json => {
                        dispatch(hideSpinner())
                        var location = json.results[0].geometry.location;
                        console.log(json);
                        console.log("location",location);
                        dispatch(checkuserAuthentication(user.id,device_token))
                            .then(response => {

                                if(response.data.error){
                                    showMessage(0, 'Session Expired! Please Login.', 'Edit Profile', true, false);
                                    dispatch(logoutUser());
                                    props.navigation.navigate("Login")
                                    const resetAction = StackActions.reset({
                                        index: 0,
                                        key: 'Login',
                                        actions: [NavigationActions.navigate({ routeName: 'Login' })],
                                    });
                                    props.navigation.dispatch(resetAction);
                                }else{
                                    dispatch(submitEditProfile(user.id,user.first_name,user.last_name,profession_id,mobile,degree,speciality_id,grades_id,experience
                                        ,description,location.lat ,location.lng,state_id, city_id,street_1,street_2,post_code,props.navigation))
                                }
                            })
                       
                    })
                    .catch(error => 
                        {
                         console.log("er",error)  
                                    showMessage(0, 'Please Enter valid Address', 'Edit Profile', true, false);

                    });

                   
                }
              
            }
        });
     


}



    if(loading_status){

        return <MyActivityIndicator /> 
    }

    return(
        <KeyboardAwareScrollView>
        <View style={styles.container}>

                {/* <TouchableOpacity
                    onPress={setLocationPref}
                    >
                     <Text style={styles.locationPrefText} >+ Add Location {'\n'}Prefrence</Text>
                </TouchableOpacity> */}

                <TextField
                    style={{ alignSelf: 'center',color:'#A9A9A9' }}
                    labelHeight={15}
                    labelPadding={0}
                    fontSize={14}
                    label='First Name'
                    value={first_name}
                    editable={false}
                    onChangeText={(value) => setFirstName(value)}
                />

                <TextField
                    style={{ alignSelf: 'center',color:'#A9A9A9' }}
                    labelHeight={15}
                    labelPadding={0}
                    fontSize={14}
                    label='Last Name'
                    value={last_name}
                    editable={false}
                    onChangeText={(value) => setLastName(value)}
                />


                <TextField
                     labelHeight={15}
                     labelPadding={0}
                     fontSize={14}
                    style={{ alignSelf: 'center',color:'#A9A9A9'  }}
                    label='Email'
                    value={email}
                    editable={false}
                    onChangeText={(email) => setEmail(email)}
                />

                <TextField
                     labelHeight={15}
                     labelPadding={0}
                     fontSize={14}
                    style={{ alignSelf: 'center',color:'#A9A9A9'   }}
                    label='Mobile'
                    keyboardType='numeric'
                    textContentType='telephoneNumber'
                    value={mobile}
                    editable={false}
                    onChangeText={(mobile) => setMobile(mobile)}
                />

             
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
                    
                /> */}
               
                <TextField
                     labelHeight={15}
                     labelPadding={0}
                     fontSize={14}
                    style={{ alignSelf: 'center',}}
                    label='Degree'
                    value={degree}
                    onChangeText={(degree) => setDegree(degree)}
                />


                {/* <TextField
                     labelHeight={15}
                     labelPadding={0}
                     fontSize={14}
                    style={{ alignSelf: 'center',}}
                    label='Current Work'
                    value={current_work}
                    onChangeText={(current_work) => setCurrentWork(current_work)}
                /> */}

                <TextField
                     labelHeight={15}
                     labelPadding={0}
                     fontSize={14}
                    style={{ alignSelf: 'center', }}
                    label='Country'
                    value="Malaysia"
                    editable={false}
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


                {/* <TextField
                     labelHeight={15}
                     labelPadding={0}
                     fontSize={14}
                    style={{ alignSelf: 'center',}}
                    label='Address'
                    value={user_address}
                    onChangeText={(value) => setUserAddressGeocoder(value)}
                /> */}

                {/* <TextField
                    style={{ alignSelf: 'center',marginTop:10  }}
                    label='License Number'
                    value={license}
                    onChangeText={(license) => setLicense(license)}
                />
                <TextField
                    style={{ alignSelf: 'center',marginTop:10  }}
                    label='IC Number'
                    value={ic_no}
                    onChangeText={(ic_no) => setIcNo(ic_no)}

                />

                <TextField
                    style={{ alignSelf: 'center',marginTop:10  }}
                    label='Weekly Rate'
                    value={weekly_rate}
                    onChangeText={(weekly_rate) => setWeeklyRate(weekly_rate)}
                />
                <TextField
                    style={{ alignSelf: 'center',marginTop:10  }}
                    label='Monthly Rate'
                    value={monthly_rate}
                    onChangeText={(monthly_rate) => setMonthlyRate(monthly_rate)}

                />

                <TextField
                    style={{ alignSelf: 'center',marginTop:10  }}
                    label='Hourly Rate'
                    value={hourly_rate}
                    onChangeText={(hourly_rate) => setHourlyRate(hourly_rate)}

                /> */}



                <TextField
                     labelHeight={15}
                     labelPadding={0}
                     fontSize={14}
                    style={{ alignSelf: 'center', }}
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
                    style={{ alignSelf: 'center',}}
                    label='Description'
                    value={description}
                    onChangeText={(description) => setDescription( description )}
                />

              

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={submitEditProfile11}
                    underlayColor='#fff'>
                    <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>

        </View>
        </KeyboardAwareScrollView>


      
    )
}

let styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
        paddingTop:10,
        paddingLeft:20,
        paddingRight:20,
        marginTop:30

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
        alignSelf:'center',
        marginBottom:20
	},
	submitText: {
		fontFamily:'roboto-bold',
		color: 'white',
		textAlign: 'center',
		paddingLeft: 10,
		paddingRight: 10,
        fontSize: 20,
       
		
    },
    locationPrefText:{
        fontFamily:'roboto-bold',
		color: '#4C74E6',
		textAlign: 'right',
		paddingLeft: 10,
		paddingRight: 5,
        fontSize: 15,
        
    },

	indicator: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: 80
    }
    

});



export default EditProfile;
