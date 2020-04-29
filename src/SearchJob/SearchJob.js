import React ,{ useState, useEffect }  from 'react';
import {View ,Text, TouchableOpacity,Switch, StyleSheet ,SafeAreaView,TouchableWithoutFeedback,Image, Dimensions} from 'react-native'
import MyHOC from '../HOC/MyHOC';
import MyActivityIndicator from '../CustomUI/MyActivityIndicator';
import { TextField } from 'react-native-material-textfield';
import NetInfo from "@react-native-community/netinfo";
import { useSelector , useDispatch} from 'react-redux';
import { Dropdown } from 'react-native-material-dropdown';
import {fetchJobCategories, getStatesList, getCitiesList} from '../redux/stores/actions/register_user';
import { checkuserAuthentication,logoutUser} from '../redux/stores/actions/auth_action';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import { searchRequestedJobs } from '../redux/stores/actions/search_job_action';
import {showMessage}  from '../Globals/Globals';
import {
	StackActions, NavigationActions
} from 'react-navigation';


const SearchJob = (props) => {

    const device_token  = useSelector(state => state.auth.device_token);
    const [location_frame_status ,setLocationFrameStatus ] = useState(false);
    const loading_status  = useSelector(state => state.register.loading_status);
    const [experience ,setExperience ] = useState("");
    const [fulladdress , setFullAddress ] = useState("");
    const [latitude ,setLatitude ] = useState("");
    const [longitude ,setLongitude ] = useState("");
    const profession_categories = useSelector(state => state.register.profession_categories);
    const [dropdown_label  ,setDropdownLabel  ] = useState("");
    const [dropdown_value_id , setDropdownId] = useState(0); 
    const user_location_preference  =useSelector(state => state.register.user.location_preference)
    const authenticated = useSelector(state => state.auth.authenticated);
    const dispatch = useDispatch();
    const user_id = useSelector(state=>  state.auth.user_id);

    let get_states_list = useSelector(state => state.register.states_list);
    let get_cities_list = useSelector(state => state.register.cities_list);

    const [state_id ,setStateId ] = useState("");
    const [state_label ,setStateLabel ] = useState("");
    const [city_label ,setCityLabel ] = useState("");
    const [city_id , setCityId] = useState("");
    const [toggleSwitch, setToggleSwitch] = useState(false)

    useEffect(() => {

        dispatch(fetchJobCategories());
        dispatch(getStatesList());

        
       
    },[]);


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
                        
                                        //setCityId(ele.value);
                                        setCityLabel(ele.label)
                                       
                                    }

                                })
                              
                            }else{
                                setCityLabel(element.label)
                            }
                           

                        })
                    }
                });
            }
        })
    }

    const setToggleValues = () => {

        setStateId("");
        setCityId("");
       
        setToggleSwitch(!toggleSwitch);
    }

    const onCityChangeListener = (id) => {

        get_cities_list.forEach(ele => {

            if(ele.value  == id){

                setCityId(ele.value);
                setCityLabel(ele.label)
            }
        })
    }


    const onChangeTextPress = (value)  => {
		//ToastAndroid.show("IDDDDD.."+ value, ToastAndroid.LONG);
		if (profession_categories.length > 0) {
			//var jobs = this.state.jobs
			for (var i = 0; i < profession_categories.length; i++) {
				if (profession_categories[i].value === value) {
                    
                    setDropdownLabel(profession_categories[i].label);
                    setDropdownId(profession_categories[i].value);
				}
			}
		}

    }

    const isValid = () => {


        let valid = false;
    
       
        if(parseInt(dropdown_value_id) < 1){
           
            showMessage(0,'You must select job profile', 'Search Job', true, false);

            return false;

        }
        
        // else if(user_location_preference !== 3){

        //     if (fulladdress.length > 0 &&  experience.toString().length > 0) {
        //         valid = true;
        //     }else if (fulladdress.length === 0) {
    
           
        //         showMessage(0,'You must enter a location', 'Search Job', true, false);
        //     }
            

           
        // } 
    
        return true;
    }

    
    const searchJob = () => {

        if(isValid()){
            NetInfo.isConnected.fetch().then(isConnected => {

                if(isConnected){

                    dispatch(checkuserAuthentication(user_id,device_token))
                        .then(response => {

                            if(response.data.error){
                                showMessage(0, 'Session Expired! Please Login.', 'Search Job', true, false);
                                dispatch(logoutUser());
                                props.navigation.navigate("Login")
                                const resetAction = StackActions.reset({
                                    index: 0,
                                    key: 'Login',
                                    actions: [NavigationActions.navigate({ routeName: 'Login' })],
                                });
                                props.navigation.dispatch(resetAction);

                            }else{
                               // dispatch(searchRequestedJobs(dropdown_value_id,experience,fulladdress,latitude,longitude,user_id,props.navigation));
                        
                               let loc_pref;
                               if(city_id1 || city_id2 ){
                                   loc_pref = 1;
                               }else if(toggleSwitch){
                                   loc_pref = 3;
                               }else{
                                   loc_pref = 2;
                               }
                                dispatch(searchRequestedJobs(dropdown_value_id,experience,fulladdress,latitude,longitude,user_id,state_id,city_id,props.navigation));
                            }

                        })
                    
                   

                }

            });
          
        }

    }


    if (loading_status) {
        return (
           <MyActivityIndicator />
        );
    }



    if (location_frame_status) {
        
        return (

            <View style={styles.loactionModalContainerView}>

                    <View style={styles.loactionModalView}>
                        {/* <TouchableOpacity onPress={()=> setLocationFrameStatus(false)} style={{alignSelf:"flex-end"}}>
                            <Image source={require('../assets/nav/close.png')}  style={styles.closeButton} />
                        </TouchableOpacity> */}
                        
                    <GooglePlacesAutocomplete
                        placeholder='Search'
                        minLength={2} // minimum length of text to search
                        autoFocus={true}
                        returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                        listViewDisplayed={false}    // true/false/undefined
                        fetchDetails={true}
                        renderDescription={row => row.description} // custom description render
                        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                         
          
                        console.log("details",details);
                        console.log("data",data);
                            //this.setState({ location_frame_status: false, lat: lat, long: lng, location: full_addr })
                            setLatitude(details.geometry.location.lat);
                            setLongitude(details.geometry.location.lng);
                            setFullAddress(details.formatted_address)
                            setLocationFrameStatus(false);
                        }}

                        getDefaultValue={() => ''}

                        query={{
                            // available options: https://developers.google.com/places/web-service/autocomplete
                            key: 'AIzaSyDBxQEvhACIZ73YCvPF9fI7A2l6lULic0E',
                            language: 'en', // language of the results
                            types: '' // default: 'geocode'
                        }}

                        styles={{
                            textInputContainer: {
                                width: '100%',
                               
                            },
                            description: {
                                fontFamily:'roboto-bold',
                              
                               
                            }
                        }}

                          //		currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                        //	currentLocationLabel="Current location"
                        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch

                        GoogleReverseGeocodingQuery={{
                            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                        }}
                        GooglePlacesSearchQuery={{
                            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                            rankby: 'distance',
                            types: 'cafe'
                        }}

                        GooglePlacesDetailsQuery={{
                            // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                           // fields: 'formatted_address',
                          }}
                    

                         filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities


                        debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.

                    />
              
                    </View>
               
                  
            </View>


        );
    }

    return(
        <View style={styles.container}>

            <Dropdown
                labelPadding={0}
                labelHeight={15}
                fontSize={14}
                label='Select Job Profile'
                data={profession_categories}
                value={dropdown_label}
                onChangeText={(value) => { onChangeTextPress(value) }}
            />
             {/* <TextField
                style={{ width: '100%' }}
                label='Experience'
                maxLength={5}
                keyboardType='numeric'
                textContentType='telephoneNumber'
                value={experience}
                onChangeText={(experience) => {
                    var a = experience.replace(/[^0-9.]/g, '')
                    setExperience(a)
                }}
            /> */}

            <Dropdown
                    labelPadding={0}
                    labelHeight={15}
                    fontSize={14}
                    label='Select States'
                    data={get_states_list}
                    value={state_label}
                    onChangeText={(value) => { onStateChangeListener(value) }} // passing id here
                />

                <Dropdown
                    labelPadding={0}
                    labelHeight={15}
                    fontSize={14}
                    label='Select City'
                    data={get_cities_list}
                    value={city_label}
                    onChangeText={(value) => { onCityChangeListener(value) }} // passing id here
                />


            {/* <TextField
                labelPadding={0}
                labelHeight={15}
                fontSize={14}
                style={{ width: '100%' }}
                label='Location'
                editable = {!(user_location_preference ==  3)}
                onFocus={() => {
                   
                    setLocationFrameStatus(true)
                }}
                value={fulladdress}
                onChangeText={(fulladdress) => setFullAddress(fulladdress)}
            /> */}

<               View style={{flexDirection:"row",justifyContent:"space-between",marginTop:15}}>
                    <Text style={styles.textStyle}>10km to 20km from my location</Text>
                    <Switch 
                     trackColor={{true: '#4C74E6', false: 'grey'}}
                     thumbColor='#4C74E6'
                     onValueChange = {setToggleValues}
                     value = {toggleSwitch}
                    />
                </View>

            {/* {toggleSwitch
            ?
            <View style={{width:'100%',backgroundColor:'#ececec',height:100,
                    borderWidth:1,borderRadius:2,borderColor:'#ececec',padding:5}}>
                <Text style={{ fontFamily:'roboto-bold',fontSize:14,color:"grey"}}>Note :</Text>
                <Text numberOfLines={4} style={{ fontFamily:'roboto-light',fontSize:14,color:"black"}}>You have choosen your location preference of 10-20km. </Text>
            </View>
            :
            <View/>
            } */}
           

           
            

            <TouchableOpacity
                onPress={searchJob}
                style={styles.submitButton}>
                <Text style={styles.submitText}>Search</Text>
            </TouchableOpacity>

            


        </View>
    )
}

const  styles = StyleSheet.create({

    container :{ 
     padding:15,
      
    
    },
    closeButton :{ 
        width:25,
        height:25,
        alignSelf:'flex-end',
        marginBottom:10
    },

    loactionModalContainerView:{
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        justifyContent: 'center',
        alignItems:'center',
        flex:1
      
    },
    loactionModalView:{
        backgroundColor: 'white', 
        borderColor:'#a7bbfa',
        borderWidth:1,
        borderRadius:4,
        justifyContent: 'center',
        alignItems:"center",
        // width: Dimensions.get('window').width *  0.9,
        height : Dimensions.get('window').height * 0.8,
        paddingTop:5,
        paddingRight:5,
        paddingLeft:5,
        position:'absolute',
        top:20,
        bottom:0,
        left:20,
        right:20

    },

    submitButton:{
        width :'100%',
        textAlign:"center",
        paddingTop:10,
        paddingBottom:10,
        backgroundColor: '#4C74E6',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff',
        marginTop:20,
        
      },
      submitText:{
        color:'white',
        textAlign:'center',
        paddingLeft : 10,
        paddingRight : 10,
        fontSize :20,
         fontFamily:'roboto-bold'
		},
})

export default SearchJob;
