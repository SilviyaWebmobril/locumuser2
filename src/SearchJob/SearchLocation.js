import React ,{ useState, useEffect } from 'react' ;
import {View, Text, TouchableOpacity,StyleSheet,PermissionsAndroid, Platform} from 'react-native';
import { useSelector } from 'react-redux';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import {showMessage} from '../Globals/Globals';


const SearchLocation = (props) => {

    const jobs_coordinates =  useSelector(state => state.search_job.search_jobs_list);
    let  region1 = {
        latitude: 3.148561,
        longitude: 101.652778,
        latitudeDelta: 0.2,
        longitudeDelta: 0.9
      };

      const LATITUDE_DELTA = 0.1;
      const LONGITUDE_DELTA = 0.1;

      const [region ,setRegion] = useState(region1);

     

      const getCurrentPosition = async() => {
        try {
            await Geolocation.getCurrentPosition(
            (position) => {
              const region = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              };
              setRegion(region);
            },
             (error) => {
              //TODO: better design
              showMessage(1,'To get the jobs from your current location , please allow access to location services from Settings.', 'Location', true, false);
              console.log("error on map",error);
             
            },
            {enableHighAccuracy: false, timeout: 20000, maximumAge: 0}
          );
        } catch(e) {
          alert(e.message || "");
        }
      };  

      useEffect(() => {

        getCurrentPosition();
       
         
      }, []);

      const onNext =  () => {

            props.navigation.navigate('JobList');
      }

    return(
        <View style={{ flex:1 }}>

            <MapView
              provider={PROVIDER_GOOGLE}
              style={{
                width:"100%",
                height:"100%"
              }}
              
              minZoomLevel={11}
              initialRegion={region}
              showsUserLocation={true}
              //followUserLocation={true}
            
            >

              {jobs_coordinates.map((marker, index) => (
                <Marker
                  coordinate={marker.coordinates}
                  image={require('../assets/clinic/map-pin.png')}
                  title={marker.job_location}
                  key={index}
                />
              ))}

            </MapView>

            <TouchableOpacity
              onPress={onNext}
              style={styles.submitButton}>
              <Text style={styles.submitText}>Next</Text>
            </TouchableOpacity>

          </View>

     
    )

}



let styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
  
    },
    submitButton: {
      width: '80%',
      paddingTop: 10,
      paddingBottom: 10,
      backgroundColor: '#4C74E6',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#fff',
      alignSelf: 'flex-end',
      position: 'absolute',
      marginBottom: 10,
      bottom: 65,
      right: 35
      //right:(Dimensions.get('window').width * 50) / 100
  
    },
    submitText: {
      fontFamily:'roboto-bold',
      color: 'white',
      textAlign: 'center',
      paddingLeft: 10,
      paddingRight: 10,
      fontSize: 20,
    },
  
  })
  

export default SearchLocation;