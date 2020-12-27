import { useState, useCallback, useRef } from 'react'
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

    // selected marker to display info
    const [selected, setSelected] = useState(null)

    const onMapClick = useCallback((event) => {
        setMarkers(current => [...current, {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
            time: new Date()
        }])
    }, [])

    // map instance for searching
    const mapRef = useRef()

    // callback when the map loads to assign it to useRef without causing re-renders
    const onMapLoad = useCallback((map) => {
        mapRef.current = map
    }, [])

    if (loadError) return "Error loading maps"
    if (!isLoaded) return "Loading maps"

    return (
        <div className='wrapper'>
            <h1>Bears{" "} <span role="img" aria-label="tent">⛺</span></h1>
            <GoogleMap 
                mapContainerStyle={mapContainerStyle} 
                zoom={12} 
                center={center}
                options={options}
                onClick={onMapClick}
                onLoad={onMapLoad}
            >
                {markers.map(marker => 
                    <Marker 
                        key={marker.time.toISOString()}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        icon={{
                            url: '/bear.svg',
                            scaledSize: new window.google.maps.Size(30, 30),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15)
                        }}
                        onClick={() => {
                            setSelected(marker)
                        }}
                    />
                )}

                {selected ? (
                    <InfoWindow 
                        position={{ lat: selected.lat, lng: selected.lng }} 
                        onCloseClick={() => {
                            setSelected(null)
                        }}
                    >
                        <div>
                            <h2>Bear spotted</h2>
                            <p>Spotted {formatRelative(selected.time, new Date())}</p>
                        </div>
                    </InfoWindow>) : null}
            </GoogleMap>
        </div>
    )
}

export default Main