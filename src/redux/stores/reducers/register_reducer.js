import  * as ActionTypes from '../../type';
import AsyncStorage from '@react-native-community/async-storage';


const initialState = {

    user:{},
    loading_status:false,
    message:"",
    register_id:"",
    register_user_name:"",
    profession_categories:[],
    grades:[],
    specialities:[],
    user:{},
    user_id:"",
    device_token:null,
    states_list:[],
    cities_list:[],

}



export default  (state = initialState ,action) => {

    switch(action.type){

        case ActionTypes.HIDE_SPINNER :
            return {
                ...state,
                loading_status:false
            }
        case ActionTypes.SHOW_LOADING :
            return {
                ...state,
                loading_status:true
            }

        case ActionTypes.REGISTER_USER_RESPONSE :
            let temp_id = action.register_id;
            let register_user_name = action.register_user_name
            return {
                ...state,
                loading_status : false,
                register_id:temp_id,
                register_user_name: register_user_name
               
            }
        case ActionTypes.JOB_CATEGORIES :

            let profession_categories = [...state.profession_categories];
            profession_categories = [...action.profession_categories];

            return {
                ...state,
                profession_categories:profession_categories,
                loading_status:false
            }
        case ActionTypes.FETCH_GRADES :

            let fetch_grades = [...state.grades];
            fetch_grades = [...action.grades];
            console.log("gscvfgvcg")

            return {
                ...state,
                grades:fetch_grades,
                loading_status:false
            }

        case ActionTypes.FETCH_SPECIALITY :

            let fetch_specialities = [...state.specialities];
            fetch_specialities = [...action.specialities];
            
            return {
                ...state,
                specialities:fetch_specialities,
                loading_status:false
            }
        case ActionTypes.CREATE_PROFILE :
            {
            let user_data = action.result_user;
            let exist_user_data = {...state.user};
           // await AsyncStorage.setItem('user_id',JSON.stringify(user_data.id));
           let first_name,last_name , email , address, degree , mobile ,hourly_rate, weekly_rate, monthly_rate,daily_rate, grade , longitude,
           latitude ,city_id,state_id,location_preference,preference_one_city,preference_one_state,preference_two_city,preference_two_state,
           experience,userdoc_1,userdoc_2,userdoc_3,userdoc_4,user_image ,license,ic_no, current_work,wallet_balance,jobs_remaining,
           email_verify,description,document_upload_status,profile_upload_status,mmc_no,apc_no,street_1,street_2,post_code;
           if(user_data.first_name !== null){
            first_name = user_data.first_name;
            }else{
                first_name = "";
            }
            if(user_data.last_name !== null){
                last_name = user_data.last_name;
            }else{
                last_name = "";
            }

           if(user_data.email !== null){
                email =  user_data.email;
           }else{
               email = "";
           }

           if(user_data.address !==  null ){
               address = user_data.address;
           }else{
               address = "";
           }
           if(user_data.degree !== null ){
               degree =user_data.degree;
           }else{
               degree ="";
           }
            if(user_data.mobile !== null){
                mobile = user_data.mobile ;
            }else{
                mobile = "";
            }
            if(user_data.hourly_rate !== null){
                hourly_rate = user_data.hourly_rate ;
            }else{
                hourly_rate = "";
            }

            if(user_data.hourly_rate !== null){
                monthly_rate = user_data.hourly_rate ;
            }else{
                monthly_rate = "";
            }

            if(user_data.weekly_rate !== null){
                weekly_rate = user_data.weekly_rate ;
            }else{
                weekly_rate = "";
            }

            if(user_data.daily_rate !==  null){
                daily_rate = user_data.daily_rate ;
            }else{
                daily_rate ="";
            }

            if(user_data.grade !== null ){
                grade = user_data.grade ;
            }else{
                grade = "";
            }

            if(user_data.latitude !== null){
                latitude = user_data.latitude;
            }else{
                latitude = "";
            }

            if(user_data.longitude !== null){
                longitude = user_data.longitude;
            }else{
                longitude ="";
            } 
            
            if(user_data.city_id !== null){
                city_id = user_data.city_id;
            }else{
                city_id = "";
            }

            if(user_data.state_id !== null) {
                state_id = user_data.state_id;
            }else{
                state_id = "";
            }

            if(user_data.location_preference !== null){
                location_preference = user_data.location_preference ;
            }else{
                location_preference = "";
            }

            if( user_data.preference_one_city !== null){
                preference_one_city =  user_data.preference_one_city;
            }else{
                preference_one_city = "";
            }

            if(user_data.preference_one_state !== null ){
                preference_one_state = user_data.preference_one_state;
            }else{
                preference_one_state ="";
            }

            if(user_data.preference_two_city !== null){
                preference_two_city =user_data.preference_two_city ;
            }else{
                preference_two_city = "";
            }

            if(user_data.preference_two_state !== null){
                preference_two_state = user_data.preference_two_state
            }else{
                preference_two_state = "";
            }

            if(user_data.experience !== null){
               experience =  user_data.experience;
            }else{
                experience = "";
            }

            if(user_data.userdoc_1 !== null ){
                userdoc_1 = user_data.userdoc_1;
            }else{
                userdoc_1 = "";
            }
            if(user_data.userdoc_2 !==  null){
                userdoc_2 = user_data.userdoc_2;
            }else{
                userdoc_2 = "";
            }

            if(user_data.userdoc_3 !== null){
                userdoc_3 = user_data.userdoc_3 ;
            }else{
                userdoc_3 = "";
            }

            if(user_data.userdoc_4 !== null){
                userdoc_4 = user_data.userdoc_4;
            }else{
                userdoc_4 = "";
            }

            if(user_data.user_image !==  null){
                user_image = user_data.user_image ;
            }else{
                user_image = "";
            }

            if( user_data.license !== null){
                license =  user_data.license;
            }else{
                license = "";
            }

            if(user_data.ic_no !== null){
                ic_no =user_data.ic_no;
            }else{
                ic_no = "";
            }

            if(user_data.current_work !== null){
                current_work = user_data.current_work;
            }else{
                current_work = "";
            }

            if(user_data.wallet_balance !== null){
                wallet_balance =user_data.wallet_balance ;
            }else{
                wallet_balance = "";
            }
            if(user_data.jobs_remaining !== null){
                jobs_remaining = user_data.jobs_remaining ;
            }else{
                jobs_remaining = "";
            }

            if(user_data.email_verify !== null){
                email_verify = user_data.email_verify ;
            }else{
                email_verify = "";
            }

            if(user_data.description !== null ){
                description = user_data.description;
            }else{
                description = "";
            }

            if(user_data.street_1 !== null ){
                street_1 = user_data.street_1;
            }else{
                street_1 = "";
            }
            if(user_data.street_2 !== null ){
                street_2 = user_data.street_2;
            }else{
                street_2 = "";
            }
            if(user_data.post_code !== null ){
                post_code = user_data.post_code;
            }else{
                post_code = "";
            }
            if(user_data.mmc_no !== null ){
                mmc_no = user_data.mmc_no;
            }else{
                mmc_no = "";
            }

            if(user_data.apc_no !== null ){
                apc_no = user_data.apc_no;
            }else{
                apc_no = "";
            }

            if(user_data.document_upload_status !== null ){
                document_upload_status = user_data.document_update_status;
            }else{
                document_upload_status = "";
            }
            if(user_data.profile_upload_status !== null ){
                profile_upload_status = user_data.profile_update_status;
            }else{
                profile_upload_status = "";
            }

            
            Object.assign(exist_user_data ,{
                
                id : user_data.id,
                first_name : first_name,
                last_name :last_name,
                email :email,
                address :address,
                degree : degree,
                mobile :mobile,
                profile_id : user_data.profession.id,
                speciality_id : user_data.speciality.id,
                hourly_rate: hourly_rate,
                monthly_rate :monthly_rate,
                weekly_rate : weekly_rate,
                daily_rate : daily_rate,
                grade : grade,
                latitude : latitude,
                longitude : longitude,
                city_id : city_id,
                country_id : 132,
                state_id : state_id,
                location_preference: location_preference,
                preference_one_city : preference_one_city,
                preference_one_state : preference_one_state,
                preference_two_city : preference_two_city,
                preference_two_state : preference_two_state,
                experience : experience,
                userdoc_1 : userdoc_1,
                userdoc_2 :userdoc_2,
                userdoc_3 : userdoc_3,
                userdoc_4 : userdoc_4,
                user_image :user_image ,
                roles_id : user_data.roles_id,
                license :license,
                ic_no : ic_no,
                apc_no :apc_no,
                mmc_no:mmc_no,
                post_code:post_code,
                street_1:street_1,
                street_2 :street_2,
                current_work : current_work,
                wallet_balance:wallet_balance ,
                jobs_remaining : jobs_remaining,
                email_verify : email_verify,
                verify : user_data.verify,
                status : user_data.status,
                description : description,
                document_upload_status : document_upload_status,
                profile_upload_status : profile_upload_status
            });
            console.log("user data exist", exist_user_data);
            return {
                ...state,
                loading_status:false,
                user:{...exist_user_data}
            }
            }

            case ActionTypes.UPDATE_PROFILE :
                {
                let user_data1 = action.result_user;
                let exist_user_data1 = {...state.user};
               // await AsyncStorage.setItem('user_id',JSON.stringify(user_data.id));
               let first_name,last_name , email , address, degree , mobile ,hourly_rate, weekly_rate, monthly_rate,daily_rate, grade , longitude,
               latitude ,city_id,state_id,location_preference,preference_one_city,preference_one_state,preference_two_city,preference_two_state,
               experience,userdoc_1,userdoc_2,userdoc_3,userdoc_4,user_image ,license,ic_no, current_work,wallet_balance,jobs_remaining,
               email_verify,description,document_upload_status,profile_upload_status,mmc_no,apc_no,street_1,street_2,post_code;

               if(user_data1.first_name !== null){
                   first_name = user_data1.first_name;
               }else{
                   first_name = "";
               }
               if(user_data1.last_name !== null){
                    last_name = user_data1.last_name;
                }else{
                    last_name = "";
                }
 
               if(user_data1.email !== null){
                    email =  user_data1.email;
               }else{
                   email = "";
               }
    
               if(user_data1.address !==  null ){
                   address = user_data1.address;
               }else{
                   address = "";
               }
               if(user_data1.degree !== null ){
                   degree =user_data1.degree;
               }else{
                   degree ="";
               }
                if(user_data1.mobile !== null){
                    mobile = user_data1.mobile ;
                }else{
                    mobile = "";
                }
                if(user_data1.hourly_rate !== null){
                    hourly_rate = user_data1.hourly_rate ;
                }else{
                    hourly_rate = "";
                }
    
                if(user_data1.monthly_rate !== null){
                    monthly_rate = user_data1.monthly_rate ;
                }else{
                    monthly_rate = "";
                }
    
                if(user_data1.weekly_rate !== null){
                    weekly_rate = user_data1.weekly_rate ;
                }else{
                    weekly_rate = "";
                }
    
                if(user_data1.daily_rate !==  null){
                    daily_rate = user_data1.daily_rate ;
                }else{
                    daily_rate ="";
                }
    
                if(user_data1.grade !== null ){
                    grade = user_data1.grade ;
                }else{
                    grade = "";
                }
    
                if(user_data1.latitude !== null){
                    latitude = user_data1.latitude;
                }else{
                    latitude = "";
                }
    
                if(user_data1.longitude !== null){
                    longitude = user_data1.longitude;
                }else{
                    longitude ="";
                } 
                
                if(user_data1.city_id !== null){
                    city_id = user_data1.city_id;
                }else{
                    city_id = "";
                }
    
                if(user_data1.state_id !== null) {
                    state_id = user_data1.state_id;
                }else{
                    state_id = "";
                }
    
                if(user_data1.location_preference !== null){
                    location_preference = user_data1.location_preference ;
                }else{
                    location_preference = "";
                }
    
                if( user_data1.preference_one_city !== null){
                    preference_one_city =  user_data1.preference_one_city;
                }else{
                    preference_one_city = "";
                }
    
                if(user_data1.preference_one_state !== null ){
                    preference_one_state = user_data1.preference_one_state;
                }else{
                    preference_one_state ="";
                }
    
                if(user_data1.preference_two_city !== null){
                    preference_two_city =user_data1.preference_two_city ;
                }else{
                    preference_two_city = "";
                }
    
                if(user_data1.preference_two_state !== null){
                    preference_two_state = user_data1.preference_two_state
                }else{
                    preference_two_state = "";
                }
    
                if(user_data1.experience !== null){
                   experience =  user_data1.experience;
                }else{
                    experience = "";
                }
    
                if(user_data1.userdoc_1 !== null ){
                    userdoc_1 = user_data1.userdoc_1;
                }else{
                    userdoc_1 = "";
                }
                if(user_data1.userdoc_2 !==  null){
                    userdoc_2 = user_data1.userdoc_2;
                }else{
                    userdoc_2 = "";
                }
    
                if(user_data1.userdoc_3 !== null){
                    userdoc_3 = user_data1.userdoc_3 ;
                }else{
                    userdoc_3 = "";
                }
    
                if(user_data1.userdoc_4 !== null){
                    userdoc_4 = user_data1.userdoc_4;
                }else{
                    userdoc_4 = "";
                }
    
                if(user_data1.user_image !==  null){
                    user_image = user_data1.user_image ;
                }else{
                    user_image = "";
                }
    
                if( user_data1.license !== null){
                    license =  user_data1.license;
                }else{
                    license = "";
                }
    
                if(user_data1.ic_no !== null){
                    ic_no =user_data1.ic_no;
                }else{
                    ic_no = "";
                }

                if(user_data1.street_1 !== null ){
                    street_1 = user_data1.street_1;
                }else{
                    street_1 = "";
                }
                if(user_data1.street_2 !== null ){
                    street_2 = user_data1.street_2;
                }else{
                    street_2 = "";
                }
                if(user_data1.post_code !== null ){
                    post_code = user_data1.post_code;
                }else{
                    post_code = "";
                }
                if(user_data1.mmc_no !== null ){
                    mmc_no = user_data1.mmc_no;
                }else{
                    mmc_no = "";
                }
    
                if(user_data1.apc_no !== null ){
                    apc_no = user_data1.apc_no;
                }else{
                    apc_no = "";
                }
    
                if(user_data1.current_work !== null){
                    current_work = user_data1.current_work;
                }else{
                    current_work = "";
                }
    
                if(user_data1.wallet_balance !== null){
                    wallet_balance =user_data1.wallet_balance ;
                }else{
                    wallet_balance = 0;
                }
                if(user_data1.jobs_remaining !== null){
                    jobs_remaining = user_data1.jobs_remaining ;
                }else{
                    jobs_remaining = 0;
                }
    
                if(user_data1.email_verify !== null){
                    email_verify = user_data1.email_verify ;
                }else{
                    email_verify = "";
                }
    
                if(user_data1.description !== null ){
                    description = user_data1.description;
                }else{
                    description = "";
                }
                if(user_data1.document_upload_status !== null ){
                    document_upload_status = user_data1.document_update_status;
                }else{
                    document_upload_status = "";
                }
                if(user_data1.profile_upload_status !== null ){
                    profile_upload_status = user_data1.profile_update_status;
                }else{
                    profile_upload_status = "";
                }

                console.log("user datat redux",user_data1)
                Object.assign(exist_user_data1 ,{
                    ...exist_user_data1,
                    id : user_data1.id,
                    first_name : first_name,
                    last_name : last_name,
                    email : email,
                    address :address,
                    degree : degree,
                    mobile : mobile,
                    profile_id : user_data1.profession,
                    speciality_id :user_data1.speciality,
                    hourly_rate: hourly_rate,
                    monthly_rate : monthly_rate,
                    weekly_rate : weekly_rate,
                    daily_rate : daily_rate,
                    grade : grade,
                    latitude : latitude,
                    longitude : longitude,
                    city_id : city_id,
                    country_id : 132,
                    state_id : state_id,
                    location_preference: location_preference,
                    preference_one_city : preference_one_city,
                    preference_one_state : preference_one_state,
                    preference_two_city : preference_two_city,
                    preference_two_state : preference_two_state,
                    experience : experience,
                    userdoc_1 : userdoc_1,
                    userdoc_2 : userdoc_2,
                    userdoc_3 : userdoc_3,
                    userdoc_4 : userdoc_4,
                    user_image : user_image,
                    roles_id : user_data1.roles_id,
                    license : license,
                    ic_no : ic_no,
                    apc_no :apc_no,
                    mmc_no:mmc_no,
                    post_code:post_code,
                    street_1:street_1,
                    street_2 :street_2,
                    current_work : current_work,
                    wallet_balance: wallet_balance,
                    jobs_remaining : jobs_remaining,
                    email_verify : email_verify,
                    verify : user_data1.verify,
                    status : user_data1.status,
                    description : description,
                    // document_upload_status : document_upload_status,
                    // profile_upload_status : profile_upload_status
            });
            //console.log("user data exist", exist_user_data1);
            return {
                ...state,
                loading_status:false,
                user:{...exist_user_data1}
            }
            }
        case ActionTypes.UPDATE_JOBS_REMAINING :
            { let user_ex = {...state.user};
                user_ex.jobs_remaining = action.jobs_remaining;
                user_ex.wallet_balance = action.wallet_balance;
            
                return {
                    ...state,
                    user :{...user_ex}
                }}
        case ActionTypes.UPDATE_WALLET_BALANCE :
            { let user_ex = {...state.user};
                let last_amt =  user_ex.wallet_balance;
                user_ex.wallet_balance = parseFloat(last_amt)  + parseFloat(action.wallet_balance);
            
                return {
                    ...state,
                    user :{...user_ex}
                }}

        case ActionTypes.PROFILE_PIC_UPLOADED :

            
            let user =  {...state.user};
            let new_user_pic =  action.user_pic;
            if("user_image" in user){

                user.user_image = new_user_pic;
               

            }else{
                Object.assign(user,{user_image : new_user_pic});
            }

            console.log("user pic reducer", user);
            return {
                ...state,
                loading_status:false,
                user:user
            }

        case ActionTypes.GET_STATES :
           
            let states = [...action.states];
            return {
                ...state,
                loading_status:false,
                states_list : states
            }
        case ActionTypes.GET_CITIES :
            let cities = [...action.cities];
            console.log("action city",cities);
            return {
                ...state,
                cities_list : cities,
                loading_status:false,
            }
        
        case ActionTypes.UPLOAD_DOCUMENTS :

            return{
                ...state,
                loading_status:false,
            }
        
       
        case ActionTypes.RESPONSE_ERROR :

            return{
                ...state,
                loading_status:false,
            }
        case ActionTypes.LOGOUT_USER:

            AsyncStorage.removeItem('persist:STORE_USER_ID_GLOBALLY')
                
            return {
                ...state,
                user_id:'',
                user:{}
            }
                

        case ActionTypes.DEVICE_TOKEN :
            return {
                ...state,
                device_token : action.token
            }

        default :
            return state;
    }


}