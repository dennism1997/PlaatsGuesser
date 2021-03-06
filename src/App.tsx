import React from 'react';
import SinglePlayerGame from "./SinglePlayerGame";
import MultiPlayerGame from "./MultiPlayerGame";

enum GameState {
    Idle,
    SinglePlayer,
    MultiPlayer,
    SingleResult,
    MultiResult,
}

export enum PlaceMode {
    Gemeentes,
    Plaatsen,
    Wereldsteden,
}

type SinglePlayerScoreResult = {
    placeNames: Array<string>,
    scores: Array<number>
}
type MultiPlayerScoreResult = {
    playerNames: Array<string>,
    scores: Array<number>
}

interface AppState {
    gameState: GameState
    placeMode: PlaceMode
    results?: SinglePlayerScoreResult | MultiPlayerScoreResult
}

class App extends React.Component<{}, AppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            gameState: GameState.Idle,
            placeMode: PlaceMode.Gemeentes,
            results: undefined,
        }
        // this.state = {
        //     gameState: GameState.MultiResult,
        //     scoreResult: [3,  2, 1, 0],
        //     names: ["a", "b", "c", "d"],
        // }
    }

    render() {
        let content;
        switch (this.state.gameState) {
            case GameState.Idle:
                content = <div className={"row justify-content-center"}>
                    <div className={"col-8 col-lg-6"}>
                        <div className={"container"}>
                            <div className={"row"}>
                                <div className={"col"}>
                                    <p>Welkom bij raad de plaats! Klik zo dicht mogelijk bij de genoemde plaats op de
                                        kaart!</p>
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col"}>
                                    <p>Mode:</p>
                                </div>
                            </div>
                            <div className={"row d-flex justify-content-around"}>
                                <button
                                    className={"btn px-3 mb-2" + (this.state.placeMode === PlaceMode.Gemeentes ? " btn-primary" : " btn-secondary")}
                                    onClick={() => {
                                        this.setMode(PlaceMode.Gemeentes);
                                    }}>Gemeentes
                                </button>
                                <button
                                    className={"btn px-3 mb-2" + (this.state.placeMode === PlaceMode.Plaatsen ? " btn-primary" : " btn-secondary")}
                                    onClick={() => {
                                        this.setMode(PlaceMode.Plaatsen);
                                    }}>Plaatsen
                                </button>
                                <button
                                    className={"btn px-3 mb-2" + (this.state.placeMode === PlaceMode.Wereldsteden ? " btn-primary" : " btn-secondary")}
                                    onClick={() => {
                                        this.setMode(PlaceMode.Wereldsteden);
                                    }}>Wereldsteden
                                </button>
                            </div>
                            <div className={"row mt-3"}>
                                <div className={"col"}>
                                    <p>Aantal spelers:</p>
                                </div>
                            </div>
                            <div className={"row d-flex justify-content-around"}>
                                <button className={"btn btn-primary px-3"} onClick={(e) => {
                                    this.setGameState(GameState.SinglePlayer)
                                }}>Single Player
                                </button>
                                <button className={"btn btn-primary px-3"} onClick={(e) => {
                                    this.setGameState(GameState.MultiPlayer)
                                }}>Multiplayer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>;
                break;
            case GameState.SinglePlayer:
                content = <SinglePlayerGame showResults={this.showSinglePlayerResult}
                                            placeMode={this.state.placeMode}/>;
                break;
            case GameState.MultiPlayer:
                content = <MultiPlayerGame showResults={this.showMultiPlayerResults}
                                           placeMode={this.state.placeMode}/>;
                break;
            case GameState.SingleResult:
                let result = this.state.results as SinglePlayerScoreResult;
                content = <div className={"container"}>
                    <div className={"row mt-2"}>
                        <div className={"col"}>
                            <h5>Resultaten:</h5>
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col col-lg-5 col-md-7"}>
                            <ul className={"list-group list-group-flush"}>
                                {result.placeNames.map((placeName, index) => {
                                    let score = result.scores[index];
                                    return <li className={"list-group-item d-flex"} key={index}>
                                        <span className={"flex-grow-1"}>{placeName}</span>
                                        <span>{Math.round(score * 10) / 10} km</span></li>
                                })}
                                <li className={"list-group-item d-flex"}>
                                    <span className={"flex-grow-1 font-weight-bold"}>Totaal</span>
                                    <span className={"font-weight-bold"}>{Math.round(result.scores.reduce((a, b) => a + b, 0) * 10) / 10} km</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={"row my-2"}>
                        <div className={"col"}>
                            <button type={"button"} className={"btn btn-primary"} onClick={() => {
                                this.setGameState(GameState.Idle)
                            }}>Opnieuw
                            </button>
                        </div>
                    </div>
                </div>;
                break;
            case GameState.MultiResult:
                let results = this.state.results as MultiPlayerScoreResult;
                let scores = results.scores;
                let scoresSorted = scores.slice().sort((a, b) => a - b);
                let namesSorted = results.playerNames.slice().sort((a, b) => {
                    return scoresSorted.indexOf(scores[results.playerNames.indexOf(a)]) - scoresSorted.indexOf(scores[results.playerNames.indexOf(b)])
                });
                content = <React.Fragment>
                    <div className={"row mt-2"}>
                        <div className={"col"}>
                            <h5>Resultaten:</h5>
                        </div>
                    </div>
                    <div className={"row"}>
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
                    <div className={"row mt-2"}>
                        <div className={"col"}>
                            <button type={"button"} className={"btn btn-primary"} onClick={() => {
                                this.setGameState(GameState.Idle)
                            }}>Opnieuw
                            </button>
                        </div>
                    </div>
                </React.Fragment>;
                break;
        }

        return <div id={"app"} className={"container-fluid"}>
            <h1 className={"font-weight-normal"}>Raad de plaats</h1>
            {content}
        </div>
    }

    showSinglePlayerResult = (placeNames: Array<string>, scores: Array<number>) => {
        this.setState({
            gameState: GameState.SingleResult,
            results: {
                placeNames: placeNames,
                scores: scores,
            }
        })
    };

    showMultiPlayerResults = (names: Array<string>, scores: Array<number>) => {
        this.setState({
            gameState: GameState.MultiResult,
            results: {
                playerNames: names,
                scores: scores
            },
        })
    };

    private setGameState(gameState: GameState) {
        this.setState({
            gameState: gameState
        });
    }

    resetGameState = () => {
        this.setGameState(GameState.Idle)
    };

    private setMode(mode: PlaceMode) {
        this.setState({
            placeMode: mode
        });
    }
}


export default App;
