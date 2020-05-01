import React ,{ useState, useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { useSelector, useDispatch } from 'react-redux';
import {ScrollView,
	Text, View, StyleSheet, FlatList,
	TouchableOpacity,
} from 'react-native';
import { Card, ListItem, Icon } from 'react-native-elements';
import { getday,getWeekday,getMonth,getYear} from '../Globals/Globals';
import { checkuserAuthentication ,logoutUser} from '../redux/stores/actions/auth_action';
import { StackActions, NavigationActions } from 'react-navigation';
 
const JobList = (props) => {

    const device_token  = useSelector(state => state.auth.device_token);
    const searched_job_list = useSelector(state => state.search_job.search_jobs_list);
    const dispatch = useDispatch();
    const user_id = useSelector(state =>  state.register.user.id);;


    const fetchAgain = () => {

        dispatch(checkuserAuthentication(user_id,device_token))
                .then(response => {
                    if(response.data.error){
                        showMessage(0, 'Session Expired! Please Login.', 'Job List', true, false);
                        dispatch(logoutUser());
                        props.navigation.navigate("Login")
                        const resetAction = StackActions.reset({
                            index: 0,
                            key: 'Login',
                            actions: [NavigationActions.navigate({ routeName: 'Login' })],
                        });
                        props.navigation.dispatch(resetAction);

                    }else{
                        //
                        //dispatch(suggested_jobs_list(user_id))


                    }
                })
       
    }

    const emptyList = () => {
        return(
            <Text style={{flex:1,fontFamily:'roboto-bold',fontSize:15,color:'grey',alignSelf:'center',margin:10}}>No Jobs Found</Text>
        )
    }

    return(
                <View style={styles.container}>
                  
                    <FlatList
                            contentContainerStyle={{ paddingBottom:10,backgroundColor: '#F2F2F2'}}
                            ListEmptyComponent={emptyList()}
							data={searched_job_list}
							showsVerticalScrollIndicator={false}
							renderItem={({ item }) =>

                         
                                <View style={{ borderColor:'#ececec',width:"95%",borderRadius:2,marginTop:5,marginBottom:5, backgroundColor: '#F2F2F2',  elevation:2,padding:1,alignSelf:"center"}}
                                >
                                       <TouchableOpacity style={{alignSelf:"center",flexDirection:"row", backgroundColor: '#F2F2F2',}} onPress={()=> {
                                            console.log("from",item);
                                            console.log("to",item.to_time);
                                            props.navigation.navigate('JobDetails',{"id" :item.id ,
                                                "profile" : item.name , "experience" :item.exp_required , "location": item.job_location,
                                                "date" : item.required_date , "description" : item.job_desc , "cid" : item.cid ,
                                                "from" : item.from_time , "to" : item.to_time,'application_status':item.application_status,
                                                 "clinic_details" : item.clinic, "state" : item.state_name , "city": item.city_name,"job_scope":item.job_scope,
                                                 "clinic_requirement" :item.clinic_requirement,"rm_hour": item.rm_hour, "dayorhour": item.dayorhour,
                                                fetch : fetchAgain

                                            })}}>
                            
                                 
                                        <View style={styles.purpleView}>
                                            <Text style={{fontFamily:'roboto-bold', color: 'white',fontSize:14,marginBottom:2 }}>#JOB{item.jobid}</Text>
                                            {/* <Text style={{fontFamily:'roboto-bold', color: 'white',fontSize:15, }}></Text>
                                            <Text style={{fontFamily:'roboto-bold', color: 'white' ,fontSize:20}}> {getday(item.required_date)}</Text> */}
                                            <Text style={{fontFamily:'roboto-bold', color: 'white' ,fontSize:12,}}>  {getWeekday(item.required_date)} {getMonth(item.required_date)} {getYear(item.required_date)}</Text>
                                        
                                        </View>
                                        <View style={styles.whiteView}>
                                            {/* <Text numberOfLines={2} style={styles.detailsText}>Location : {item.job_location}</Text>  */}
                                             {/*<Text numberOfLines={2} style={styles.detailsText}>Description : {item.job_desc}</Text> */}
                                             <Text style={styles.detailsText}>Rates : RM {item.rm_hour}/{item.dayorhour ==  1 ? "Hour" : "Day" }</Text>
                                             
                                            <Text style={styles.detailsText}>Time : {item.from_time} - {item.to_time}</Text>
                                              
                                            {item.distance 
                                            ? 
                                             <Text numberOfLines={1} style={styles.detailsText}>Distance : {parseFloat(item.distance).toFixed(2)} km</Text>
                                            :
                                            <View/>
                                            }
                                           
                                            
                                            {/* {item.application_status ==  1 
                                            ?
                                                <Text style={styles.applied_status_text}>Applied</Text>
                                            :
                                                <View/>
                                            } */}
                                        </View>
                                       
                                  
                                    </TouchableOpacity>
                                    

                                </View>
                                
                          
							}
							keyExtractor={item => item.id}
						/>
                    

            </View>
       
    )
}

const styles = StyleSheet.create({

    container: {
        flex:1,
        backgroundColor: '#F2F2F2',
    },
    cardContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    purpleView:{
        borderTopLeftRadius:5,
        borderBottomLeftRadius:5,
        padding:5,
        flex:2.5,
        height:null,
        backgroundColor:'#4C74E6',
        justifyContent:'center',
        alignItems:'center'

    },
    whiteView:{
        paddingLeft:10,
        paddingTop:5,
        paddingRight:5, 
        borderBottomRightRadius:5,
        borderTopRightRadius:5,
        flex:3,
        height:null,

    },
	submitButton: {
		width: '100%',
		marginTop: 10,
		paddingTop: 10,
		paddingBottom: 10,
		backgroundColor: '#4C74E6',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#fff',
		marginTop: 40,

	},
	submitText: {
		color: 'white',
		textAlign: 'center',
		paddingLeft: 10,
		paddingRight: 10,
		fontSize: 20,
		fontWeight: 'bold'
    },
    detailsText:{
        color:'grey',
        fontSize:12,
        fontFamily:'roboto-bold',
        //marginBottom:5,
        lineHeight:20
    },
    applied_status_text:{
        color:'#4C74E6',
        fontSize:14,
        alignSelf:'flex-end',
        textAlign:'right',
        fontFamily:'roboto-bold',
        marginBottom:5,
        lineHeight:20
    }



});

export default JobList;