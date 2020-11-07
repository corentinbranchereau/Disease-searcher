import React from "react";
import { fetchSearchResultsDiseaseAndVirus } from "../requests/Requests";
import { fetchSearchResultsDisease } from "../requests/Requests";
import { fetchSearchResultsVirus } from "../requests/Requests";
import "./Search.css";
import logo from "../logo2.svg";

class Search extends React.Component {
	constructor() {
		super();
		this.state = {
			searchResults: [], // an array where the results found are added
			query: "", // the text typed into the search input
			searching: false, // defines if the "Rechercher" button has been pressed once
			diseaseChecked: true, //define if the checkbox disease is checked or not
			virusChecked: true, //define if the checkbox virus is checked or not
			showOptions: false, // define if you can see the search options
		};
	}

	fetchData = () => {
		if (this.state.diseaseChecked && this.state.virusChecked) {
			//fetchSearchResultsDiseaseAndVirus(this.state.query, this.handleResults);
			fetchSearchResultsDisease(this.state.query, this.handleResults);
			fetchSearchResultsVirus(this.state.query, this.handleResults);
		} else if (this.state.diseaseChecked) {
			fetchSearchResultsDisease(this.state.query, this.handleResults);
		} else if (this.state.virusChecked) {
			fetchSearchResultsVirus(this.state.query, this.handleResults);
		}
	};

	handleResults = (result, type) => {
		result.type = type;
		let tmpSearchResults = this.state.searchResults;
		tmpSearchResults.push(result);
		this.setState({ searchResults: tmpSearchResults });
	};

	handleInputChange = (event) => {
		this.setState({ query: this.search.value });
		if (event.key === "Enter") {
			this.fetchData();
			this.setState({ searching: true, searchResults: [] });
		}
	};

	handleCheckboxDisease = () => {
		let checked = !this.state.diseaseChecked;
		this.setState({ diseaseChecked: checked });
	};

	handleCheckboxVirus = () => {
		let checked = !this.state.virusChecked;
		this.setState({ virusChecked: checked });
	};

	handleTitleClick = () => {
		this.setState({ searching: false });
	};

	handleOptionClick = () => {
		this.setState({ showOptions: !this.state.showOptions });
		console.log(this.state.showOptions);
	};

	render() {
		let resultsToPrint;
		if (this.state.searchResults) {
			let searchResultsFiltered = this.state.searchResults.sort(
				(a, b) => {
					if (a.type === "virus") {
						if (b.type === "virus") {
							if (a.nameEn.value < b.nameEn.value) {
								return -1;
							} else {
								return 1;
							}
						} else {
							return -1;
						}
					}
					if (a.type === "disease") {
						if (b.type === "disease") {
							if (a.nameEn.value < b.nameEn.value) {
								return -1;
							} else {
								return 1;
							}
						} else {
							return 1;
						}
					}
					return 0;
				}
			);
			resultsToPrint = searchResultsFiltered.map((result) => {
				let name = result.nameFr
					? result.nameFr.value
					: result.nameEn.value;
				let comment;
				if (result.commentFr) {
					comment = result.commentFr.value;
				} else if (result.commentEn) {
					comment = result.commentEn.value;
				}
				let subStringSize = 200;
				if (name)
					return (
						<li className={result.type}>
							<h2>{result.type === "virus" ? "V" : "D"}</h2>
							<h3>{name}</h3>
							<p>
								{comment.length >= subStringSize
									? comment.substring(0, subStringSize) +
									  "..."
									: comment}
							</p>
							<a href={"/" + result.type + "/" + name}>
								<button>En savoir plus</button>
							</a>
						</li>
					);
			});
		}

		return (
			<React.Fragment>
				<div className="searcher-container">
					<div
						className={
							this.state.searching
								? "search-header topbar"
								: "search-header"
						}
					>
						<img src={logo} className="search-logo" alt="logo" />
						<div
							className={
								this.state.searching
									? "search-text-container topbar"
									: "search-text-container"
							}
							onClick={this.handleTitleClick}
						>
							<h2 className="search-title">
								The <br />
								Disease
								<br /> Searcher
							</h2>
							<p>By the HexaOne Team</p>
						</div>

						<div
							className={
								this.state.searching
									? "autocomplete home-search-bar topbar"
									: "autocomplete home-search-bar"
							}
						>
							<input
								className="home-search"
								type="text"
								name="search"
								id="search"
								placeholder="Rechercher une maladie. ex:coronavirus"
								ref={(input) => (this.search = input)}
								onKeyDown={this.handleInputChange}
							/>
							<div
								className="search-options"
								onClick={this.handleOptionClick}
							>
								<span class="material-icons blue">tune</span>
							</div>
						</div>
						<div
							id={
								this.state.showOptions
									? "search-options-container"
									: "hidden"
							}
						>
							<label className="switch">
								<input
									type="checkbox"
									id="disease"
									defaultChecked={this.state.diseaseChecked}
									onChange={this.handleCheckboxDisease}
								/>
								<span className="slider round blue" />
								<label className="label" htmlFor="disease">
									Disease
								</label>
							</label>
							<label className="switch">
								<input
									type="checkbox"
									id="virus"
									defaultChecked={this.state.virusChecked}
									onChange={this.handleCheckboxVirus}
								/>
								<span className="slider round green" />
								<label className="label" htmlFor="virus">
									Virus
								</label>
							</label>
						</div>
					</div>
				</div>
				<div className="results-container">
					{this.state.searching &&
					this.state.searchResults.length === 0 ? (
						<h2>Pas de résultats</h2>
					) : (
						<React.Fragment />
					)}
					<ul className="tilesWrap">{resultsToPrint}</ul>
				</div>
			</React.Fragment>
		);
	}
}

export default Search;
