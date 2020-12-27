import { useState, useCallback, useRef } from 'react'
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { formatRelative } from 'date-fns'
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete'
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox'
import '@reach/combobox/styles.css'
import mapStyle from './mapStyle'

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
    
const Main = () => {

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

    const panTo = useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng })
        mapRef.current.setZoom(14)
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

            <Search panTo={panTo} />
        </div>
    )
}

export default Main

// Google Places autocomplete hook
const Search = ({ panTo }) => {
    const { ready, value, suggestions: {status, data}, setValue, clearSuggestions } = usePlacesAutocomplete({
        requestOptions: {
            location: { lat: () => 43.65, lng: () => -79.38 },
            radius: 200 * 1000
        }
    })

    return (
        <div className="search">
            <Combobox 
                onSelect={ async (address) => {
                    // clear suggestions
                    setValue(address, false)
                    clearSuggestions()
                    try {
                        const results = await getGeocode({address})
                        const { lat, lng } = await getLatLng(results[0])
                        panTo({ lat, lng })
                    } catch(error) {
                        console.log('error!')
                    }

                    // console.log(address)
                }}
            >
                <ComboboxInput 
                    value={value} 
                    onChange={(e) => {
                        setValue(e.target.value)
                    }}
                    disabled={!ready}
                    placeholder="Enter an address"
                />
                <ComboboxPopover>
                    {status === "OK" && data.map(({id, description}) => 
                        <ComboboxOption key={id} value={description} />
                    )}
                </ComboboxPopover>
            </Combobox>
        </div>
    )
}