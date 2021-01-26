import React, {RefObject} from "react";
import {LeafletMouseEvent} from "leaflet";
import GameMap from "./GameMap";
import PlaceGenerator from "./PlaceGenerator";
import PlaceFeature from "./PlaceFeature";
import {PlaceMode} from "./App";

interface Props {
    showResults: (places: Array<string>, scores: Array<number>) => void,
    placeMode: PlaceMode
}

interface State {
    placeToGuess?: PlaceFeature
    amountPlacesGuessed: number
    scores: Array<number>
    places: Array<string>
}

class SinglePlayerGame extends React.Component<Props, State> {

    private placeFactory;
    private readonly gameMap: RefObject<GameMap>;

    constructor(props: Props) {
        super(props);
        this.gameMap = React.createRef<GameMap>();
        this.placeFactory = new PlaceGenerator(this.props.placeMode);
        this.state = {
            amountPlacesGuessed: 0,
            placeToGuess: undefined,
            scores: [],
            places: [],
        };
    }


    async componentDidMount() {
        this.setState({
            placeToGuess: await this.placeFactory.getNext()
        });
    }

    makeGuess = async (e: LeafletMouseEvent) => {
        if (this.state.placeToGuess) {
            e.originalEvent.stopPropagation();
            let distance = this.state.placeToGuess.distanceTo(e.latlng);

            this.gameMap.current!.addGuess(this.state.placeToGuess, e.latlng);

            let placesGuessed = this.state.amountPlacesGuessed + 1;
            let newScores = [...this.state.scores, distance];
            let newPlaces = [...this.state.places, this.state.placeToGuess.name];
            if (placesGuessed < 10) {
                this.setState({
                    amountPlacesGuessed: placesGuessed,
                    placeToGuess: await this.placeFactory.getNext(),
                    scores: newScores,
                    places: newPlaces,
                });
            } else {
                this.props.showResults(newPlaces, newScores)
            }
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

        if (this.state.placeToGuess) {
            return <div id={"game"}>
                <div className={"container"}>
                    <div className={"row"}>
                        <p className={"col"}>Score: {Math.round(this.getTotalScore() * 10) / 10} km</p>
                        <p className={"col"}>{this.state.amountPlacesGuessed}/10</p>
                    </div>
                    <div className={"row"}>
                        <p className={"col"}>Waar ligt <span
                            className={"place-to-guess"}>{this.state.placeToGuess.name}</span>?
                        </p>
                        {lastScoreRow}
                    </div>
                </div>
                <div className={"map-row"}>
                    <GameMap ref={this.gameMap} makeGuess={this.makeGuess} placeMode={this.props.placeMode}/>
                </div>
            </div>;
        } else {
            return <div/>;
        }
    }


    private getTotalScore(): number {
        return this.state.scores.reduce((a, b) => a + b, 0);
    }
}

export default SinglePlayerGame