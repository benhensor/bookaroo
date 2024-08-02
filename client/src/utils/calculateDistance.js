const calcDistance = (listingLatitude, listingLongitude) => {
  if (userLatitude === null || userLongitude === null) {
    // User's latitude and longitude not available
    return null;
  }

  const earthRadius = 6371; // Radius of the earth in km
  const latitudeDifference = deg2rad(
    listingLatitude - userLatitude
  ); // deg2rad below
  const longitudeDifference = deg2rad(
    listingLongitude - userLongitude
  );

  const a =
    Math.sin(latitudeDifference / 2) *
      Math.sin(latitudeDifference / 2) +
    Math.cos(deg2rad(userLatitude)) *
      Math.cos(deg2rad(listingLatitude)) *
      Math.sin(longitudeDifference / 2) *
      Math.sin(longitudeDifference / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c; // Distance in km

  return distance;
}

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};