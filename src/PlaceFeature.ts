import {LatLng} from "leaflet";

class PlaceFeature {
    name: string;
    latlng: LatLng;


    constructor(name: string, latlng: LatLng) {
        this.name = name;
        this.latlng = latlng;
    }

    distanceTo(other: LatLng): number {
        function toRad(x: number) {
            return x * Math.PI / 180;
        }

        const lon1 = this.latlng.lng;
        const lat1 = this.latlng.lat;

        const lon2 = other.lng;
        const lat2 = other.lat;

        const R = 6371; // km

        const x1 = lat2 - lat1;
        const dLat = toRad(x1);
        const x2 = lon2 - lon1;
        const dLon = toRad(x2);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}

export default PlaceFeature