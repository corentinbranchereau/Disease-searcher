import React, { Component } from "react";
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch,
} from "react-router-dom";

import "./App.css";
import Search from "./Search/Search";
import Entity from "./Entity/Entity";

class App extends Component {
	render() {
		return (
			<Router>
				<Switch>
					{/* Front Pages */}
					<Route path="/" component={Search} exact />
					<Route
						path="/entity/:name/:idD?/:idM?"
						component={Entity}
						exact
					/>

					<Redirect to="/" />
				</Switch>
			</Router>
		);
	}
}

export default App;
