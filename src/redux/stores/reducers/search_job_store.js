import * as ActionTypes from '../../type';


const initialState  = { 

    search_jobs_list:[],
    applied_jobs:[],
    suggested_jobs:[],

}

export default ( state = initialState  , action ) => {

    switch(action.type){

        case ActionTypes.SEARCH_JOBS_LIST :
           
            let joblist = [...action.jobs_list];
            joblist.forEach(element  => {

                var last_index_from ;
                var from_hr_min;
                if(element.from_time == null){

					last_index_from ="";
					from_hr_min =""
				}else{
					last_index_from  = element.from_time.lastIndexOf(":");
				     from_hr_min =  element.from_time.substring(0,last_index_from)
				}
				var last_index_to ;
				var to_hr_min ;
				if(element.to_time == null){

					last_index_to = "";
					to_hr_min = "";
				}else{
					last_index_to  = element.to_time.lastIndexOf(":");
					to_hr_min = element.to_time.substring(0,last_index_to)
                }
                if(element.job_scope ==  null) {
                    element.job_scope = "";
                }
                if(element.clinic_requirement == null ){
                    element.clinic_requirement = "";
                }


                element.from_time = from_hr_min ;
                element.to_time = to_hr_min;
                Object.assign(element ,{coordinates :{latitude : parseFloat(element.latitude) , longitude : parseFloat(element.longitude), latitudeDelta: 0.23,longitudeDelta: 0.5,}} )

            });

            console.log("job list final",joblist);
           

            return {
                ...state,
                search_jobs_list:joblist,
                loading_status:false
            }

        case ActionTypes.APPLIED_JOB :
            let applied_jobs = [...action.applied_jobs];

        return {
            ...state,
            applied_jobs:applied_jobs

        }
        case ActionTypes.SUGGESTED_JOBS :
            let suggested_jobs = [...action.suggested_jobs];
            return{
                ...state,
                suggested_jobs : suggested_jobs,
            }
        case ActionTypes.CHANGED_STATUS_TO_APPLIED  :
            let job_list = [...state.search_jobs_list];
            job_list.map(element => {
                if(element.id == action.job_id){
                    element.application_status = 1;
                }
            });
            return {
                ...state,
                search_jobs_list : job_list
            }

        case ActionTypes.RESPONSE_ERROR :

            return{
                ...state,
                loading_status:false,
            }

        case ActionTypes.SHOW_LOADING :
            return {
                ...state,
                loading_status:true
            }



        default :
            return state ;
    }
} 