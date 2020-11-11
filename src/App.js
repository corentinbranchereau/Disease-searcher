import React, { Component } from "react";
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch,
} from "react-router-dom";

import "./App.css";
import Search from "./Search/Search";
import Disease from "./Disease/Disease";
import Virus from "./Virus/Virus";

class App extends Component {
	render() {
		return (
			<Router>
				<Switch>
					{/* Front Pages */}
					<Route path="/" component={Search} exact />
					<Route path="/virus/:virusName?" component={Virus} exact />
					<Route
						path="/disease/:diseaseName"
						component={Disease}
						exact
					/>

					<Redirect to="/" />
				</Switch>
			</Router>
		);
	}
}

export default App;
