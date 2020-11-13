import React from "react";
import { fetchByVirusName } from "../requests/Requests";
import "./Search.css";
import logo from "../logo.svg";

class Search extends React.Component {
	constructor() {
		super();
		this.state = {
			searchResults: [], // an array where the results found are added
			query: "", // the text typed into the search input
			searched: false, // defines if the "Rechercher" button has been pressed once
		};
	}

	componentDidMount = () => {
		//this.fetchData();
	};

	fetchData = () => {
		this.setState({ searched: true, searchResults: [] });
		fetchByVirusName(this.state.query, this.handleResults);
	};

	handleResults = (result) => {
		let tmpSearchResults = this.state.searchResults;
		tmpSearchResults.push(result);
		this.setState({ searchResults: tmpSearchResults });
	};

	handleInputChange = () => {
		this.setState({ query: this.search.value });
	};

	render() {
		let resultsToPrint;

		if (this.state.searchResults) {
			resultsToPrint = this.state.searchResults.map((result) => {
				return (
					<div className="results">
						<h1>{result.name.value}</h1>
						<img src={result.image.value} alt="" />
						<p>{result.comment.value}</p>
					</div>
				);
			});
		}

		return (
			<div className="disease-searcher-container">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<p>The Disease Searcher, by the HexaOne Team</p>
					<input
						className="home-search"
						type="text"
						name="search"
						id="search"
						placeholder="Rechercher une maladie. ex:coronavirus"
						ref={(input) => (this.search = input)}
						onChange={this.handleInputChange}
					/>
					<button onClick={this.fetchData}>Rechercher</button>
					{this.state.searched &&
					this.state.searchResults.length === 0 ? (
						<h2>Pas de résultats</h2>
					) : (
						<React.Fragment />
					)}
					{resultsToPrint}
				</header>
			</div>
		);
	}
}

export default Search;
