export const calcDistance = (userLat, userLon, listingLat, listingLon) => {
	if (userLat === null || userLon === null) {
		// User's latitude and longitude not available
		return null
	}

	const earthRadius = 6371 // Radius of the earth in km
	const latitudeDifference = deg2rad(listingLat - userLat) // deg2rad below
	const longitudeDifference = deg2rad(listingLon - userLon)

	const a =
		Math.sin(latitudeDifference / 2) * Math.sin(latitudeDifference / 2) +
		Math.cos(deg2rad(userLat)) *
			Math.cos(deg2rad(listingLat)) *
			Math.sin(longitudeDifference / 2) *
			Math.sin(longitudeDifference / 2)

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
	const distance = earthRadius * c // Distance in km

	return distance
}

const deg2rad = (deg) => {
	return deg * (Math.PI / 180)
}