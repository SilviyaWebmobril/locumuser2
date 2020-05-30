import React ,{ useState, useEffect } from 'react';
import {View , Text ,StyleSheet,Image,TouchableOpacity,Alert} from 'react-native';
import { Card } from 'react-native-elements';
import MyHOC from '../HOC/MyHOC';
//import firebase from 'react-native-firebase';
import messaging from '@react-native-firebase/messaging';
import { useDispatch, useSelector } from "react-redux";
import {userDevicetoken,fetchJobCategories} from '../redux/stores/actions/auth_action';
import {showMessage} from '../Globals/Globals';
import {updateRemainingJobs} from '../redux/stores/actions/packages_coupon_action'


const HomeScreen =(props)  => {

    const token = useSelector(state => state.auth.device_token);
    const post_available =  useSelector(state => state.register.user.jobs_remaining)
    const verify = useSelector(state => state.register.user.verify);
    const wallet_balance =  useSelector(state => state.register.user.wallet_balance)
    const dispatch =  useDispatch();


      requestUserPermission = async() => {
        const settings = await messaging().requestPermission();
      
        if (settings) {

          console.log('Permission settings:', settings);
        }
      }
   
    const  onTokenRefreshListener =()=>  messaging().onTokenRefresh(fcmToken => {
        // Process your token as required
        if(fcmToken){
          console.log("get fcmtoken123",fcmToken);
            dispatch(userDevicetoken(fcmToken));
        }
    });

    const getFcmToken =  () => messaging().getToken()
    .then(fcmToken => {
        if (fcmToken) {
           
           dispatch(userDevicetoken(fcmToken));
            
        } else {
            console.log("get fcmtoken111");
            
            onTokenRefreshListener();
        } 
    });


   

    const createNotificationListeners = () => {


         messaging().onMessage(async remoteMessage => {

            console.log("message rece",remoteMessage);
           // alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
         
          });

          messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background!', remoteMessage);

          
          
    
          });

          const notificationOpened =  messaging().onNotificationOpenedApp(remoteMessage => {
            console.log(
              'Notification caused app to open from background state:',
              remoteMessage,
            );

            const myRemote = remoteMessage.data.result;

            let item = JSON.parse(myRemote);
            if(item !== null && item !== undefined){

                let app_status  = 0 ;
                if("application_status" in item.job_detail){
                    app_status = item.job_detail.application_status
                }

                // clinic details in users object
                let clinic = {};
                if(item.job_detail.users !== null) {
                    Object.assign(clinic,item.job_detail.users);
                    if("jobs_remaining" in item.job_detail.users){
                        dispatch(updateRemainingJobs( item.job_detail.users.jobs_remaining,item.job_detail.users.wallet_balance))
                    }
                }
               
                let clinic_requirement =  "";
                if(item.job_detail.clinic_requirement !== null){
                    clinic_requirement = item.job_detail.clinic_requirement;
                }
                let job_scope = "";
                if(item.job_detail.job_scope !== null){
                    job_scope = item.job_detail.job_scope;
                }
                let city = "";
                if(item.job_detail.city !== null){
                    // Object.assign(city,item.job_detail.city)
                    city = item.job_detail.city.name;
                }
    
                props.navigation.navigate('JobDetails',{"id" :item.job_detail.id ,
                "profile" : item.job_detail.profile.name , "experience" :item.job_detail.exp_required , "location": item.job_detail.job_location,
                "date" : item.job_detail.required_date , "description" : item.job_detail.job_desc , "cid" : item.job_detail.cid ,
                 "from" : "" , "to" : "",'application_status':app_status,
                 "clinic_details" : clinic, "state" : item.job_detail.state.name , "city": city,"job_scope":job_scope,
                 "clinic_requirement" :clinic_requirement,"rm_hour": item.job_detail.rm_hour, "dayorhour": item.job_detail.dayorhour
                 //"clinic_details" : item.clinic
       
                })
    
             }
           
          });


        
          
    }

   

  


    useEffect(() => {

         requestUserPermission();
        onTokenRefreshListener();
         createNotificationListeners()
        
        if(token === null){
          
            getFcmToken();
           
        }
      //  createNotificationListeners();
    
       
        return () => {
           createNotificationListeners();
           requestUserPermission();
            onTokenRefreshListener();
        };

    },[]);

  
    return (
        
        // <View style={styles.container}>
          
        <View style={styles.container}>
           {/* <Image source={require('../assets/clinic/banner.jpg')}  style={styles.bannerImage} />  */}
           
           <View style={[styles.viewRow,{flex:0}]}>
               
                <Card containerStyle={styles.cardContainerStyle}>  
                    <TouchableOpacity onPress={()=>{
                    
                      if(wallet_balance == 0 && post_available == 0){

                        showMessage(0,"You needs to load your account with credit before you can search.", 'Home', true, false);

                    }else if(post_available == 0){

                        showMessage(0,"Please buy packages to post a new job.", 'Home', true, false);

                    }else{
                        props.navigation.navigate("SearchJob")
                    }
                  
                
                   }}>
                    <Image source={require('../assets/clinic/search.png')}  style={styles.imageStyle}  />
                    <Text style={styles.textStyle}>Search Job</Text>
                    </TouchableOpacity>
                </Card>

               <Card 
                containerStyle={styles.cardContainerStyle}>
                     <TouchableOpacity onPress={()=>{
                   props.navigation.navigate("Packages")
                   }}>
                    <Image source={require('../assets/doctor/package.png')} style={styles.imageStyle1} />
                   <Text style={styles.textStyle} >Buy Packages</Text>
                   </TouchableOpacity>
               </Card>

           </View>

           <View style={[styles.viewRow,{}]}>
               
               <Card containerStyle={styles.cardContainerStyle}>  
                   <TouchableOpacity onPress={()=>{
                  props.navigation.navigate("EditProfile")
                  }}>
                   <Image source={require('../assets/doctor/wallet.png')}  style={styles.imageStyle1}  />
                   <Text style={styles.textStyle}>Profile</Text>
                   </TouchableOpacity>
               </Card>
             
             
              <Card 
               containerStyle={styles.cardContainerStyle}>
                    <TouchableOpacity onPress={()=>{
                  props.navigation.navigate("AppliedJobs")
                  }}>
                   <Image source={require('../assets/clinic/4.png')} style={styles.imageStyle} />
                  <Text style={styles.textStyle} >Applied Jobs</Text>
                  </TouchableOpacity>
              </Card>

          </View>
           <View style={[styles.viewRow,{}]}>
               
               <Card containerStyle={styles.cardContainerStyle}>  
                   <TouchableOpacity onPress={()=>{
                  props.navigation.navigate("Wallet")
                  }}>
                   <Image source={require('../assets/doctor/wallet.png')}  style={styles.imageStyle1}  />
                   <Text style={styles.textStyle}>Wallet</Text>
                   </TouchableOpacity>
               </Card>
             
             
              <Card 
               containerStyle={styles.cardContainerStyle}>
                    <TouchableOpacity onPress={()=>{
                  props.navigation.navigate("ContactAdmin")
                  }}>
                   <Image source={require('../assets/clinic/4.png')} style={styles.imageStyle} />
                  <Text style={styles.textStyle} >Contact</Text>
                  </TouchableOpacity>
              </Card>

          </View>
        
        
        
        </View>
    )
}


const styles = StyleSheet.create({

    container :{ 
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'column',
        marginTop:40,
      
    },

    // bannerImage : {
    //     width: '100%', 
    //     height:null,
    //     flex:1.5
     
    // },
    viewRow:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
      
      

    },
    cardContainerStyle:{
        width:'40%',
        height:null,
        paddingTop:20,
        paddingBottom:20,
        elevation:5,
        borderColor:'#a7bbfa',
        alignItems:'center',
        justifyContent:"center"
    },
    imageStyle:{
        width:60,
        height:60,
        alignSelf:'center'
    },
    imageStyle1:{
        width:50,
        height:50,
        alignSelf:'center'
    },
    textStyle:{
        alignSelf:'center',
        fontSize:17,
        fontFamily:'roboto-bold',
        alignSelf:'center'
    }
})

export default HomeScreen ;