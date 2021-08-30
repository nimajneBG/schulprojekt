// Attribution Text for the Map
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 

const geoJSONPath = './map.geo.json'

// Main function
document.addEventListener('alpine:init', () => {

    // Map
    Alpine.data('map', () => ({
        currentTab: 'usa',  // Default Country selected after loading the page are the USA
        async init() {
            
            // Create empty map
            this.map = L.map('map').setView([0, 0], 1)
            
            // Add simple content
            const mapTiles = L.tileLayer(
                'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?',
                {
                    attribution,
                    minZoom: 1,
                    maxZoom: 4
                }
            )
            mapTiles.addTo(this.map)

            // Add overlay
             
            // Load the overlay
            const geoJSON = await fetch(geoJSONPath)
                .then(r => {
                    if (!r.ok)
                        throw new Error(`Not able to load overlay (Status: ${r.status})`)
                    
                    return r.json()
                })

            L.geoJSON(geoJSON, {
                onEachFeature: (feature, layer) => {
                    // Handle click on the overlay
                    layer.on('click', () => { 
                        this.currentTab = feature.properties.my_name
                    })
                }
            }).addTo(this.map)
        }
    }))

    // Nav sidebar
    Alpine.data('nav', () => ({
        headings: undefined,
        visibleHeadingId: null,
        init() {
            this.headings = document.querySelectorAll('article')

            this.handleScroll()
        },
        handleScroll() {
            let relativeTop = window.innerHeight / 2

            let headingsByDistanceFromTop = {}

            // Populate an object of headings by their distance from our
            // imaginary lines as the keys.
            this.headings.forEach(heading => {
                headingsByDistanceFromTop[
                    heading.getBoundingClientRect().top - relativeTop
                ] = heading
            })

            // Grab the first one that is above that line.
            let closestNegativeTop = Math.max(
                ...Object.keys(headingsByDistanceFromTop).filter(top => top < 0)
            )

            // If we couldn't find one, don't highlight anything.
            if (closestNegativeTop >= 0 || [Infinity, NaN, -Infinity].includes(closestNegativeTop)) 
                return this.visibleHeadingId = null

            // Otherwise, highlight that heading.
            this.visibleHeadingId = headingsByDistanceFromTop[closestNegativeTop].id
        }
    }))
})
