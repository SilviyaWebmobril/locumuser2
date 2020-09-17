import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging'
import firebase from '@react-native-firebase/app'
import AsyncStorage from '@react-native-community/async-storage';
import {Notifications} from 'react-native-notifications';
import {userDevicetoken,fetchJobCategories,} from '../redux/stores/actions/auth_action';
import { useDispatch, useSelector } from "react-redux";
import {updateRemainingJobs} from '../redux/stores/actions/packages_coupon_action'

export default PushNotification =  (props) => {

    const dispatch =  useDispatch();
  useEffect(()=>{
    checkApplicationPermission();
  }, [])
  async function checkApplicationPermission () {
    const authorizationStatus = await messaging().requestPermission()

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      getToken()
    } else if ( authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL ) {
      requestUserPermission()
    } else {
    }
  }

  async function getToken () {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log("fcmToken", fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken()
      console.log("fcmToken", fcmToken);
      if (fcmToken) {
        dispatch(userDevicetoken(fcmToken));
        // await saveFcmToken({fcm_token: fcmToken}, user.userId);
      }
    }
    global.fcmToken = fcmToken

  }

  async function requestUserPermission () {
    const authorizationStatus = await messaging().requestPermission()

    if (authorizationStatus) {
      getToken()
    }
  }
  
  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('on notification Message Sync '+JSON.stringify(remoteMessage))
      // console.log('on notification Message Sync '+remoteMessage)

      if(Platform.OS=='ios'){

          Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
            console.log("Notification Received - Foreground", notification.payload);
      
            // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
          // completion({alert: true, sound: true, badge: false});
          });
            console.log("Into ABC====>", remoteMessage);

       
            Notifications.events().registerNotificationReceivedBackground((notification, completion) => {
              console.log("Notification Received - Background", notification.payload);
        
              // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
              
             // completion({alert: true, sound: true, badge: false});
            });
            
  
      

      
      }else{
        console.log('on notification Message Sync ',remoteMessage.data);

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
    
               

                Notifications.postLocalNotification({
                    title: remoteMessage.notification.title,
                    body: remoteMessage.notification.body,
                    data:{
                        item
                    },
                    silent: false,
                    category: "SOME_CATEGORY",
                    userInfo: { }
                  });
    
             }
       
      }
      
  
      Notifications.events().registerNotificationOpened((notification, completion) => {
        console.log(`Notification opened: `+JSON.stringify(notification.payload));
       
        // console.log(`Notification opened: `+JSON.stringify(notification));
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

        //completion();
      });
    })
   
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('on notification Open HEY'+JSON.stringify(remoteMessage));
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
           "clinic_requirement" :clinic_requirement,"rm_hour": item.job_detail.rm_hour, "dayorhour": item.job_detail.dayorhour})
           //"clinic_details" : item.clinic
        }

    })

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log('Initial notification '+JSON.stringify(remoteMessage));

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
           "clinic_requirement" :clinic_requirement,"rm_hour": item.job_detail.rm_hour, "dayorhour": item.job_detail.dayorhour})
           //"clinic_details" : item.clinic

        } 
        //setLoading(false)
      })
    return unsubscribe
  }, [])
  return <></>
}