import React from "./core/React.js";

function Counter({num}) {
    return <div>count{num}</div>
}

function CounterContainer() {
    return <Counter></Counter>
}


function App() {
    return <div>
        haha
        <span>heihei</span>
        <Counter num={10}> </Counter>
        <Counter num={20}> </Counter>
    </div>
}

export default App
