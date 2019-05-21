import React from "react";
import ReactDOM from "react-dom";


class Testme extends React.Component {
    render() {
        return <h1>THIS IS REACT SHOWING UP!!!!</h1>
    }
}

ReactDOM.render(<Testme />, document.getElementById('testme123'));