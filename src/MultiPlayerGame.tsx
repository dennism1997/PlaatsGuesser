import React, {ReactNode, RefObject} from "react";
import PlaceFeature from "./PlaceFeature";
import PlaceGenerator from "./PlaceGenerator";
import GameMap from "./GameMap";
import {LatLng, LeafletMouseEvent} from "leaflet";
import {PlaceMode} from "./App";

enum MultiplayerGameState {
    Guessing,
    Results,
}

interface Props {
    showResults: (names: Array<string>, scores: Array<number>) => void,
    placeMode: PlaceMode,
}

interface State {
    gameState: MultiplayerGameState
    placeToGuess?: PlaceFeature
    placesGuessed: number
    playerInputFinished: boolean,
    playerNames: Array<string>,
    playerScores: Array<number>,
    currentPlayerIndex: number,
    currentScores: Array<number>,
    currentGuesses: Array<LatLng>,
}

class MultiPlayerGame extends React.Component<Props, State> {

    private placeFactory;
    private readonly gameMap: RefObject<GameMap>;
    private readonly inputRef: RefObject<HTMLInputElement>;

    constructor(props: Props) {
        super(props);
        this.gameMap = React.createRef<GameMap>();
        this.placeFactory = new PlaceGenerator(this.props.placeMode);
        this.state = {
            placesGuessed: 1,
            placeToGuess: undefined,
            currentPlayerIndex: 0,
            playerInputFinished: false,
            playerNames: [],
            playerScores: [],
            currentScores: [],
            currentGuesses: [],
            gameState: MultiplayerGameState.Guessing
        };
        this.inputRef = React.createRef();
    }

    async componentDidMount() {
        this.setState({
            placeToGuess: await this.placeFactory.getNext()
        });
    }

    makeGuess = (e: LeafletMouseEvent) => {
        e.originalEvent.preventDefault();
        e.originalEvent.stopImmediatePropagation();
        if (this.state.currentPlayerIndex >= this.state.playerNames.length) {
            return
        }
        console.log("making guess for player " + this.state.playerNames[this.state.currentPlayerIndex]);
        let distance = this.state.placeToGuess!!.distanceTo(e.latlng);

        let newPlayerIndex = this.state.currentPlayerIndex + 1;

        this.setState({
            currentPlayerIndex: newPlayerIndex,
            currentScores: this.state.currentScores.concat([distance]),
            currentGuesses: this.state.currentGuesses.concat([e.latlng])
        }, () => {
            if (this.state.currentPlayerIndex >= this.state.playerNames.length) {
                this.gameMap.current!.addGuesses(this.state.placeToGuess!!, this.state.currentGuesses, this.state.playerNames, this.state.currentScores);
                this.setState({
                    gameState: MultiplayerGameState.Results
                })
            }
        });


    };

    render() {
        if (!this.state.placeToGuess) {
            return <div/>
        }
        if (this.state.playerInputFinished) {
            return <div id={"game"}>
                <div className={"container"}>
                    <div className={"row"}>
                        <p className={"col h5"}>{this.state.placesGuessed}/10</p>
                        <div className={"col"}>{this.getScoreBoard()}</div>
                    </div>
                    <hr className="row"/>
                    <div className={"row"}>
                        <p className={"col"}>
                            Waar ligt <span className={"place-to-guess"}>{this.state.placeToGuess!!.name}</span>?
                        </p>
                        {this.state.gameState === MultiplayerGameState.Results ? <div className={"col"}>
                            <button className={"btn btn-primary"} onClick={() => {
                                this.nextRound();
                            }}>Volgende
                            </button>
                        </div> : <p className={"col"}>
                        <span className={"font-weight-bold"}>
                            {this.state.playerNames[this.state.currentPlayerIndex]}
                        </span> is aan de beurt</p>}
                    </div>
                </div>
                <div className={"map-row"}>
                    <GameMap ref={this.gameMap} makeGuess={this.makeGuess} placeMode={this.props.placeMode}/>
                </div>
            </div>
        } else {
            return <div id={"game"}>
                <div className={"row"}>
                    <div className={"col-md-4 col-sm-8"}>
                        <form className={"input-group"} onSubmit={event => {
                            event.preventDefault();
                            this.addName();
                        }}>
                            <input className={"form-control"} ref={this.inputRef} type={"text"}/>
                            <div className={"input-group-append"}>
                                <button type={"button"} className={"btn btn-outline-secondary"}
                                        onClick={() => this.addName()}>Voeg toe
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col-sm-12 col-md-3"}>
                        <p className={"mt-3"}>Spelers:</p>
                        <ul className={"list-group"}>
                            {this.state.playerNames.map((name, index) => {
                                return <li className={"list-group-item d-flex py-1 align-items-center"} key={index}>
                                    <span className={"flex-grow-1"}>{name}</span>
                                    <button type={"button"} className={"close"} onClick={() => {
                                        this.removePlayer(index)
                                    }}><span aria-hidden="true">&times;</span>
                                    </button>
                                </li>
                            })}
                        </ul>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col"}>
                        <button className={"btn btn-primary mt-3"} type={"button"} onClick={() => {
                            if (this.state.playerNames.length > 1) {
                                this.setState({
                                    playerInputFinished: true,
                                })
                            }
                        }}>Start
                        </button>
                    </div>
                </div>
            </div>
        }
    }

    addName() {
        let newName = this.inputRef.current!.value;
        if (newName.length > 0 && !this.state.playerNames.includes(newName)) {
            this.setState({
                playerNames: this.state.playerNames.concat([newName]),
                playerScores: this.state.playerScores.concat([0]),
            });
        }
        this.inputRef.current!.value = "";
        this.inputRef.current!.focus();
    }

    removePlayer(index: number) {
        let playerNames = [...this.state.playerNames];
        playerNames.splice(index, 1);
        let playerScores = [...this.state.playerScores];
        playerScores.splice(index, 1);
        this.setState({
            playerNames: playerNames,
            playerScores: playerScores,
        });
        this.inputRef.current!.focus();
    }

    getScoreBoard(): ReactNode {
        let scores = this.state.playerScores;
        let scoresSorted = scores.slice().sort((a, b) => a - b);
        let namesSorted = this.state.playerNames.slice().sort((a, b) => {
            return scoresSorted.indexOf(scores[this.state.playerNames.indexOf(a)]) - scoresSorted.indexOf(scores[this.state.playerNames.indexOf(b)])
        });
        return <React.Fragment>
            <div className={"row overflow-auto multiplayer-interim-results"}>
                <div className={"col col-lg-5 col-md-7"}>
                    <ul className={"list-group list-group-flush"}>
                        {namesSorted.map(((name, index) => {
                            return <li className={"list-group-item d-flex"} key={index}>
                                <span className={"mr-1"}>{index + 1}.</span>
                                <span className={"flex-grow-1"}>{name}</span>
                                <span>{Math.round(scoresSorted[index])} km</span>
                            </li>
                        }))}
                    </ul>
                </div>
            </div>
        </React.Fragment>;
    }

    nextRound = async () => {
        let newScores = this.state.currentScores.map((score, index) => {
            return this.state.playerScores[index] + score;
        });
        if (this.state.placesGuessed < 10) {
            this.setState({
                playerScores: newScores,
                gameState: MultiplayerGameState.Guessing,
                currentPlayerIndex: 0,
                currentScores: [],
                currentGuesses: [],
                placesGuessed: this.state.placesGuessed + 1,
                placeToGuess: await this.placeFactory.getNext(),
            });
            this.gameMap.current!.clearGuesses()
        } else {
            this.setState({
                playerScores: newScores
            }, () => {
                this.props.showResults(this.state.playerNames, this.state.playerScores)
            })
        }

    }
}

export default MultiPlayerGame