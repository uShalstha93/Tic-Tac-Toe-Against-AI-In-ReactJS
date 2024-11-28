import React, { useState, useEffect, useCallback } from "react";
import { Modal } from 'react-bootstrap';
import "./style.css";

const TicTacToe = () => {

    const [board, setBoard] = useState(Array(9).fill(null)); // 3x3 board
    const [isXNext, setIsXNext] = useState(true); // Human (X) starts first
    const [winner, setWinner] = useState(null);
    const [difficulty, setDifficulty] = useState("easy"); // 'easy', 'medium', 'hard'
    const [showModal, setShowModal] = useState(false); // show and hide modal

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const makeMove = useCallback(
        (index, player) => {
            if (board[index] || winner) return; // Ignore invalid moves

            const newBoard = [...board];
            newBoard[index] = player;

            setBoard(newBoard);
            checkWinner(newBoard);

            // Toggle turn correctly
            setIsXNext(player === "O"); // AI (O) => Player's turn (true); Player (X) => AI's turn (false)
            console.log(`Move made by: ${player}, Board:`, newBoard);
        },
        [board, winner]
    );

    const getBestMove = useCallback(
        (board) => {
            if (difficulty === "easy") {
                // Choose a random move
                const emptyCells = board.map((cell, index) => (!cell ? index : null)).filter((cell) => cell !== null);
                return emptyCells[Math.floor(Math.random() * emptyCells.length)];
            }

            if (difficulty === "medium") {
                // 50% chance of making a random move
                const randomChance = Math.random() < 0.5;
                if (randomChance) {
                    const emptyCells = board.map((cell, index) => (!cell ? index : null)).filter((cell) => cell !== null);
                    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
                }
            }

            // Default to hard (best move using minimax)
            let bestScore = -Infinity;
            let move = null;

            board.forEach((cell, index) => {
                if (!cell) {
                    const newBoard = [...board];
                    newBoard[index] = "O"; // Simulate AI move
                    const score = minimax(newBoard, false, difficulty === "medium" ? 1 : Infinity); // Limit depth for medium
                    if (score > bestScore) {
                        bestScore = score;
                        move = index;
                    }
                }
            });

            console.log("AI selected move:", move);
            return move;
        },
        [difficulty] // Dependency added for difficulty level
    );

    const minimax = (board, isMaximizing, depth = Infinity) => {
        const result = checkGameState(board);
        if (result === "X") return -1; // Human wins
        if (result === "O") return 1; // AI wins
        if (result === "Draw") return 0; // Draw

        if (depth === 0) return 0; // Stop recursion at specified depth

        if (isMaximizing) {
            let bestScore = -Infinity;
            board.forEach((cell, index) => {
                if (!cell) {
                    const newBoard = [...board];
                    newBoard[index] = "O";
                    const score = minimax(newBoard, false, depth - 1);
                    bestScore = Math.max(score, bestScore);
                }
            });
            return bestScore;
        } else {
            let bestScore = Infinity;
            board.forEach((cell, index) => {
                if (!cell) {
                    const newBoard = [...board];
                    newBoard[index] = "X";
                    const score = minimax(newBoard, true, depth - 1);
                    bestScore = Math.min(score, bestScore);
                }
            });
            return bestScore;
        }
    };

    useEffect(() => {
        console.log("isXNext:", isXNext, "Winner:", winner, "Difficulty:", difficulty);
        if (!isXNext && !winner) {
            const bestMove = getBestMove(board);
            if (bestMove !== null) {
                setTimeout(() => makeMove(bestMove, "O"), 500); // Slight delay for better UX
            }
        }
    }, [isXNext, winner, board, getBestMove, makeMove]);

    const checkGameState = (board) => {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (let combo of winningCombinations) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a]; // Return the winner ("X" or "O")
            }
        }

        if (board.every((cell) => cell)) return "Draw"; // All cells filled
        return null; // Game ongoing
    };

    const checkWinner = (board) => {
        const result = checkGameState(board);
        if (result) {
            setWinner(result);
            console.log("Winner found:", result);
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
        console.log("Game reset");
    };

    return (
        <>

            <div className="play-button">
                <button className="startgame" onClick={handleShowModal}>START GAME</button>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} size="lg">

                <Modal.Header className="gamemodalheader" closeButton>
                    <Modal.Title>
                        <h1>Tic Tac Toe (Play Against AI)</h1>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="gamemodalbody">
                    <div className="game">
                        <div className="dropdown">
                            <label>
                                Difficulty :
                                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="select-opt">
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </label>
                        </div>
                        <div className="board">
                            {board.map((cell, index) => (
                                <div
                                    key={index}
                                    className="cell"
                                    onClick={() => isXNext && !winner && makeMove(index, "X")}
                                >
                                    {cell}
                                </div>
                            ))}
                        </div>
                        {winner && <h2>{winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`}</h2>}
                        <div className="resetbutton">
                            <button onClick={resetGame} className="restartgame">RESET</button>
                        </div>
                    </div>

                </Modal.Body>

            </Modal>

        </>
    );
};

export default TicTacToe;
