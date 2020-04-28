import React ,{useState, useEffect } from 'react';
import {View,Text,TouchableOpacity,ScrollView,Image,StyleSheet,Alert} from 'react-native';
import {Card} from 'react-native-elements';
import { useSelector ,useDispatch } from 'react-redux';
import {checkuserAuthentication,logoutUser} from '../redux/stores/actions/auth_action';
import {onApplyJob,onCancelJob} from '../redux/stores/actions/search_job_action';
import MyActivityIndicator from '../CustomUI/MyActivityIndicator';
import NetInfo from "@react-native-community/netinfo";
import { StackActions, NavigationActions } from 'react-navigation';
import {showMessage} from '../Globals/Globals';

const JobDetails =(props) => {

    const device_token  = useSelector(state => state.auth.device_token);
    const id = useState(props.navigation.getParam('id'));
    const clinic_id =  useState(props.navigation.getParam('cid'));
    const profile  = useState(props.navigation.getParam('profile'));
    const experience = useState(props.navigation.getParam('experience'));
    const description = useState(props.navigation.getParam('description'));
    const location = useState(props.navigation.getParam('location'));
    const from  = useState(props.navigation.getParam('from'));
    // const clinic_details  = useState(props.navigation.getParam('clinic_details'));
    // console.log("fr",clinic_details[0].email);
    const to = useState(props.navigation.getParam('to'));
    console.log("to",to);
    const date =  useState(props.navigation.getParam('date'));
    const [application_status, changeApplicatonStatus] = useState(props.navigation.getParam('application_status'));
    console.log("app",application_status);
    const user_id = useSelector(state =>  state.register.user.id);
    const authenticated = useSelector(state => state.auth.authenticated);
    const loading_status = useSelector(state => state.register.loading_status);
   
    const dispatch = useDispatch();


    const onApplyHandler = () => {

        NetInfo.isConnected.fetch().then(isConnected => {
			if(!isConnected)
			{
				props.navigation.navigate("NoNetwork")
				return;
			}
			else{

                dispatch(checkuserAuthentication(user_id,device_token))
                .then(response => {
                    if(response.data.error){
                        showMessage(0, 'Session Expired! Please Login.', 'Job Details', true, false);
                        dispatch(logoutUser());
                        props.navigation.navigate("Login")
                        const resetAction = StackActions.reset({
                            index: 0,
                            key: 'Login',
                            actions: [NavigationActions.navigate({ routeName: 'Login' })],
                        });
                        props.navigation.dispatch(resetAction);

                    }else{
                        dispatch(onApplyJob(id[0],clinic_id[0],user_id,props.navigation))
                        .then(response =>{
                            if(response ==  1){
                                changeApplicatonStatus(1);
                                props.navigation.state.params.fetch();
                            }
                        })


                    }
                })
       
            
            }
        });

    }

    const onCancelAlert = () => {

		Alert.alert(
			'Cancel',
			'Are you sure you want to cancel the job application?',
			[
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel'
				},
				{
					text: 'OK',
					onPress: () => oncanelHandler()
				}
			],
			{
				cancelable: false
			}
		);
	}



    const oncanelHandler = () => {

        console.log("cancel handler");

        NetInfo.isConnected.fetch().then(isConnected => {
			if(!isConnected)
			{
				props.navigation.navigate("NoNetwork")
				return;
			}
			else{
            
                dispatch(checkuserAuthentication(user_id,device_token))
                    .then(response => {
                        if(response.data.error){
                            showMessage(0, 'Session Expired! Please Login.', 'Job Details', true, false);
                            dispatch(logoutUser());
                            props.navigation.closeDrawer()
                            props.navigation.navigate("Login")
                            const resetAction = StackActions.reset({
                                index: 0,
                                key: 'Login',
                                actions: [NavigationActions.navigate({ routeName: 'Login' })],
                            });
                            props.navigation.dispatch(resetAction);

                        }else{
                            dispatch(onCancelJob(id[0],user_id,props.navigation));
                        }
                    })
           
               
            }
        });


    }

    const onSuggestJob = () => {
        props.navigation.navigate('SuggestJobToFriend',{job_id:id[0]})
    }

    if(loading_status){
        return (
            <MyActivityIndicator /> 
        )
    }
    

    return(
        <View style={styles.container}>
            <View style={styles.details}>
                {/* <View style={styles.viewRow}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={styles.textHeading}>Posted By :</Text>
                        <Text style={styles.textSubheading}>{clinic_details[0].name}</Text>
                    </View>
                </View> */}
                <View style={styles.viewRow}>
                    {/* <Image source={require('../assets/clinic/manager-avatar.png')}  style={styles.imageStyle} /> */}

                    <View style={{flexDirection:'row'}}>
                        <Text style={styles.textHeading}>Profile :</Text>
                        <Text style={styles.textSubheading}>{profile}</Text>
                    </View>
                    
                </View>
                <View style={styles.viewRow}>
                    {/* <Image source={require('../assets/clinic/clock2.png')}  style={styles.imageStyle} /> */}
                    <View style={{flexDirection:'row'}}>
                        <Text style={styles.textHeading}>Experience : </Text>
                        <Text style={styles.textSubheading}>{experience} Years</Text>
                    </View>
                </View>
                
                <View style={styles.viewRow}>
                    {/* <Image source={require('../assets/clinic/manager-avatar.png')}  style={styles.imageStyle} /> */}
                    <View style={{flexDirection:'row'}}>
                        <Text style={styles.textHeading}>Required Date : </Text>
                        <Text style={styles.textSubheading}>{date}</Text>
                    </View>
                </View>
                {(from[0] !== "" &&  to[0]!== "" && from[0] !== null && to[0] !== null)
                ?
                <View style={[styles.viewRow,{justifyContent:'space-between',}]}>
                        
                    <View style={{flexDirection:'row'}}>
                    {/* <Image source={require('../assets/clinic/manager-avatar.png')}  style={styles.imageStyle} /> */}
                        <Text style={styles.textHeading}>From : </Text>
                        <Text style={styles.textSubheading}>{from}</Text>
                    </View>
                
                    <View style={{flexDirection:'row'}}>
                        {/* <Image source={require('../assets/clinic/manager-avatar.png')}  style={styles.imageStyle} /> */}
                        <Text style={styles.textHeading}>To : </Text>
                        <Text style={styles.textSubheading}>{to}</Text>
                    </View>
                </View>
                :
                <View/>
                }
               
                <View style={styles.viewRow}>
                    
                    <View style={{flexDirection:'row'}}>
                    <Image source={require('../assets/clinic/map.png')}  style={styles.imageStyle} />
                        <Text style={styles.textHeading}>Location : </Text>
                        
                    </View>
                    <Text style={styles.locationText} numberOfLines={2}>{location}</Text>
                </View>
               
              
            </View>
            <Card 
            title="Description"
            containerStyle={{width:'95%',height:null,elevation:5,borderRadius:4}} >
                <Text numberOfLines={2} style={styles.dsepText}>{description}</Text>
               
            </Card>
           
            <View style={styles.viewRow}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'90%'}}>
                        <TouchableOpacity  onPress={onSuggestJob}
                            style={styles.suggestButton}>
                            <Text style={styles.suggestText}>Suggest Job</Text>
                        </TouchableOpacity>

                        {application_status ==  0
                        ?
                            <TouchableOpacity  onPress={onApplyHandler}
                                style={styles.submitButton}>
                                        <Text style={styles.submitText}>Apply</Text>
                            </TouchableOpacity>
                        :
                      
                            <Text style={styles.appliedText}>Applied</Text>
                        }
                        
                </View>
            </View>
           

        </View>
    )
}




let styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F2F2F2',
	  alignItems:'center',
		
    },
    imageStyle:{

        width:20,
        height:20,
        paddingRight:10

    },
    viewRow:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        marginBottom:15
    },
    details:{

        width:"100%",
        height:null,
        backgroundColor:'#6B579F',
        padding: 10,


    },
    textHeading:{
        color:'white',
        fontSize:15,
        fontFamily:"roboto-bold",
        paddingLeft:10,

    },
    locationText:{
        fontFamily:'roboto-bold',
        fontSize:15,
        color:"white",
        paddingLeft:10,
        lineHeight:20,
        flex:1
    },
    textSubheading:{
        color:'white',
        fontSize:15,
        fontFamily:'roboto-light',
        paddingLeft:10
    },
    dsepText:{
        fontSize:14,
        color:"black",
        fontFamily:'roboto-light',
        marginBottom:20
    },
	submitButton:{
        width:'40%',
	  padding:10,
      backgroundColor:'#4C74E6',
      borderRadius:10,
      borderWidth: 1,
      borderColor: '#fff',

	  alignSelf:'center'

    },
    submitText:{
		fontFamily:'roboto-bold',
        color:'white',
        textAlign:'center',
        fontSize :15,
	},
	suggestButton:{
        width:'40%',
		marginTop:10,
		paddingTop:10,
		paddingBottom:10,
        //backgroundColor:'#4C74E6',
        borderColor:'#4C74E6',
        borderWidth:2,
		borderRadius:10,
		marginBottom:10,
	alignSelf:'center'

	},
	suggestText:{
		fontFamily:'roboto-bold',
			color:'#4C74E6',
			textAlign:'center',
			fontSize :15,
},
cancelButton:{
    width:'40%',
    marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    //backgroundColor:'#4C74E6',
    borderColor:'red',
    borderWidth:2,
    borderRadius:10,
    marginBottom:10,
alignSelf:'center'

},
cancelText:{
    fontFamily:'roboto-bold',
        color:'red',
        textAlign:'center',
        fontSize :15,
},
appliedText:{
    fontFamily:'roboto-bold',
        color:'#4C74E6',
        textAlign:'center',
        fontSize :15,
},
	indicator: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: 80
	  }

})



export default JobDetails;