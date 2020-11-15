import React, {RefObject} from "react";
import {LeafletMouseEvent} from "leaflet";
import GameMap from "./GameMap";
import PlaceFactory from "./PlaceFactory";
import PlaceFeature from "./PlaceFeature";

interface Props {
    showResults: (places: Array<string>, scores: Array<number>) => void,
    useNetherlands: boolean
}

interface State {
    placeToGuess: PlaceFeature
    amountPlacesGuessed: number
    scores: Array<number>
    places: Array<string>
}

class SinglePlayerGame extends React.Component<Props, State> {

    private placeFactory = new PlaceFactory();
    private readonly gameMap: RefObject<GameMap>;

    constructor(props: Props) {
        super(props);
        this.gameMap = React.createRef<GameMap>();
        this.state = {
            amountPlacesGuessed: 0,
            placeToGuess: this.placeFactory.getNext(),
            scores: [],
            places: [],
        };
    }

    makeGuess = (e: LeafletMouseEvent) => {
        e.originalEvent.stopPropagation();
        let distance = this.state.placeToGuess.distanceTo(e.latlng);

        this.gameMap.current!.addGuess(this.state.placeToGuess, e.latlng);

        let placesGuessed = this.state.amountPlacesGuessed + 1;
        if (placesGuessed < 10) {
            this.setState({
                amountPlacesGuessed: placesGuessed,
                placeToGuess: this.placeFactory.getNext(),
                scores: [...this.state.scores, distance],
                places: [...this.state.places, this.state.placeToGuess.name],
            });
        } else {
            this.props.showResults(this.state.places, this.state.scores)
        }


    };

    render() {
        let lastScoreRow = null;
        if (this.state.scores.length > 0) {
            let lastScore = this.state.scores[this.state.scores.length - 1];
            let alertClass = "alert-success";
            if (lastScore > 30) {
                alertClass = "alert-warning"
            } else if (lastScore > 50) {
                alertClass = "alert-danger"
            }
            let lastPlace = this.state.places[this.state.places.length - 1];
            lastScoreRow = <div className={"col"}> Jouw gok lag <span
                className={`${alertClass} last-score`}>{Math.round(lastScore * 10) / 10} km</span> af
                van {lastPlace}</div>
        }


        return <div id={"game"}>
            <div className={"row"}>
                <p className={"col"}>Score: {Math.round(this.getTotalScore() * 10) / 10} km</p>
                <p className={"col"}>{this.state.amountPlacesGuessed}/10</p>
            </div>
            <div className={"row"}>
                <p className={"col"}>Waar ligt <span className={"place-to-guess"}>{this.state.placeToGuess.name}</span>?
                </p>
                {lastScoreRow}
            </div>
            <div className={"map-row"}>
                <GameMap ref={this.gameMap} makeGuess={this.makeGuess} useNetherlands={this.props.useNetherlands}/>
            </div>
        </div>
    }


    private getTotalScore(): number {
        return this.state.scores.reduce((a, b) => a + b, 0);
    }
}

export default SinglePlayerGame