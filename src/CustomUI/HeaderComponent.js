import React , { useState , useEffect} from 'react';
import {View ,Text, Image,TouchableOpacity,StyleSheet, Dimensions ,Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from "react-native-image-picker";
import {uploadProfilePic } from '../redux/stores/actions/register_user';
import {useSelector ,useDispatch} from 'react-redux';
import {showMessage} from '../Globals/Globals';
import ApiUrl from '../Globals/ApiUrl';
import {checkuserAuthentication,logoutUser} from '../redux/stores/actions/auth_action';
import { StackActions, NavigationActions } from 'react-navigation';

const HeaderComponent = (props) => {

   const device_token = useSelector(state => state.auth.device_token);
    const user_image = useSelector(state=> state.register.user.user_image);
    const [imageSource , setImageSource ] = useState(user_image);
    console.log("image",(imageSource === null || user_image === null || user_image === "" || imageSource == undefined));
    const user_id  = useSelector(state => props.edit == 1 ? state.register.user.id : state.register.register_id);
    const user_name = useSelector(state=> state.register.register_user_name);
    const first_name  = useSelector(state => state.register.user.first_name);
    const last_name  = useSelector(state => state.register.user.last_name);
    const wallet_balance  = useSelector(state =>state.register.user.wallet_balance);
    console.log("wallet_bal ",wallet_balance);
    
    const uploadPicDispatch = useDispatch();

   const selectPhotoTapped = () => {
		
		const options = {
			maxWidth: 500,
			maxHeight: 500,
			storageOptions: {
				skipBackup: true
			}
		};

		ImagePicker.launchCamera(options, (response) => {
			

			if (response.didCancel) {
				console.log('User cancelled photo picker');
			}
			else if (response.error) {
				showMessage(1, 'Cancelled', 'Profile', true, false);

			}
			else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			}
			else {
				//const image_data = { uri: `data:image/jpeg;base64,${response.data}` };

				let source = { uri: response.uri };
                setImageSource(source)
                if(props.edit == 1){

                    uploadPicDispatch(checkuserAuthentication(user_id,device_token))
                      .then(responseData => {
                        if(responseData.data.error){
                          showMessage(0, 'Session Expired! Please Login.', 'Profile', true, false);
                          dispatch(logoutUser());
                          props.navigation.navigate("Login")
                          const resetAction = StackActions.reset({
                              index: 0,
                              key: 'Login',
                              actions: [NavigationActions.navigate({ routeName: 'Login' })],
                          });
                          props.navigation.dispatch(resetAction);

                        }else{

                          if(Platform.OS == 'ios'){

                            uploadPicDispatch(uploadProfilePic(user_id,response.uri,"imgae.jpg"))
                        
                          }else{
                            uploadPicDispatch(uploadProfilePic(user_id,response.uri,response.fileName))
                        
                          }
        

                        }
                      })
                   

                }else{
                    
                   
                          if(Platform.OS == 'ios'){

                            uploadPicDispatch(uploadProfilePic(user_id,response.uri,"imgae.jpg"))
                        
                          }else{
                            console.log("hello");
                            uploadPicDispatch(uploadProfilePic(user_id,response.uri,response.fileName))
                        
                          }
        

                        }

			}
		});
	}
   
    return (
       
            <LinearGradient   
                style={{ height:150, }}
                colors= {["#4E73E6","#9456CE"]}
                start= {{x: 0.0, y: 0.5}}
                end= {{ x: 0.6, y: 0.4 }} >

                <React.Fragment>
                    <TouchableOpacity onPress={() => {(props.value === 1 || props.value == 2) ? props.navigation.goBack() : props.navigation.pop()}}>
                        <Image style={{ width: 20, height: 20, margin: 20 }} source={require('../assets/clinic/left-arrow.png')} />

                    </TouchableOpacity>

                  <View style={styles.mainStyle}>
                        <Text style={styles.userNameStyle}>{(props.value == 1 || props.value == 2) ? `${first_name} ${last_name}` : user_name}</Text>
                        {props.wallet == 1
                        ?
                        <Text style={styles.wallet_balance_text}>MYR {wallet_balance}</Text>
                        :
                        <View/>
                        }
                    {(imageSource === null || user_image === null || user_image === "" || imageSource == undefined)
                    ?
                        (props.wallet == 1
                        ?
                        <View style={styles.fab}>
                         <Image source={require("../assets/doctor/avatar1.png")} style={styles.imageStyle} />
                        </View>
                        :
                        <TouchableOpacity style={styles.fab} onPress={selectPhotoTapped}>
                             <Image source={require("../assets/doctor/avatar1.png")} style={styles.imageStyle} />
                        </TouchableOpacity>
                        )
                    
                    :
                    
                    (user_image !== null || user_image !== ""
                    ?
                        <TouchableOpacity style={styles.fab} onPress={selectPhotoTapped}>
                            <Image source={{uri:ApiUrl.image_url+user_image}} style={styles.imageStyle} />
                        </TouchableOpacity>
                      //   (props.edit == 1
                      //   ?
                      //   <TouchableOpacity style={styles.fab} onPress={selectPhotoTapped}>
                      //       <Image source={{uri:ApiUrl.image_url+imageSource}} style={styles.imageStyle} />
                      //   </TouchableOpacity>
                      //   :
                      //   <View style={styles.fab}>

                      //       <Image source={{uri:ApiUrl.image_url+imageSource}} style={styles.imageStyle} />
                      //   </View>
                      //  )
                    :
                    <TouchableOpacity style={styles.fab} onPress={selectPhotoTapped}>
                        <Image source={imageSource} style={styles.imageStyle} />
                    </TouchableOpacity>
                    )
                    }
                    

                  </View>
                  
              </React.Fragment>
            </LinearGradient>
       
    )


}

const styles = StyleSheet.create({

    mainStyle:{
        justifyContent:"center",alignItems:"center",
        bottom:0,
        right:0,
        left:0,
        top:120,
        position: 'absolute',
    },

    fab:{
        height: 100,
        width: 100,
        borderRadius: 50,
        borderColor:"black",
        borderWidth:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'white',
      },
     
    TouchableOpacityStyle: {
       
        alignItems: 'center',
        justifyContent: 'center',
       
      },
     
      imageStyle: {
        position: 'absolute',
       
        width: 100,
        height: 100,
        borderRadius:50,
       
      },
      userNameStyle:{
        fontSize:20,
        marginBottom:10,
        color:'white',
        fontFamily:'roboto-bold'
    },
    wallet_balance_text:{
      fontSize:15,
      marginBottom:10,
      color:'white',
      fontFamily:'roboto-bold'
  }
})

export default HeaderComponent;