import React from "react";
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
			typing: false, //defines if the input bar has focus (ie: the user is going to type)
			diseaseChecked: true, //define if the checkbox disease is checked or not
			virusChecked: true, //define if the checkbox virus is checked or not
			showOptions: false, // define if you can see the search options
		};
	}

	fetchData = (valueToSearch) => {
		if (this.state.diseaseChecked && this.state.virusChecked) {
			fetchSearchResultsDisease(valueToSearch, this.handleResults);
			fetchSearchResultsVirus(valueToSearch, this.handleResults);
		} else if (this.state.diseaseChecked) {
			fetchSearchResultsDisease(valueToSearch, this.handleResults);
		} else if (this.state.virusChecked) {
			fetchSearchResultsVirus(valueToSearch, this.handleResults);
		}
	};

	handleResults = (results, queryResponded) => {
		if (queryResponded === this.state.query) {
			//verifying that the response corresponds to the displayed search word
			this.setState({ searchResults: [] });
			results.map((result) => {
				let tmpSearchResults = this.state.searchResults;
				tmpSearchResults.push(result);
				this.setState({ searchResults: tmpSearchResults });
				return 1;
			});
		}
	};

	handleInputChange = () => {
		this.setState({ query: this.search.value });
		this.fetchData(this.search.value);
	};
	handleKeyDown = (event) => {
		if (event.key === "Enter") {
			this.setState({ searching: true });
		}
	};

	handleTyping(typing) {
		this.setState({ typing });
	}

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
		let resultsSuggestions;
		if (this.state.searchResults) {
			let searchResultsFiltered = this.state.searchResults.sort(
				(a, b) => {
					let nameA = a.nameFr ? a.nameFr.value : a.nameEn.value;
					let nameB = b.nameFr ? b.nameFr.value : b.nameEn.value;
					return nameA < nameB;
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
				if (name) {
					return (
						<li className="disease" key={name}>
							<h2>{name.charAt(0).toUpperCase()}</h2>
							<h3>{name}</h3>
							<p>
								{comment.length >= subStringSize
									? comment.substring(0, subStringSize) +
									  "..."
									: comment}
							</p>
							<a href={"/disease/" + name}>
								<button>En savoir plus</button>
							</a>
						</li>
					);
				}
				return <React.Fragment />;
			});
			if (this.state.typing && this.state.query !== "") {
				resultsSuggestions = searchResultsFiltered.map((result) => {
					let nameEN = result.nameEn.value;
					let index = nameEN.indexOf(this.state.query);
					let wordList;
					if (index !== -1) {
						wordList = result;
					}
					return (
						<div className="suggestion-single-result">{nameEN}</div>
					);
				});
			}
		}

		return (
			<React.Fragment>
				<div
					className="searcher-container"
					style={
						this.state.searching
							? { overflow: "scroll" }
							: { maxHeight: "100vh", overflow: "hidden" }
					}
				>
					<div
						className={
							this.state.searching
								? "search-header topbar"
								: "search-header"
						}
					>
						<img
							onClick={this.handleTitleClick}
							src={logo}
							className="search-logo"
							alt="logo"
						/>
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
								value={this.state.value}
								placeholder="Rechercher une maladie. ex: coronavirus"
								autoComplete="off"
								ref={(input) => (this.search = input)}
								onKeyDown={this.handleKeyDown}
								onChange={this.handleInputChange}
								onFocus={() => this.handleTyping(true)}
								onBlur={() => this.handleTyping(true)}
							/>
							<div
								className="search-options"
								onClick={this.handleOptionClick}
							>
								<span className="material-icons blue">
									tune
								</span>
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
				<div className="suggestion-results">{resultsSuggestions}</div>

				<div className="results-container">
					{this.state.searching &&
					this.state.searchResults.length === 0 ? (
						<h2 style={{ textAlign: "center" }}>
							Pas de résultats
						</h2>
					) : (
						<React.Fragment />
					)}
					{this.state.searching ? (
						<ul className="tilesWrap">{resultsToPrint}</ul>
					) : (
						<React.Fragment />
					)}
				</div>
			</React.Fragment>
		);
	}
}

export default Search;
