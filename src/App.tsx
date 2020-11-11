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

interface AppState {
    gameState: GameState
    mode: Mode
    scoreResult: number | Array<number>,
    names: Array<string>
}

class App extends React.Component<{}, AppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            gameState: GameState.Idle,
            mode: Mode.Gemeentes,
            scoreResult: 0,
            names: [],
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
                        <div className={"row justify-content-between"}>
                            <button
                                className={"btn col-3" + (this.state.mode === Mode.Gemeentes ? " btn-primary" : " btn-secondary")}
                                onClick={() => {
                                    this.setMode(Mode.Gemeentes);
                                }}>Gemeentes
                            </button>
                            <button
                                className={"btn col-3" + (this.state.mode === Mode.Plaatsen ? " btn-primary" : " btn-secondary")}
                                onClick={() => {
                                    this.setMode(Mode.Plaatsen);
                                }}>Plaatsen
                            </button>
                            <button
                                className={"btn col-3" + (this.state.mode === Mode.Wereldsteden ? " btn-primary" : " btn-secondary")}
                                onClick={() => {
                                    this.setMode(Mode.Wereldsteden);
                                }}>Wereldsteden
                            </button>
                        </div>
                        <p className={"row mt-3"}>Aantal spelers:</p>
                        <div className={"row justify-content-between mt-3"}>
                            <button className={"btn btn-primary col-5"} onClick={(e) => {
                                this.setGameState(GameState.SinglePlayer)
                            }}>Single Player
                            </button>
                            <button className={"btn btn-primary col-5"} onClick={(e) => {
                                this.setGameState(GameState.MultiPlayer)
                            }}>Multiplayer
                            </button>
                        </div>
                    </div>
                </div>;
                break;
            case GameState.SinglePlayer:
                content = <SinglePlayerGame showResult={this.showResult}/>;
                break;
            case GameState.MultiPlayer:
                content = <MultiPlayerGame showResults={this.showResults}/>;
                break;
            case GameState.SingleResult:
                content = <React.Fragment>
                    <div className={"row"}>
                        <div className={"col"}>
                            <p>Resultaat: <span className={"score-result"}>{this.state.scoreResult}</span> km</p>
                        </div>
                    </div>
                    <div className={"row"}>
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
                let scores = this.state.scoreResult as Array<number>;
                let scoresSorted = (this.state.scoreResult as Array<number>).slice().sort((a, b) => a - b);
                let namesSorted = this.state.names.slice().sort((a, b) => {
                    return scoresSorted.indexOf(scores[this.state.names.indexOf(a)]) - scoresSorted.indexOf(scores[this.state.names.indexOf(b)])
                });
                content = <React.Fragment>
                    <div className={"row"}>
                        <div className={"col"}>
                            <p>Resultaten:</p>
                        </div>
                    </div>
                    <div className={"row"}>
                        <ul className={"col"}>
                            {namesSorted.map(((name, index) => {
                                return <li className={"row"} key={index}>
                                    <span className={"col-5 col-md-3"}>{index + 1}. {name}</span>
                                    <span className={"col-4"}>{Math.round(scoresSorted[index])} km</span>
                                </li>
                            }))}
                        </ul>
                    </div>
                    <div className={"row"}>
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

    showResult = (score: number) => {
        this.setState({
            gameState: GameState.SingleResult,
            scoreResult: Math.round(score)
        })
    };

    showResults = (names: Array<string>, scores: Array<number>) => {
        this.setState({
            gameState: GameState.MultiResult,
            scoreResult: scores,
            names: names
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
