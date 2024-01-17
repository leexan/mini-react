import React from "./core/React.js";

function Counter({num}) {
    function handleClick() {
        console.log('click')
    }

    return <div>
        count{num}
        <button onClick={handleClick}>click</button>
    </div>
}

function CounterContainer() {
    return <Counter></Counter>
}


function App() {
    return <div>
        haha
        <span>heihei</span>
        <Counter num={10}> </Counter>
    </div>
}

export default App
