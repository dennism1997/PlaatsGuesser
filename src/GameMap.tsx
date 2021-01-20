import React from "react";
import L, {LatLng, LeafletMouseEvent} from "leaflet";
import NederlandGeometry from "./geometries/NederlandGeometry";
import PlaceFeature from "./PlaceFeature";
import {PlaceMode} from "./App";
import WereldGeometry from "./geometries/WereldGeometry";

interface Props {
    makeGuess: (e: LeafletMouseEvent) => void,
    placeMode: PlaceMode
}

interface State {
    map?: L.Map,
    guessLayer?: L.LayerGroup,
}

let lastClick = Date.now();

class GameMap extends React.Component<Props, State> {

    constructor(props: Readonly<Props> | Props) {
        super(props);
        this.state = {
            map: undefined,
            guessLayer: undefined
        };
    }

    componentDidMount(): void {
        if (this.state.map == null) {
            let map;
            let geometry;
            switch (this.props.placeMode) {
                case PlaceMode.Gemeentes:
                case PlaceMode.Plaatsen:
                    geometry = NederlandGeometry;
                    map = L.map('map',
                        {
                            zoomControl: false,
                            dragging: false,
                            attributionControl: false,
                            doubleClickZoom: false,
                            touchZoom: false,
                            boxZoom: false,
                            scrollWheelZoom: false,
                            zoomSnap: 0.1
                        }).setView([52.25, 5.3], 8).fitBounds([
                        [50.684522, 3.209338],
                        [53.674163, 7.241321]
                    ]);
                    break;
                case PlaceMode.Wereldsteden:
                    geometry = WereldGeometry;
                    map = L.map('map',
                        {
                            zoomControl: false,
                            dragging: true,
                            attributionControl: false,
                            doubleClickZoom: true,
                            scrollWheelZoom: true,
                            zoomSnap: 0.1,
                            maxBounds:[[-70, -200], [100, 200]],
                            maxBoundsViscosity: 0.5,
                            minZoom: 1.6,
                            maxZoom: 6
                        }).setView([52.25, 5.3], 1.9);
                    break;
            }

            let geoJson = L.geoJSON(geometry as any, {
                style: {
                    color: '#6d6d6d',
                    weight: 1,
                    fillColor: '#efefef',
                    fillOpacity: 1
                }
            }).addTo(map);

            geoJson.on({
                click: (e) => {
                    let now = Date.now();
                    if (now - lastClick < 300) {
                        e.originalEvent.stopImmediatePropagation();
                    } else {
                        lastClick = now;
                        this.props.makeGuess(e);
                    }
                }
            });

            let layerGroup = new L.LayerGroup([]);
            layerGroup.addTo(map);

            this.setState({
                map: map,
                guessLayer: layerGroup
            })
        }

        window.addEventListener("resize", () => {
            if (this.state.map !== undefined) {
                this.state.map.invalidateSize(true)
            }
        })

    }


    componentWillUnmount(): void {
        this.state.map?.remove();
    }

    private addMarker(latlng: LatLng, color: "red" | "green") {
        let circleMarker = new L.CircleMarker(latlng, {
            interactive: false,
            color: color,
            fillOpacity: 0.3,
            radius: 5,
        });
        circleMarker.addTo(this.state.guessLayer!);
    }

    public addGuess(correct: PlaceFeature, guess: LatLng) {
        this.addMarker(correct.latlng, "green");
        this.addMarker(guess, "red");
        L.polyline([correct.latlng, guess], {
            color: "grey",
            weight: 1,
            dashArray: "2 5",
            interactive: false,
        }).addTo(this.state.guessLayer!);
        L.tooltip({
            direction: 'center',
            permanent: true,
            opacity: 0.8,
            offset: [0, -15],
            className: 'placeLabel',
            interactive: false,
        })
            .setContent(correct.name)
            .setLatLng(correct.latlng)
            .addTo(this.state.guessLayer!);
    }

    public addGuesses(correct: PlaceFeature, guesses: Array<LatLng>, names: Array<string>, distances: Array<number>) {
        this.addMarker(correct.latlng, "green");
        guesses.forEach((guess, index) => {
            this.addMarker(guess, "red");
            L.polyline([correct.latlng, guess], {
                color: "grey",
                weight: 1,
                dashArray: "2 5",
                interactive: false,
            }).addTo(this.state.guessLayer!);
            L.tooltip({
                direction: 'center',
                permanent: true,
                opacity: 0.8,
                offset: [0, -15],
                className: 'placeLabel',
                interactive: false,
            })
                .setContent(`${names[index]}: ${Math.round(distances[index] * 10) / 10} km`)
                .setLatLng(guess)
                .addTo(this.state.guessLayer!);

        });
    }

    public clearGuesses() {
        this.state.guessLayer?.eachLayer(layer =>
            layer.remove()
        )
    }

    render() {
        return <div id={"map"}/>
    }
}

export default GameMap
