import * as ActionTypes from '../../type';
import Axios from 'axios';
import ApiUrl from '../../../Globals/ApiUrl';
import {showMessage} from '../../../Globals/Globals';

export const searchRequestedJobs = (category_id,experience,location,lat,long,user_id,state_id, city_id,location_prefrence ,navigation) => {

    return dispatch => {

        dispatch({
            type:ActionTypes.SHOW_LOADING
        });

        let formData = new FormData();	
        formData.append('job_cat_id', category_id);
        formData.append('experience',"");
        //formData.append('location', location);
        formData.append("location_preference",location_prefrence)
        formData.append('lat', lat);
		formData.append('long', long);
        formData.append("user_id",user_id)
        formData.append("state",state_id);
        formData.append("city",city_id)
        console.log("formdata",formData);
        Axios.post(ApiUrl.base_url + ApiUrl.search_job,formData)
            .then(response => {

                console.log("res...",response.data);
                dispatch({
                    type: ActionTypes.HIDE_SPINNER
                })

               
                if(response.data.status === 'success'){


                    let result2= response.data.result;
                    let result1 = response.data.another_result;
                    if(response.data.result.length > 0){
                        result2.map(element => {
                            result1.push(element);
                        })
                      
                    }
                   
                    let shuffled_array = shuffle(result1);
                  
                    dispatch({

                        type: ActionTypes.SEARCH_JOBS_LIST,
                        jobs_list : shuffled_array
                    });

                     navigation.navigate('Location');

                }else{
                    showMessage(0,response.data.message, 'Search Job', true, false);
                }

            }).catch(error => {
                console.log(error)

                dispatch({
                    type:ActionTypes.RESPONSE_ERROR,
               })
                showMessage(0,'Something went wrong. Please try again later !', 'Search Job', true, false);

            })

    }
    
}

const  shuffle = (a)  => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}


export const get_applied_jobs = (user_id) => {

    return dispatch => {

        dispatch({
            type:ActionTypes.SHOW_LOADING
        });

        let formdata = new FormData();
        formdata.append("userid",user_id)
        Axios.post(ApiUrl.base_url+ApiUrl.applied_jobs,formdata)
            .then(response => {

                dispatch({
                    type: ActionTypes.HIDE_SPINNER
                });

                
                if(response.data.status === 'success'){

                    dispatch({

                        type: ActionTypes.APPLIED_JOB,
                        applied_jobs : response.data.result
                    });


                }else{

                    dispatch({

                        type: ActionTypes.APPLIED_JOB,
                        applied_jobs : []
                    });
                    showMessage(0,response.data.message, 'Applied Job', true, false);
                }

            })
            .catch(error => {

                dispatch({
                    type:ActionTypes.RESPONSE_ERROR,
               })
                showMessage(0,'Something went wrong. Please try again later !', 'Applied Job', true, false);


            })

    }
}

export const onApplyJob = (job_id,clinic_id,user_id,navigation) => (dispatch) => 
    new Promise(function(resolve){

        dispatch({
            type:ActionTypes.SHOW_LOADING
        });

        let formData = new FormData();
        formData.append('job_id', job_id);
        formData.append('userid', user_id);
        formData.append('role', 5);
        formData.append('clinicid', clinic_id);

        console.log("form",formData);
        Axios.post(ApiUrl.base_url + ApiUrl.apply_job,formData)
            .then(response  => {

                dispatch({
                    type: ActionTypes.HIDE_SPINNER
                });

               
                if(response.data.status === 'success'){
                   // AsyncStorage.setItem('job_remaining',responseJson.jobs_remaining.toString())
                   dispatch({
                    type: ActionTypes.UPDATE_JOBS_REMAINING,
                    jobs_remaining:  response.data.jobs_remaining,
                   });
                   dispatch({
                       type: ActionTypes.CHANGED_STATUS_TO_APPLIED,
                       job_id:job_id,
                   })
                   showMessage(0,response.data.message,'Job Details', true,false); 
                   // navigation.navigate("HomeScreen")

                    resolve(1)

                }
                else{
                
                    showMessage(0,response.data.message,'Job Details', true,false); 
                
                }

            })
            .catch(error => {

                console.log("erdfvdh",error);

                dispatch({
                    type:ActionTypes.RESPONSE_ERROR,
               })
                showMessage(0,'Something went wrong. Please try again later !', 'Applied Job', true, false);



            })


    


})

// export const onApplyJob = (job_id,clinic_id,user_id,navigation) => {

//     return dispatch => {

//         dispatch({
//             type:ActionTypes.SHOW_LOADING
//         });

//         let formData = new FormData();
//         formData.append('job_id', job_id);
//         formData.append('userid', user_id);
//         formData.append('role', 5);
//         formData.append('clinicid', clinic_id);

//         console.log("form",formData);
//         Axios.post(ApiUrl.base_url + ApiUrl.apply_job,formData)
//             .then(response  => {

//                 dispatch({
//                     type: ActionTypes.HIDE_SPINNER
//                 });

//                 console.log("respo",response.data);
//                 if(response.data.status === 'success'){
//                    // AsyncStorage.setItem('job_remaining',responseJson.jobs_remaining.toString())
//                    dispatch({
//                     type: ActionTypes.UPDATE_JOBS_REMAINING,
//                     jobs_remaining:  response.data.jobs_remaining,
//                    });
//                    dispatch({
//                        type: ActionTypes.CHANGED_STATUS_TO_APPLIED,
//                        job_id:job_id,
//                    })
//                    showMessage(0,response.data.message,'Job Details', true,false); 
//                    // navigation.navigate("HomeScreen")

                    

//                 }
//                 else{
                
//                     showMessage(0,response.data.message,'Job Details', true,false); 
                
//                 }

//             })
//             .catch(error => {

//                 console.log("er",error);

//                 dispatch({
//                     type:ActionTypes.RESPONSE_ERROR,
//                })
//                 showMessage(0,'Something went wrong. Please try again later !', 'Applied Job', true, false);



//             })


//     }


// } 


export const onCancelJob = (user_id ,job_id,navigation) => {

    return dispatch => {

        dispatch({
            type:ActionTypes.SHOW_LOADING
        });

        let formdata = new FormData();
        formdata.append("userid",user_id);
        formdata.append("application_id",job_id)

        console.log("for",formdata);
        Axios.post(ApiUrl.base_url+ApiUrl.cancel_job,formdata)
            .then(response  => {

                dispatch({
                    type: ActionTypes.HIDE_SPINNER
                });

                console.log("res",response.data.message);
                if(response.data.status === 'success'){
                    showMessage(0,response.data.message,'Cancel Job', true,false);
                    navigation.state.params.load();
                    navigation.goBack();
  
                  //
  
                }
                else{
                  showMessage(0,response.data.message,'Cancel Job', true,false);
                
                }
  



            })
            .catch(error => {


                console.log("er",error);

                dispatch({
                    type:ActionTypes.RESPONSE_ERROR,
               })
                showMessage(0,'Something went wrong. Please try again later !', 'Cancel Job', true, false);




            })

    }
}

export const suggested_jobs_list = (user_id) => {

    return dispatch => {

        dispatch({
            type:ActionTypes.SHOW_LOADING
        });

        let formdata = new FormData();
        formdata.append("user_id",user_id);

        console.log("formdata...",formdata);
        Axios.post(ApiUrl.base_url + ApiUrl.get_suggested_job,formdata)
            .then(response => {

                dispatch({
                    type: ActionTypes.HIDE_SPINNER
                });

                console.log("suggested jonbss....",response.data.data);
                if(response.data.status == 'success'){

                    console.log("suggested jonbss....",response.data.data);

                    dispatch({
                        type: ActionTypes.SUGGESTED_JOBS,
                        suggested_jobs:response.data.data
                    });
    

                }else{
                    dispatch({
                        type: ActionTypes.SUGGESTED_JOBS,
                        suggested_jobs:[]
                    });
                    showMessage(0,response.data.message,'Suggested Job', true,false);
                }

            })
            .catch(error => {

                console.log("error",error);
                dispatch({
                    type:ActionTypes.RESPONSE_ERROR,
               })
                showMessage(0,'Something went wrong. Please try again later !', 'Cancel Job', true, false);

            })
        
    }
} 