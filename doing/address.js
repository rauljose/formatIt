/*
<form id="place-form">
  <label for="address">Address:</label>
  <input type="text" id="address" name="address" required>
  <button type="submit">Register Place</button>
</form>
<div id="address-display"></div>
<div id="coordinates-display"></div>
<div id="map"></div>

The Geolocation API also offers a watchPosition method for continuously monitoring the user's location changes.
 */
const addressInput = document.getElementById('address');
const MIN_CHARS_FOR_AUTOCOMPLETE = 3;  // Minimum characters for suggestions
const debounceDelay = 500; // Debounce delay in milliseconds

// Cache to store address and geolocation
const geocodeCache = {};

function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

const autocompleteService = new google.maps.places.Autocomplete(addressInput);

const debouncedAutocomplete = debounce((text) => {
    if (text.length >= MIN_CHARS_FOR_AUTOCOMPLETE) {
        // Check cache for geolocation
        if (geocodeCache[text]) {
            // Use cached geolocation (minimize API calls)
            const { address, geolocation } = geocodeCache[text];
            displayAddress(address);
            displayCoordinates(geolocation);
            initMap(geolocation.lat(), geolocation.lng());
        } else {
            // Geocode API call if not cached
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address: text }, (results, status) => {
                if (status === 'OK') {
                    const geolocation = results[0].geometry.location;
                    const address = results[0].formatted_address;
                    geocodeCache[text] = { address, geolocation };
                    displayAddress(address);
                    displayCoordinates(geolocation);
                    initMap(geolocation.lat(), geolocation.lng());
                } else {
                    // Handle geocoding errors
                }
            });
        }
    }
}, debounceDelay);

addressInput.addEventListener('keyup', (event) => {
    const text = event.target.value;
    debouncedAutocomplete(text);
});

placeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    // Access address and potentially geolocation from form or cache
    // ... submit place registration logic using Firebase
});

function displayAddress(address) {
    const addressDisplayElement = document.getElementById('address-display');
    addressDisplayElement.textContent = address;
}

function displayCoordinates(geolocation) {
    const coordinatesDisplayElement = document.getElementById('coordinates-display');
    coordinatesDisplayElement.textContent = `Latitude: ${geolocation.lat()}, Longitude: ${geolocation.lng()}`;
}

function initMap(latitude, longitude) {
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15, // Adjust zoom level as needed
        center: { lat: latitude, lng: longitude }
    });

    const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map
    });
}

