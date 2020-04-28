import React ,{useState, useEffect} from 'react';
import {View ,Text, TouchableOpacity ,FlatList,ScrollView,Image ,Alert} from 'react-native';
import {Card} from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import ApiUrl from '../Globals/ApiUrl';
import {get_applied_jobs} from '../redux/stores/actions/search_job_action';
import {getday, showMessage} from '../Globals/Globals';
import MyActivityIndicator from '../CustomUI/MyActivityIndicator';
import { StackActions, NavigationActions } from 'react-navigation';
import {checkuserAuthentication ,logoutUser} from '../redux/stores/actions/auth_action';

const AppliedJob = (props) => {

    const dispatch  = useDispatch();
    const  applied_jobs = useSelector(state => state.search_job.applied_jobs);
    const device_token  = useSelector(state => state.auth.device_token);
    console.log("applied",applied_jobs);
    const loading_status = useSelector(state =>state.register.loading_status);
    const user_id  = useSelector(state => state.auth.user_id);

 
    useEffect(() => {
        
        dispatch(checkuserAuthentication(user_id,device_token))
            .then(response => {
                if(response.data.error){
                    showMessage(0, 'Session Expired! Please Login.', 'Applied Job', true, false);
                    dispatch(logoutUser());
                    props.navigation.navigate("Login")
                    const resetAction = StackActions.reset({
                        index: 0,
                        key: 'Login',
                        actions: [NavigationActions.navigate({ routeName: 'Login' })],
                    });
                    props.navigation.dispatch(resetAction);
                }else{
                    dispatch(get_applied_jobs(user_id))
                }
            })
       
       
    }, []);

    if(loading_status){
        return(
            <MyActivityIndicator /> 
        )
    }

    const loadAgain = () => {

         dispatch(checkuserAuthentication(user_id,device_token))
            .then(response => {
                if(response.data.error){
                    showMessage(0, 'Session Expired! Please Login.', 'Applied Job', true, false);
                    dispatch(logoutUser());
                    props.navigation.navigate("Login")
                    const resetAction = StackActions.reset({
                        index: 0,
                        key: 'Login',
                        actions: [NavigationActions.navigate({ routeName: 'Login' })],
                    });
                    props.navigation.dispatch(resetAction);
                }else{
                    dispatch(get_applied_jobs(user_id))
                }
            })
    }
  

    return(
        <ScrollView style={{ paddingBottom: 15, width: "100%" }}>
            <View style={{ padding: 1, width: '100%' }}>
                {applied_jobs.length > 0 
                ?
                    <FlatList
                    style={{ marginBottom: 20 }}
                    data={applied_jobs}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                    renderItem={({ item }) =>

                    //   <View style={{width:'100%'}}>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate('AppliedJobsDetails',{"id" :item.job_id ,
                        "profile" : item.job_detail.profile.name , "experience" :item.job_detail.exp_required , "location": item.job_detail.job_location,
                        "date" : item.job_detail.required_date , "description" : item.job_detail.job_desc , "cid" : item.job_detail.cid ,
                         "from" : item.job_detail.from_time , "to" : item.job_detail.to_time,"application_status":item.application_status,"appid":item.id,
                         load :loadAgain
                    })

                    }}>
                        <Card containerStyle={{ padding: 12, borderRadius: 5,borderColor:'#a7bbfa',elevation:5 }} >

                            <View style={{ flexDirection: "row", marginBottom: 10, alignItems: "flex-start" }}>
                                
                                    {item.clinic_name.user_image == null
                                ?
                                <Image source={require('../assets/doctor/avatar1.png')} style={{
                                    position: 'absolute',
                                    borderRadius: 70 / 2, height: 70, width: 70,
                                }} />
                                :
                                <Image source={{ uri: ApiUrl.image_url + item.clinic_name.user_image }} style={{
                                    position: 'absolute',
                                    borderRadius: 70 / 2, height: 70, width: 70
                                }} />
                                } 
                            
                                <View style={{marginTop:10}}>
                                   
                                        <Text style={{ color: 'black',fontFamily:'roboto-bold', fontSize: 18, marginBottom: 10, marginLeft: 80,  color: "#4C74E6", textAlign: "center",flex:2 }}>  {item.clinic_name.name}  </Text>
                                   
                                    <View style={{ flexDirection: "row", marginLeft: 80, marginBottom: 10 }}>
                                        <Image source={require('../assets/nav/clock.png')} style={{ width: 15, height: 15 }} />
                                        <Text style={{ fontSize: 12, marginLeft: 5, marginTop: -2 ,fontFamily:'roboto-light'}}>  {item.created_at.split(' ')[1]}  </Text>
                                    </View>
                                </View>

                            </View>
                            {item.application_status == 0
                                ?
                                <Text numberOfLines={2} style={{ color: 'red', fontSize: 13, marginBottom: 10,  marginTop: 5, fontWeight: "bold", textAlign: "left",flex:1, fontFamily:'Roboto-Light'}}>  Not Reviewed  </Text>
                                :
                                (item.application_status == 2
                                    ?
                                    <Text style={{ color: 'black', fontSize: 13, marginBottom: 10, marginTop: 5, fontWeight: "bold", textAlign: "left",fontFamily:'Roboto-Light' }}>  Rejected  </Text>
                                    :
                                    <Text style={{ fontSize: 13, marginBottom: 10,fontWeight: "bold", marginTop: 5, color: "#5AA86C", textAlign: "left",flex:1,fontFamily:'Roboto-Light' }}>  Approved  </Text>
                                )
                            }

                              <View style={{ flexDirection: "row", justifyContent:"space-between",alignItems:"center", marginBottom: 5, marginLeft: 0 }}>
                                    <Text style={{ fontSize: 13 ,fontFamily:'roboto-bold',color:"grey"}}>Applied Date : </Text>
                                    <Text style={{ fontSize: 12, marginLeft: 5, marginTop: 2,fontFamily:'roboto-light',alignSelf:'flex-end' }}>  {item.created_at.split(' ')[0]}  </Text>
                                </View>
                             
                            <Text style={{ fontSize: 14, marginLeft: 5, marginTop: 2, textAlign: "right", color: "#4C74E6" ,fontFamily:'Roboto-Light'}}>  View Details  >>  </Text>

                        </Card>
                    </TouchableOpacity>

                }
                keyExtractor={item => item.name}
                />
                :
                    <Text style={{flex:1,fontFamily:'roboto-bold',fontSize:15,color:'grey',alignSelf:'center',margin:10}}>No Jobs Found</Text>
                }
                
            </View>
        </ScrollView>
    )

}

export default AppliedJob;