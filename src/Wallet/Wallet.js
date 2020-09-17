import React ,{useState, useEffect } from 'react';
import {View ,Text,ScrollView,FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {Card} from 'react-native-elements'
import {wallet_history} from '../redux/stores/actions/transaction_action';
import MyActivityIndicator from '../CustomUI/MyActivityIndicator';
import {checkuserAuthentication,logoutUser} from '../redux/stores/actions/auth_action';
import { StackActions, NavigationActions } from 'react-navigation';
import {showMessage} from '../Globals/Globals';
import HeaderComponent from '../CustomUI/HeaderComponent';

const Wallet = (props) => {

    const dispatch = useDispatch();
    const device_token  = useSelector(state => state.auth.device_token);
    const loading_status = useSelector(state => state.register.loading_status);
    const wallets = useSelector(state => state.transactions.wallet_history);
    const user_id  = useSelector(state => state.auth.user_id);


    useEffect(()=> {

        dispatch(checkuserAuthentication(user_id,device_token))
            .then(response => {

                if(response.data.error){
                    showMessage(0, 'Session Expired! Please Login.', 'Wallet', true, false);
                    dispatch(logoutUser());
                    props.navigation.navigate("Login")
                    const resetAction = StackActions.reset({
                        index: 0,
                        key: 'Login',
                        actions: [NavigationActions.navigate({ routeName: 'Login' })],
                    });
                    props.navigation.dispatch(resetAction);

                }else{
                    dispatch(wallet_history(user_id));
                }

            })
       

    },[]);

    if(loading_status) {
        return <MyActivityIndicator />
    }

    return(
        <>
        <HeaderComponent wallet={1} edit={0} />
        <ScrollView>
             <View style={{flex:1}}>

                <TouchableOpacity 
                onPress={()=>{ props.navigation.navigate("AddMoney")}}
                style={{justifyContent:'flex-end',alignItems:"flex-end",paddingTop:25,paddingLeft:20,paddingRight:20}}>
                    <Text style={{color:"#4C74E6",fontSize:15,fontFamily:'roboto-bold'}}>+ ADD MONEY</Text>
                </TouchableOpacity>

                <FlatList
                    style={{ marginBottom: 20, marginTop: 25 }}
                    data={wallets}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={()=>{
                        return(
                            <Text style={{alignSelf:"center",marginTop:40,fontFamily:"roboto-bold"}}>No Transaction Found.</Text>
                        )
                    }}
                    scrollEnabled={false}
                    renderItem={({ item }) =>

                        <TouchableOpacity>
                            <View>

                                <Card containerStyle={{ padding: 15, borderRadius: 10 }} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                        <Text style={{ fontFamily:'roboto-light', fontSize: 15, color: 'black', fontWeight: 'bold' }}>Date : {item.created_at.split(" ")[0]}</Text>


                                        <Text style={{ fontFamily:'roboto-light', color: '#4C74E6', fontSize: 15 }}>MYR {item.amt}</Text>
                                    </View>
                                </Card>
                            </View>
                        </TouchableOpacity>
                    }
                    keyExtractor={item => item.name}
                />



            </View>

        </ScrollView>
        </>
       
    )
} ;

const styles = StyleSheet.create({

    


})

export default Wallet;