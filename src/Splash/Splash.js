import React, { useState, useEffect } from 'react';
import {View , Text, Image,StatusBar} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {useSelector, useDispatch } from 'react-redux';
import {hideSpinner} from '../redux/stores/actions/register_user';


const Splash = (props) => {

    const user_id =  useSelector (state => state.auth.user_id);
    const dispatch =  useDispatch();
    


    check = async () =>{

            dispatch(hideSpinner())
        
            let item =await AsyncStorage.getItem("STORE_USER_ID_GLOBALLY");  
            console.log("user_id",user_id);

            if(user_id){
                props.navigation.navigate('Home')
            }else{
                props.navigation.navigate('Login')
            }
     //});

    }

    useEffect(() => {
        StatusBar.setBackgroundColor('#0040FF')
        check()

    })
   

    return(
         <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
			  height:'100%',
			  backgroundColor:'white'
            }}>

			 <Image source={require('../assets/doctor/logo.png')} style={{height:'35%', width:'50%',marginTop:-20}} resizeMode='contain'/>

          </View>
    )


}

export default Splash;