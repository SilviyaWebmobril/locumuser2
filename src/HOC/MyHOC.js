import  React ,{ useState, useEffect } from 'react';
import {View , StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { useDispatch, useSelector } from "react-redux";
import MyActivityIndicator from '../CustomUI/MyActivityIndicator';

export default  MyHOC = (WrappedComponent,params) => (props)=>{ 

    const loading_status  = useSelector(state => state.register.loading_status);
  

    if (loading_status) {
        return (
           <MyActivityIndicator />
        );
    }


    return  (
        <KeyboardAwareScrollView>
           
                <WrappedComponent {...props} />

        </KeyboardAwareScrollView>
    )

}

const  styles = StyleSheet.create({

    container :{ 
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'column',
        //flex:1
    },
})

