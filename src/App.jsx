import React from "./core/React.js";
let count =10
function Counter({num}) {
    function handleClick() {
        console.log('click')
        count++
        console.log(count)

        React.update()
    }

    return <div>
        count{count}
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
