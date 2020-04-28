import React ,{useState, useEffect} from 'react';
import {View ,Text, TouchableOpacity,StyleSheet,FlatList} from 'react-native';
import {useDispatch ,useSelector} from 'react-redux';
import MyActivityIndicator from '../CustomUI/MyActivityIndicator';
import {Card } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { TextField } from 'react-native-material-textfield';
import NetInfo from "@react-native-community/netinfo";
import Axios from 'axios';
import ApiUrl from '../Globals/ApiUrl';
import {showMessage} from '../Globals/Globals';
import {checkuserAuthentication ,logoutUser} from '../redux/stores/actions/auth_action';
import { StackActions, NavigationActions } from 'react-navigation';

const SuggestjobToFriend = (props) => {

    const user_id  = useSelector(state =>state.register.user.id);
    const [email,setEmail ] = useState("");
    const [get_user_list, setUserList] = useState([]);
    const [loading_status, setLoadingStatus] = useState(false); 
    const job_id = props.navigation.getParam('job_id');
    const dispatch = useDispatch();
    const device_token  = useSelector(state => state.auth.device_token);


    const onSearch = () => {

        NetInfo.isConnected.fetch().then(isConnected => {
            if (!isConnected) {
                props.navigation.navigate("NoNetwork")
                return;
            }else{

                dispatch(checkuserAuthentication(user_id,device_token))
                    .then(response =>{ 

                        if(response.data.error){
                            showMessage(0, 'Session Expired! Please Login.', 'Suggest Job To Friend', true, false);
                            dispatch(logoutUser());
                            props.navigation.navigate("Login")
                            const resetAction = StackActions.reset({
                                index: 0,
                                key: 'Login',
                                actions: [NavigationActions.navigate({ routeName: 'Login' })],
                            });
                            props.navigation.dispatch(resetAction);

                        }else{

                            let formData = new FormData();
                            formData.append('keyword', email);
                            formData.append('user_id', user_id);
                            setLoadingStatus(true)
                            Axios.post(ApiUrl.base_url+ ApiUrl.search_user,formData)
                                .then(response =>{
                                    setLoadingStatus(false);
                                    console.log("respp",response.data);
                                    if(response.data.status == 'success'){
                                        
                                       
                                        setUserList(response.data.data);
                                       // showMessage(0,response.data.message,'Suggest Jobs', true,false); 
                    
                                    }else{
                                        showMessage(0,response.data.message,'Suggest Job', true,false); 
                                    }
                    
                                })
                                .catch(error =>{
                                    showMessage(0,'Something went wrong. Please try again later !', 'Suggest Job', true, false);
                                })
                    

                        }
                    });
            }
        });

       
    }

    const isValid = () => {


		let valid = false;

		if (email.length > 0) {
			valid = true;
		}

		if (email.length === 0) {
			showMessage(0, 'Enter an email', 'Suggest Job', true, false);

			return false
		}


		return valid;
	}

    const onTransfer = (item) => {

     
		if (isValid()) {
			NetInfo.isConnected.fetch().then(isConnected => {
				if (!isConnected) {
					props.navigation.navigate("NoNetwork")
					return;
				}
				else {

                    dispatch(checkuserAuthentication(user_id,device_token))
                        .then(response => {
                            if(response.data.error){
                                showMessage(0, 'Session Expired! Please Login.', 'Suggest Job To Friend', true, false);
                                dispatch(logoutUser());
                                props.navigation.navigate("Login")
                                const resetAction = StackActions.reset({
                                    index: 0,
                                    key: 'Login',
                                    actions: [NavigationActions.navigate({ routeName: 'Login' })],
                                });
                                props.navigation.dispatch(resetAction);
                            }else{

                                let formData = new FormData();
                                formData.append('user_id', user_id);
                                formData.append('job_id', job_id);
                                formData.append('to_id', item.id);
                              
                                Axios.post(ApiUrl.base_url+ApiUrl.transfer_job,formData)
                                .then(response =>{
                                    setLoadingStatus(false);
                                    console.log("form",response.data);
                                    if (response.data.status === "success") {
                                        showMessage(0, response.data.message, 'Suggest Job', true, false);
                                        props.navigation.pop();
            
                                    }
                                    else {
                                        showMessage(0, response.data.message, 'Suggest Job', true, false);
            
                                    }
            
                                })
                                .catch(error => {
            
                                    console.log("er",error);
                                    showMessage(0,'Something went wrong. Please try again later !', 'Suggest Job', true, false);
                                })

                            }
                        })
                   
                  
					
				}

			})


		}


    }

    if(loading_status){
        return(
            <MyActivityIndicator /> 
        )
    }

    return(
        <KeyboardAwareScrollView>
            <View style={styles.container}>
            <TextField
                style={{ width: '90%' }}
                label='Enter Email id. '
                value={email}
                onChangeText={(email) => setEmail(email)}
            />

                <FlatList
                    style={{ marginBottom: 20 }}
                    data={get_user_list}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                    renderItem={({ item }) =>


                        <View>
                            <Card containerStyle={{ padding: 10, borderRadius: 10 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{  fontFamily:'roboto-light',color: 'black', fontSize: 18 }}>{item.name}</Text>
                                    <TouchableOpacity onPress={() => onTransfer(item)}>
                                        <Text style={{  fontFamily:'roboto-light',color: '#128EE2', fontSize: 18 }}>Transfer</Text>
                                    </TouchableOpacity>
                                    
                                </View>

                            </Card>
                        </View>

                    }
                    keyExtractor={item => item.key}
                />


                <TouchableOpacity
                    onPress={onSearch}
                    style={styles.submitButton}>
                    <Text style={styles.submitText}>Search</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    )
}

export default SuggestjobToFriend;

const styles = StyleSheet.create({

    container: {
      flex:1,
        paddingLeft:20,
        paddingRight:20,
        paddingTop:0,
        backgroundColor: '#F2F2F2',
    },
    submitButton: {
		width: '100%',

		paddingTop: 10,
		paddingBottom: 10,
		backgroundColor: '#4C74E6',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#fff',
		marginTop: 10,

	},
	submitText: {
		fontFamily:'roboto-bold', 
		color: 'white',
		textAlign: 'center',
		paddingLeft: 10,
		paddingRight: 10,
		fontSize: 20,
	},
	indicator: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: 80
	}
})

