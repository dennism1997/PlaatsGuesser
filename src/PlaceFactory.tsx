import {LatLng} from "leaflet";
import PlaceFeature from "./PlaceFeature";
import Gemeentes from "./Gemeentes";


class PlaceFactory {
    private readonly features: Array<{
        name: string,
        lon: number,
        lat: number
    }>;
    private placesDone: Array<string> = [];

    constructor() {
        this.features = Gemeentes
    }

    getNext(): PlaceFeature {
        let rand = Math.floor(Math.random() * this.features.length);
        let feature = this.features[rand];

        while(this.placesDone.includes(feature.name)) {
            rand = Math.floor(Math.random() * this.features.length);
            feature = this.features[rand];
        }
        this.placesDone.push(feature.name);
        return new PlaceFeature(
            feature.name,
            new LatLng(feature.lat, feature.lon)
        )
    }
}

export default PlaceFactory