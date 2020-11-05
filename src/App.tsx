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

interface AppState {
    gameState: GameState
    scoreResult: number | Array<number>,
    names: Array<string>
}

class App extends React.Component<{}, AppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            gameState: GameState.Idle,
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
                    <button className={"btn btn-secondary col-7 col-sm-3 mx-2 my-2"} onClick={(e) => {
                        this.setGameState(GameState.SinglePlayer)
                    }}>Single Player
                    </button>
                    <button className={"btn btn-secondary col-7 col-sm-3 mx-2 my-2"} onClick={(e) => {
                        this.setGameState(GameState.MultiPlayer)
                    }}>Multiplayer
                    </button>
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
                                    <span className={"col-5 col-md-3"}>{index + 1}.  {name}</span>
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

    setGameState(gameState
                     :
                     GameState
    ) {
        this.setState({
            gameState: gameState
        });
    }
}


export default App;
