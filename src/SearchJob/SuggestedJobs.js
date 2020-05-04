import React ,{useState ,useEffect} from 'react';
import {View ,Text,StyleSheet, TouchableOpacity,FlatList} from 'react-native';
import { useDispatch,useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {Card} from 'react-native-elements';
import {showMessage} from '../Globals/Globals';
import NetInfo from "@react-native-community/netinfo";
import MyActivityIndicator from '../CustomUI/MyActivityIndicator';
import { TextField } from 'react-native-material-textfield';
import {checkuserAuthentication,logoutUser} from '../redux/stores/actions/auth_action';
import {suggested_jobs_list} from '../redux/stores/actions/search_job_action';
import { StackActions, NavigationActions } from 'react-navigation';


const SuggestedJobs = (props) => {

    const device_token  = useSelector(state => state.auth.device_token);
    const user_id = useSelector(state =>state.register.user.id);
    const suggested_jobs = useSelector(state => state.search_job.suggested_jobs);
    const loading_status = useSelector(state => state.register.loading_status);
    const dispatch = useDispatch();

    useEffect(() =>{

        dispatch(checkuserAuthentication(user_id,device_token))
            .then(response => {
                if(response.data.error){
                    showMessage(0, 'Session Expired! Please Login.', 'Suggested Jobs', true, false);
                    dispatch(logoutUser());
                    props.navigation.navigate("Login")
                    const resetAction = StackActions.reset({
                        index: 0,
                        key: 'Login',
                        actions: [NavigationActions.navigate({ routeName: 'Login' })],
                    });
                    props.navigation.dispatch(resetAction);
                    
                }else{
                    dispatch(suggested_jobs_list(user_id))
                }
            })
       
    },[]);

    if(loading_status){
        return(
            <MyActivityIndicator /> 
        )
    }

    const fetchAgain = () => {
        dispatch(checkuserAuthentication(user_id,device_token))
            .then(response => {
                if(response.data.error){
                    showMessage(0, 'Session Expired! Please Login.', 'Suggested Jobs', true, false);
                    dispatch(logoutUser());
                    props.navigation.navigate("Login")
                    const resetAction = StackActions.reset({
                        index: 0,
                        key: 'Login',
                        actions: [NavigationActions.navigate({ routeName: 'Login' })],
                    });
                    props.navigation.dispatch(resetAction);
                    
                }else{
                    dispatch(suggested_jobs_list(user_id))
                }
            })
    }

    const next = (item) => {

        console.log("itemm by suvggested..",item);
        props.navigation.navigate('JobDetails',{"id" :item.job.id ,
        "profile" : item.job.profile.name , "experience" :item.job.exp_required , "location": item.job.job_location,
        "date" : item.job.required_date , "description" : item.job.job_desc , "cid" : item.job.cid ,
        "from" : item.job.from_time , "to" : item.job.to_time,'application_status':item.application_status,
         "clinic_details" : item.job.clinic, "state" : item.job.state_name , "city": item.job.city_name,"job_scope":item.job.job_scope,
         "clinic_requirement" :item.job.clinic_requirement,"rm_hour": item.job.rm_hour, "dayorhour": item.job.dayorhour,
       

            fetch : fetchAgain

        })
    }

    return(
        <KeyboardAwareScrollView>
            <View style={{ padding: 1, width: '100%' }}>

           
                        {

                            suggested_jobs.length == 0
                                ?
                                <Text style={{ fontFamily:'roboto-bold', fontSize: 17, color: 'grey', textAlign: 'center', margin: 10 }}>No Suggested Jobs </Text>

                                :

                                <FlatList
                                    style={{ marginBottom: 20, width: '100%' }}
                                    data={suggested_jobs}
                                    showsVerticalScrollIndicator={false}
                                    scrollEnabled={false}
                                    renderItem={({ item }) =>

                                        <TouchableOpacity onPress={()=>{next(item)}}>
                                            <View>
                                                <Card containerStyle={{ padding: 10, borderRadius: 5, width: '90%' }}>
                                                    <View style={{ flexDirection: "row", justifyContent: "flex-start", marginBottom: 10 }}>
                                                        <Text style={{ fontFamily:'roboto-light', color: 'black', fontSize: 16,  }}>Job Name : </Text>
                                                        <Text style={{ fontFamily:'roboto-light', color: 'black', fontSize: 15, alignSelf: "center", }}>{item.job.profile.name}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row", justifyContent: "flex-start", marginBottom: 10 }}>
                                                        <Text style={{ fontFamily:'roboto-light', color: 'black', fontSize: 13, }}>Suggested By : </Text>
                                                        <Text style={{ fontFamily:'roboto-light', color: 'black', fontSize: 13, alignSelf: "center" }}>{item.userid.name}</Text>
                                                    </View>

                                                </Card>
                                            </View>

                                        </TouchableOpacity>
                                       
                                    }
                                    keyExtractor={item => item.name}
                                />
                        }

            </View>
        </KeyboardAwareScrollView>
    )

}


export default  SuggestedJobs;