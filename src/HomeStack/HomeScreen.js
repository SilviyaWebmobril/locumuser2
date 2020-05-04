import React ,{ useState, useEffect } from 'react';
import {View , Text ,StyleSheet,Image,TouchableOpacity} from 'react-native';
import { Card } from 'react-native-elements';
import MyHOC from '../HOC/MyHOC';
import firebase from 'react-native-firebase';
import { useDispatch, useSelector } from "react-redux";
import {userDevicetoken,fetchJobCategories} from '../redux/stores/actions/register_user';
import {showMessage} from '../Globals/Globals';


const HomeScreen =(props)  => {

    const token = useSelector(state => state.auth.device_token);
    const post_available =  useSelector(state => state.register.user.jobs_remaining)
    const verify = useSelector(state => state.register.user.verify);
    const wallet_balance =  useSelector(state => state.register.user.wallet_balance)
    const dispatch =  useDispatch();

   
    const  onTokenRefreshListener =()=>  firebase.messaging().onTokenRefresh(fcmToken => {
        // Process your token as required
        if(fcmToken){
          console.log("get fcmtoken123",fcmToken);
            dispatch(userDevicetoken(fcmToken));
        }
    });

    const getFcmToken =  () => firebase.messaging().getToken()
    .then(fcmToken => {
        if (fcmToken) {
            dispatch(userDevicetoken(fcmToken));
            
        } else {
            console.log("get fcmtoken111");
            
            onTokenRefreshListener();
        } 
    });


    const  createNotificationListeners = async() => {
        /*
        * Triggered when a particular notification has been received in foreground
        * */
        notificationListener = firebase.notifications().onNotification((notification) => {

            console.log("notifaication log1",notification);
            
            getNotificationData(notification);
        });
      
      
        messageListener = firebase.messaging().onMessage((message) => {
          //process data message

          console.log("get message",JSON.stringify(message));
         
          getNotificationData(message);
        });

        const notificationOpen = await firebase.notifications().getInitialNotification();
        // called when notification is cliked
        console.log("i am here....",notificationOpen)
        if (notificationOpen) {
         const { _title, _body , _data } = notificationOpen.notification;
         let item = JSON.parse(_data.result);
         console.log("data res",item);
         if(item !== null && item !== undefined){

            let app_status  = 0 ;
            if("application_status" in item.job_detail){
                app_status = item.job_detail.application_status
            }
            let clinic = {};
            if(item.clinic !== null) {
                Object.assign(clinic,item.clinic)
            }

            props.navigation.navigate('JobDetails',{"id" :item.job_detail.id ,
            "profile" : item.job_detail.profile.name , "experience" :item.job_detail.exp_required , "location": item.job_detail.job_location,
            "date" : item.job_detail.required_date , "description" : item.job_detail.job_desc , "cid" : item.job_detail.cid ,
             "from" : "" , "to" : "",'application_status':app_status,
             //"clinic_details" : item.clinic
   
               })

         }
        
        }
        notificationListener = firebase.notifications().onNotificationOpened((notificationOpen) =>{

            console.log("i am here....",notificationOpen)
            if (notificationOpen) {
                const { _title, _body , _data } = notificationOpen.notification;
                let item = JSON.parse(_data.result);
                console.log("data res",item);
                if(item !== null && item !== undefined){
       
                   let app_status  = 0 ;
                   if("application_status" in item.job_detail){
                       app_status = item.job_detail.application_status
                   }
       
                   props.navigation.navigate('JobDetails',{"id" :item.job_detail.id ,
                   "profile" : item.job_detail.profile.name , "experience" :item.job_detail.exp_required , "location": item.job_detail.job_location,
                   "date" : item.job_detail.required_date , "description" : item.job_detail.job_desc , "cid" : item.job_detail.cid ,
                    "from" : "" , "to" : "",'application_status':app_status,
          
                      })
       
                }

            }

        })
        firebase.notifications().removeAllDeliveredNotifications()

      }

    

      const getNotificationData = (notification) => {

        const { _title, _body } = notification;
        const channelId = new firebase.notifications.Android.Channel(
            'Default',
            'Default',
            firebase.notifications.Android.Importance.High
        );
        firebase.notifications().android.createChannel(channelId);

        let notification_to_be_displayed = new firebase.notifications.Notification({
            data: notification._data,
            sound: 'default',
            show_in_foreground: true,
            title:  _title  ,
            body:  _body,
        });

        if (Platform.OS == 'android') {
            notification_to_be_displayed.android
                .setPriority(firebase.notifications.Android.Priority.High)
                .android.setChannelId('Default')
                .android.setVibrate(1000)
                .android.setSmallIcon('ic_launcher');
        }
      
       firebase.notifications().displayNotification(notification_to_be_displayed);

       



    //    let item = JSON.parse(notification._data.result);
    //      console.log("data res",item);
    //      if(item !== null && item !== undefined){

    //         let app_status  = 0 ;
    //         if("application_status" in item.job_detail){
    //             app_status = item.job_detail.application_status
    //         }

    //         props.navigation.navigate('JobDetails',{"id" :item.job_detail.id ,
    //         "profile" : item.job_detail.profile.name , "experience" :item.job_detail.exp_required , "location": item.job_detail.job_location,
    //         "date" : item.job_detail.required_date , "description" : item.job_detail.job_desc , "cid" : item.job_detail.cid ,
    //          "from" : "" , "to" : "",'application_status':app_status,
   
    //            })

    //     }
        

   
      }


    useEffect(() => {

       
        onTokenRefreshListener();
        
        if(token === null){
          
            getFcmToken();
           
        }
        createNotificationListeners();
    
       
        return () => {
            createNotificationListeners();
            onTokenRefreshListener();
        };

    },[]);

  
    return (
        
        // <View style={styles.container}>
          
        <View style={styles.container}>
           <Image source={require('../assets/clinic/banner.jpg')}  style={styles.bannerImage} /> 
           
           <View style={styles.viewRow}>
               
                <Card containerStyle={styles.cardContainerStyle}>  
                    <TouchableOpacity onPress={()=>{
                    
                      if(wallet_balance == 0 && post_available == 0){

                        showMessage(0,"Please add money and buy packages to post a new job.", 'Home', true, false);

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
                    props.navigation.navigate("ContactAdmin")
                    }}>
                    <Image source={require('../assets/clinic/4.png')} style={styles.imageStyle} />
                    <Text style={styles.textStyle} >Feedback</Text>
                    </TouchableOpacity>
                </Card>
                
              
               {/* <Card 
                containerStyle={styles.cardContainerStyle}>
                     <TouchableOpacity onPress={()=>{
                   props.navigation.navigate("Packages")
                   }}>
                    <Image source={require('../assets/doctor/package.png')} style={styles.imageStyle1} />
                   <Text style={styles.textStyle} >Buy Packages</Text>
                   </TouchableOpacity>
               </Card> */}

           </View>

           {/* <View style={styles.viewRow}>
               
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
                  <Text style={styles.textStyle} >Feedback</Text>
                  </TouchableOpacity>
              </Card>

          </View> */}
        
        </View>
    )
}


const styles = StyleSheet.create({

    container :{ 
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'column',
        flex:1
    },

    bannerImage : {
        width: '100%', 
        height:null,
        flex:1.5
     
    },
    viewRow:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        flex:1.2

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