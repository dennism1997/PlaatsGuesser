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

enum Mode {
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
    mode: Mode
    results?: SinglePlayerScoreResult | MultiPlayerScoreResult
}

class App extends React.Component<{}, AppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            gameState: GameState.Idle,
            mode: Mode.Gemeentes,
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
                    <div className={"col-12 col-lg-6"}>
                        <div className={"row"}>
                            <p>Welkom bij raad de plaats! Klik zo dicht bij de genoemde plaats op de kaart!</p>
                        </div>
                        <p className={"row"}>Mode:</p>
                        <div className={"row d-flex justify-content-around"}>
                            <button
                                className={"btn px-3" + (this.state.mode === Mode.Gemeentes ? " btn-primary" : " btn-secondary")}
                                onClick={() => {
                                    this.setMode(Mode.Gemeentes);
                                }}>Gemeentes
                            </button>
                            <button
                                className={"btn px-3" + (this.state.mode === Mode.Plaatsen ? " btn-primary" : " btn-secondary")}
                                onClick={() => {
                                    //TODO enable when working
                                    this.setMode(Mode.Plaatsen);
                                }}>Plaatsen (WIP)
                            </button>
                            <button
                                className={"btn px-3" + (this.state.mode === Mode.Wereldsteden ? " btn-primary" : " btn-secondary")}
                                onClick={() => {
                                    //TODO enable when working
                                    this.setMode(Mode.Wereldsteden);
                                }}>Wereldsteden (WIP)
                            </button>
                        </div>
                        <p className={"row mt-3"}>Aantal spelers:</p>
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
                </div>;
                break;
            case GameState.SinglePlayer:
                content = <SinglePlayerGame showResults={this.showSinglePlayerResult} useNetherlands={this.state.mode !== Mode.Wereldsteden}/>;
                break;
            case GameState.MultiPlayer:
                content = <MultiPlayerGame showResults={this.showMultiPlayerResults} useNetherlands={this.state.mode !== Mode.Wereldsteden}/>;
                break;
            case GameState.SingleResult:
                let result = this.state.results as SinglePlayerScoreResult;
                content = <React.Fragment>
                    <div className={"row mt-2"}>
                        <div className={"col"}>
                            <h4>Resultaten:</h4>
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
                            <h4>Resultaten:</h4>
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

        return <div id={"app"} className={"container"}>
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

    private setMode(mode: Mode) {
        this.setState({
            mode: mode
        });
    }
}


export default App;
