import {LatLng} from "leaflet";
import PlaceFeature from "./PlaceFeature";
import Gemeentes from "./geometries/Gemeentes";
import {PlaceMode} from "./App";
import Woonplaatsen from "./geometries/Woonplaatsen";
import WereldSteden from "./geometries/WereldSteden";


class PlaceGenerator {
    private readonly features: Array<{
        name: string,
        lon: number,
        lat: number
    }>;
    private placesDone: Array<string> = [];

    constructor(placeMode: PlaceMode) {
        switch (placeMode) {
            case PlaceMode.Gemeentes:
                this.features = Gemeentes;
                break;
            case PlaceMode.Plaatsen:
                this.features = Woonplaatsen;
                break;
            case PlaceMode.Wereldsteden:
                this.features = WereldSteden;
                break;
        }
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

export default PlaceGenerator