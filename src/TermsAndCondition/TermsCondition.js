import React ,{ useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet,ActivityIndicator} from 'react-native';
import { WebView } from 'react-native-webview';
import MyActivityIndicator from '../CustomUI/MyActivityIndicator';

const TermsAndCondition = (props) => {

    const [loading,setLoading] = useState(true);

    const hideSpinner = () =>{

        setLoading(false)
    }

    // if(loading){
    //     return (
    //         <MyActivityIndicator />
    //     )
    // }

    return(
      
        <View style={{flex:1}}>
            <WebView
                onLoad={hideSpinner}
                source={{ uri:'http://webmobril.org/dev/locum/api/api_pages?page_id=2'}}
                style={{ marginTop: 10 }}
                
            />
            {loading && (
                <View
                style={[
                StyleSheet.absoluteFill,
                { backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center' }
                ]}
                >
                    <ActivityIndicator
                        animating={true}
                        color='#4C74E6'
                        style={styles.indicator}
                        size="large"
                    />
                </View>
            )}
        </View>
    
    )
}


const styles = StyleSheet.create({
    indicator: {
        
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: 80
	}

});


export default TermsAndCondition ;