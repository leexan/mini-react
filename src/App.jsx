import React from "./core/React.js";

let showBar = false

function Counter({num}) {
    const foo = <div>foo</div>
    const bar = <p>bar</p>

    function handleClick() {
        showBar = !showBar

        React.update()
    }

    return <div>
        <div>
            {showBar ? bar : foo}
        </div>
        <button onClick={handleClick}>click</button>
    </div>
}

function CounterContainer() {
    return <Counter></Counter>
}


function App() {
    return <div>
        hi mini-react
        <Counter num={10}> </Counter>
    </div>
}

export default App
