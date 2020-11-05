import React, {RefObject} from "react";
import {LeafletMouseEvent} from "leaflet";
import GameMap from "./GameMap";
import PlaceFactory from "./PlaceFactory";
import PlaceFeature from "./PlaceFeature";

interface Props {
    showResult: (score: number) => void,
}
interface State {
    score: number
    placeToGuess: PlaceFeature
    placesGuessed: number
    lastScore: number
    lastPlaceName: string
}

class SinglePlayerGame extends React.Component<Props, State> {

    private placeFactory = new PlaceFactory();
    private readonly gameMap: RefObject<GameMap>;

    constructor(props: Props) {
        super(props);
        this.gameMap = React.createRef<GameMap>();
        this.state = {
            placesGuessed: 0,
            placeToGuess: this.placeFactory.getNext(),
            score: 0,
            lastScore: -1,
            lastPlaceName: "",
        };
    }

    makeGuess = (e: LeafletMouseEvent) => {
        e.originalEvent.stopPropagation();
        let distance = this.state.placeToGuess.distanceTo(e.latlng);
        console.log(distance);

        this.gameMap.current!.addGuess(this.state.placeToGuess, e.latlng);

        let placesGuessed = this.state.placesGuessed + 1;
        let newScore = this.state.score + distance;

        if(placesGuessed < 10) {
            this.setState({
                placesGuessed: placesGuessed,
                placeToGuess: this.placeFactory.getNext(),
                score: newScore,
                lastScore: Math.round(distance * 10) / 10,
                lastPlaceName: this.state.placeToGuess.name
            });
        } else {
            this.props.showResult(newScore)
        }


    };

    render() {
        let lastScoreRow = null;
        if (this.state.lastScore >= 0) {
            let alertClass = "alert-success";
            if (this.state.lastScore > 30) {
                alertClass = "alert-warning"
            } else if (this.state.lastScore > 50) {
                alertClass = "alert-danger"
            }
            lastScoreRow = <div className={"col"}> Jouw gok lag <span
                className={`${alertClass} last-score`}>{this.state.lastScore} km</span> af
                van {this.state.lastPlaceName}</div>
        }

        return <div id={"game"}>
            <div className={"row"}>
                <p className={"col"}>Score: {Math.round(this.state.score * 10) / 10} km</p>
                <p className={"col"}>{this.state.placesGuessed}/10</p>
            </div>
            <div className={"row"}>
                <p className={"col"}>Waar ligt <span className={"place-to-guess"}>{this.state.placeToGuess.name}</span>?
                </p>
                {lastScoreRow}
            </div>
            <div className={"map-row"}>
                <GameMap ref={this.gameMap} makeGuess={this.makeGuess}/>
            </div>
        </div>
    }
}

export default SinglePlayerGame