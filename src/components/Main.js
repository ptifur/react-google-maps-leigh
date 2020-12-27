import { useState } from 'react'
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { formatRelative } from 'date-fns'
import '@reach/combobox/styles.css'
import mapStyle from './mapStyle'

const Main = () => {

    // this is avoid rerenders
    const libraries = ["places"]
    const mapContainerStyle = {
        width: '100%',
        height: '65vh'
    }
    const center = {
        lat: 43.65,
        lng: -79.38
    }
    const options = {
        styles: mapStyle,
        disableDefaultUI: true,
        zoomControl: true
    }

    // init services
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries
    })

    // position when click
    const [markers, setMarkers] = useState([])

    if (loadError) return "Error loading maps"
    if (!isLoaded) return "Loading maps"

    return (
        <div className='wrapper'>
            <h1>Bears{" "} <span role="img" aria-label="tent">⛺</span></h1>
            <GoogleMap 
                mapContainerStyle={mapContainerStyle} 
                zoom={11} 
                center={center}
                options={options}
                onClick={(event) => {
                    setMarkers(current => [...current, {
                        lat: event.latLng.lat(),
                        lng: event.latLng.lng(),
                        time: new Date()
                    }])
                }}
            >
                {markers.map(marker => 
                    <Marker 
                        key={marker.time.toISOString()} 
                        position={{ lat: marker.lat, lng: marker.lng }} 
                    />
                )}
            </GoogleMap>
        </div>
    )
}

export default Main