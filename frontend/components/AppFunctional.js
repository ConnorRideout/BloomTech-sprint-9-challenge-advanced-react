import React, { useState } from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
    // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
    // You can delete them and build your own logic from scratch.
    const [message, setMessage] = useState(initialMessage)
    const [email, setEmail] = useState(initialEmail)
    const [steps, setSteps] = useState(initialSteps)
    const [curIndex, setCurIndex] = useState(initialIndex)

    function getXY() {
        // It it not necessary to have a state to track the coordinates.
        // It's enough to know what index the "B" is at, to be able to calculate them.
        const x = curIndex % 3 ? ((curIndex - 1) % 3 ? 3 : 2) : 1
        const y = curIndex < 3 ? 1 : curIndex < 6 ? 2 : 3
        return [x, y]
        /* 
        row 1 = 0, 1, 2
        row 2 = 3, 4, 5
        row 3 = 6, 7, 8

        col 1 = 0, 3, 6
        col 2 = 1, 4, 7
        col 3 = 2, 5, 8
        */
    }

    function getXYMessage() {
        // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
        // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
        // returns the fully constructed string.
        const [x, y] = getXY()
        return `Coordinates (${x}, ${y})`
    }

    function reset() {
        // Use this helper to reset all states to their initial values.
        setMessage(initialMessage)
        setEmail(initialEmail)
        setSteps(initialSteps)
        setCurIndex(initialIndex)
    }

    function getNextIndex(direction) {
        // This helper takes a direction ("left", "up", etc) and calculates what the next index
        // of the "B" would be. If the move is impossible because we are at the edge of the grid,
        // this helper should return the current index unchanged.
        if ((direction == 'left' && !(curIndex % 3)) || (direction == 'right' && !((curIndex - 2) % 3))) return curIndex
        let newIndex = { 'left': curIndex - 1, 'right': curIndex + 1, 'down': curIndex + 3, 'up': curIndex - 3 }[direction]
        if (newIndex < 0 || newIndex > 8) return curIndex
        return newIndex
    }

    function move(evt) {
        // This event handler can use the helper above to obtain a new index for the "B",
        // and change any states accordingly.
        const direction = evt.target.id
        const nextIndex = getNextIndex(direction)
        if (curIndex != nextIndex) {
            setCurIndex(nextIndex)
            setSteps(steps + 1)
            setMessage(initialMessage)
        } else {
            setMessage(`You can't go ${direction}`)
        }
    }

    function onChange(evt) {
        // You will need this to update the value of the input.
        setEmail(evt.target.value)
    }

    function onSubmit(evt) {
        // Use a POST request to send a payload to the server.
        evt.preventDefault()
        const [x, y] = getXY()
        setEmail(initialEmail)
        axios.post('http://localhost:9000/api/result', { x, y, steps, email })
            .then(res => setMessage(res.data.message))
            .catch(err => setMessage(err.response.data.message))
    }

    return (
        <div id="wrapper" className={props.className}>
            <div className="info">
                <h3 id="coordinates">{getXYMessage()}</h3>
                <h3 id="steps">You moved {steps} time{steps == 1 ? '' : 's'}</h3>
            </div>
            <div id="grid">
                {
                    [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
                        <div key={idx} className={`square${idx === curIndex ? ' active' : ''}`}>
                            {idx === curIndex ? 'B' : null}
                        </div>
                    ))
                }
            </div>
            <div className="info">
                <h3 id="message">{message}</h3>
            </div>
            <div id="keypad">
                <button id="left" onClick={move}>LEFT</button>
                <button id="up" onClick={move}>UP</button>
                <button id="right" onClick={move}>RIGHT</button>
                <button id="down" onClick={move}>DOWN</button>
                <button id="reset" onClick={reset}>reset</button>
            </div>
            <form onSubmit={onSubmit}>
                <input
                    id="email"
                    type="email"
                    placeholder="type email"
                    onChange={onChange}
                    value={email}
                ></input>
                <input id="submit" type="submit"></input>
            </form>
        </div>
    )
}
