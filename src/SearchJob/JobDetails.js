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
    const joblocation = useState(props.navigation.getParam('location'));
    const from  = useState(props.navigation.getParam('from'));

    const state = useState(props.navigation.getParam('state'));
    const city  = useState(props.navigation.getParam('city'));
    const rm_hour = useState(props.navigation.getParam('rm_hour'));
    const job_scope  = useState(props.navigation.getParam('job_scope'));
    console.log("job_scope",job_scope);
    const clinic_requirement  = useState(props.navigation.getParam('clinic_requirement'));
     const dayorhour  = useState(props.navigation.getParam('dayorhour'));
     const clinic_details  = useState(props.navigation.getParam('clinic_details'));
     console.log("fr",clinic_details[0].email);
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
                               
                                Alert.alert(
                                    'Job Application',
                                    'Thank You for applying. We will contact you shortly.',
                                    [
                                       
                                        {
                                            text: 'OK',
                                            onPress: () => {console.log("ok")}
                                        }
                                    ],
                                    {
                                        cancelable: false
                                    }
                                );
                                if(props.navigation.state.params.fetch !== undefined){
                                    props.navigation.state.params.fetch();
                                }
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
        <ScrollView>

       
        <View style={styles.container}>
            <View style={styles.details}>
                <View style={styles.viewRow}>
                   
                    <Text style={styles.textHeading}>Posted By</Text>
                    <Text style={styles.textSubheading}>: {clinic_details[0].name}</Text>
                
                </View>
                <View style={styles.viewRow}>
                    {/* <Image source={require('../assets/clinic/manager-avatar.png')}  style={styles.imageStyle} /> */}

                    {/* <View style={{flexDirection:'row',flex:1}}> */}
                        <Text style={styles.textHeading}>Profile</Text>
                        <Text style={styles.textSubheading}>:  {profile}</Text>
                    {/* </View> */}
                    
                </View>
                <View style={styles.viewRow}>
                    {/* <Image source={require('../assets/clinic/clock2.png')}  style={styles.imageStyle} /> */}
                    {/* <View style={{flexDirection:'row'}}> */}
                        <Text style={styles.textHeading}>Rates</Text>
                        <Text style={styles.textSubheading}>:  RM {rm_hour} / {dayorhour[0]  == 1 ? "Hour" : "Day"}</Text>
                    {/* </View> */}
                </View>
                
                <View style={styles.viewRow}>
                    {/* <Image source={require('../assets/clinic/manager-avatar.png')}  style={styles.imageStyle} /> */}
                    {/* <View style={{flexDirection:'row'}}> */}
                        <Text style={styles.textHeading}>Required {'\n'} Date</Text>
                        <Text style={styles.textSubheading}>:  {date}</Text>
                    {/* </View> */}
                </View>
                <View style={styles.viewRow}>
                    
                    {/* <View style={{flexDirection:'row'}}> */}
                    {/* <Image source={require('../assets/clinic/map.png')}  style={styles.imageStyle} /> */}
                        <Text style={styles.textHeading}>State</Text>
                        <Text style={styles.textSubheading} >:  {state}</Text>
                    {/* </View> */}
                    
                </View>
                {city[0] !== ""
                    ?
                <View style={styles.viewRow}>
                  
                    <Text style={styles.textHeading}>City</Text>
                    <Text style={styles.textSubheading} >:  {city}</Text>
                    
                </View>
                 :
                 <View/>
                 }
                {(from[0] !== "" && to[0] !== "")
                ?
                <View style={[styles.viewRow,{justifyContent:'space-between',alignItems:"center",flex:1}]}>
                        
                    <View style={{flexDirection:'row',alignSelf:"flex-start",flex:0.5}}>
                    {/* <Image source={require('../assets/clinic/manager-avatar.png')}  style={styles.imageStyle} /> */}
                        <Text style={styles.textHeadingFrom}>From</Text>
                        <Text style={styles.textSubheading}>:  {from}</Text>
                    </View>
                
                    <View style={{flexDirection:'row',alignSelf:"flex-end",flex:0.5}}>
                        {/* <Image source={require('../assets/clinic/manager-avatar.png')}  style={styles.imageStyle} /> */}
                        <Text style={styles.textHeadingFrom}>To </Text>
                        <Text style={styles.textSubheading}>:   {to}</Text>
                    </View>
                </View>
                :
                <View/>
                }
               
            </View>
            <Card 
            title="Other Details"
            containerStyle={{width:'97%',height:null,elevation:5,borderColor:'#a7bbfa',borderRadius:4}} >
                 <View style={{flexDirection:"row",justifyContent:"center",}}>
                    <Text style={styles.despHeading}>Job Location</Text>
                    <Text numberOfLines={20} style={styles.dsepText}>:  {joblocation}</Text>
                </View>
                <View style={{width:"100%",borderWidth:0.25,marginTop:10,marginBottom:5,backgroundColor:"#ececec"}}></View>
                <View style={{flexDirection:"row"}}>
                    <Text style={styles.despHeading}>Description</Text>
                    <Text numberOfLines={20} style={styles.dsepText}>:  {description}</Text>
                </View>
               
                {
                    (job_scope[0] !== ""  && job_scope[0] !== null)
                    ?
                    <>
                     <View style={{width:"100%",borderWidth:0.25,marginTop:10,marginBottom:10,backgroundColor:"#ececec"}}></View>
                    <View style={{flexDirection:"row"}}>
                        <Text style={styles.despHeading}>Job Scope</Text>
                        <Text numberOfLines={20} style={styles.dsepText}>:  {job_scope}</Text>
                    </View>
                    
                     </>
                    :
                    <View/>
                }

                {
                    (clinic_requirement[0] !== "" && clinic_requirement[0] !== null)
                    ?
                    <>
                     <View style={{width:"100%",borderWidth:0.25,marginTop:10,marginBottom:10,backgroundColor:"#ececec"}}></View>
                    <View style={{flexDirection:"row"}}>
                        <Text style={styles.despHeading}>Clinic / {'\n'} Hospital {'\n'} Requirement</Text>
                        <Text numberOfLines={20} style={styles.dsepText}>:  {clinic_requirement}</Text>
                    </View>
                   
                    </>
                    :
                    <View/>
                }
                
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
        </ScrollView>
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
        padding:10,


    },
    textHeadingFrom :{
        color:'white',
        fontSize:14,
        fontFamily:"roboto-bold",
        paddingLeft:5,
        //flex:0.27,
    },
    textHeading:{
        color:'white',
        fontSize:14,
        fontFamily:"roboto-bold",
        paddingLeft:5,
        flex:0.25,
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
        paddingLeft:5,
        flex:0.73,
    },
    dsepText:{
        fontSize:14,
        color:"black",
        fontFamily:'roboto-light',
        marginBottom:20,
        flex:4,
     
    },
    despHeading:{
        fontSize:13,
        color:"grey",
        fontFamily:'roboto-bold',
        flex:2,
       
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