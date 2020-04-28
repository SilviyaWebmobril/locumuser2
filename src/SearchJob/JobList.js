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

    return(
            <ScrollView>
                <View style={styles.container}>
                    {searched_job_list.length > 0 
                    ?
                    <FlatList
                            contentContainerStyle={{ paddingBottom:10}}
                            
							data={searched_job_list}
							showsVerticalScrollIndicator={false}
							scrollEnabled={false}
							renderItem={({ item }) =>

                            <TouchableOpacity onPress={()=> {
                                console.log("from",item);
                                console.log("to",item.to_time);
                                props.navigation.navigate('JobDetails',{"id" :item.jobid ,
                                    "profile" : item.name , "experience" :item.exp_required , "location": item.job_location,
                                    "date" : item.required_date , "description" : item.job_desc , "cid" : item.cid ,
                                     "from" : item.from_time , "to" : item.to_time,'application_status':item.application_status,
                                    // "clinic_details" : item.clinic,
                                     fetch : fetchAgain

                                 })}}>
                            
                                <Card containerStyle={{ borderColor:'#ececec',padding:1,borderRadius: 5,  elevation:5,}}
                                wrapperStyle={{flexDirection:'row',}}
                                >
                                 
                                        <View style={styles.purpleView}>
                                            <Text style={{fontFamily:'roboto-bold', color: 'white',fontSize:15, }}> {getWeekday(item.required_date)}</Text>
                                            <Text style={{fontFamily:'roboto-bold', color: 'white' ,fontSize:20}}> {getday(item.required_date)}</Text>
                                            <Text style={{fontFamily:'roboto-bold', color: 'white' ,fontSize:15,}}> {getMonth(item.required_date)} {getYear(item.required_date)}</Text>
                                            {
                                            item.from_time !== "" 
                                            ?
                                            <Text style={{fontFamily:'roboto-bold',fontSize:15, color: 'white',marginTop:10 }}>{item.from_time}</Text>
                                            :
                                            <View/>
                                            }

                                        </View>
                                        <View style={styles.whiteView}>
                                            <Text numberOfLines={2} style={styles.detailsText}>Location : {item.job_location}</Text>
                                            <Text numberOfLines={2} style={styles.detailsText}>Description : {item.job_desc}</Text>
                                            <Text numberOfLines={1} style={styles.detailsText}>Distance : {parseFloat(item.distance).toFixed(2)} km</Text>
                                            
                                            {item.application_status ==  1 
                                            ?
                                                <Text style={styles.applied_status_text}>Applied</Text>
                                            :
                                                <View/>
                                            }
                                        </View>
                                       
                                  
                                   
                                    {/* <Text style={{fontFamily:'roboto-bold', color: '#009AFF',textAlign:'right' ,marginBottom:3}}>Apply</Text> */}

                                </Card>
                                
                            </TouchableOpacity>
							}
							keyExtractor={item => item.id}
						/>
                    :
                        <Text style={{flex:1,fontFamily:'roboto-bold',fontSize:15,color:'grey',alignSelf:'center',margin:10}}>No Jobs Found</Text>
                    }

            </View>

            </ScrollView>
            
        
       
    )
}

const styles = StyleSheet.create({

    container: {
        width:"100%",
        height:"100%",
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
        flex:1.5,
        height:null,
        backgroundColor:'#4C74E6',
        justifyContent:'center',
        alignItems:'center'

    },
    whiteView:{
        paddingLeft:10,
        paddingTop:10,
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
        fontSize:14,
        fontFamily:'roboto-bold',
        marginBottom:5,
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