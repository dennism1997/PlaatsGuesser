import {LatLng} from "leaflet";
import PlaceFeature from "./PlaceFeature";
import {PlaceMode} from "./App";
import loadGeometries from "./Utils";


class PlaceGenerator {
    private features?: Array<{
        name: string,
        lon: number,
        lat: number
    }>;
    private placesDone: Array<string> = [];
    private readonly placeMode: PlaceMode;

    constructor(placeMode: PlaceMode) {
        this.placeMode = placeMode;
    }

    async loadFeatures() {
        switch (this.placeMode) {
            case PlaceMode.Gemeentes: {
                this.features = await loadGeometries("gemeentes");
                break;
            }
            case PlaceMode.Plaatsen: {
                this.features = await loadGeometries("plaatsen");
                break;
            }
            case PlaceMode.Wereldsteden: {
                this.features = await loadGeometries("wereldsteden");
                break;
            }
        }
    }

    async getNext(): Promise<PlaceFeature> {
        if (!this.features) {
            await this.loadFeatures();
        }
        if (this.features) {
            let rand = Math.floor(Math.random() * this.features.length);
            let feature = this.features[rand];

            while (this.placesDone.includes(feature.name)) {
                rand = Math.floor(Math.random() * this.features.length);
                feature = this.features[rand];
            }
            this.placesDone.push(feature.name);
            return new PlaceFeature(
                feature.name,
                new LatLng(feature.lat, feature.lon)
            )
        }
        return Promise.reject("could not load json")
    }
}

export default PlaceGenerator