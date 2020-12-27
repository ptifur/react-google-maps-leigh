# Google Maps and Google Places in React by Leigh

`@react-google-maps/api`
`{ formatRelative }`

## Style

https://snazzymaps.com

## Click on the map 

...and save the location to state

### Center resets when putting the marker

## Update marker icon

Avoid firing the function on every render of application

`usecallback`

## Info window when click

`formatRelative` time in relation to now

`onCloseClick` to set selected to `null`

## Google Places Search

That's kind of too complicated. I will just repeat from tutorial

`use-places-autocomplete`

`@reach/combobox`

`Combobox Popover` for search results

Short circuit trick map through suggestions

### getGeocode

Get suggested result, extract location

Pass `panTo()` as a prop to `Search` component

### setValue

to clear the suggestions drop down

## User geolocation

43'50