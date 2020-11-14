import React from "react";
import { fetchSearchResultsFromMesh } from "../requests/Requests";
import "./Search.css";
import logo from "../logo-hexa.png";

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
			loading: false, //defines if
		};
	}

	fetchData = (valueToSearch) => {
		this.setState({ loading: true });
		fetchSearchResultsFromMesh(valueToSearch, this.handleResults);
	};

	handleResults = (results, queryResponded) => {
		if (queryResponded === this.state.query) {
			this.setState({ loading: false });
			// console.log(results);
			//verifying that the response corresponds to the displayed search word
			this.setState({ searchResults: results });
		}
	};

	handleInputChange = () => {
		this.setState({ query: this.search.value, searchResults: [] });
		if (this.search.value === "") {
			this.setState({ searching: false });
		} else {
			this.fetchData(this.search.value);
		}
	};
	handleKeyDown = (event) => {
		console.log(event);
		if (event.key === "Enter") {
			this.setState({ searching: true });
			this.search.blur();
		}
		if (event.key === "Unidentified") {
			this.setState({ searching: true });
			this.search.blur();
			let tab = this.state.searchResults;
			setTimeout(() => {
				const entity = tab.find((element) => {
					if (
						element.label.value.toLowerCase() ===
						this.state.query.toLocaleLowerCase()
					) {
						return true;
					}
					return false;
				});
				let href = "/entity/";
				if (entity) {
					if (entity.label.value) {
						href += entity.label.value + "/";
						if (entity.dId.value) {
							href += entity.dId.value + "/";
							if (entity.mId.value) {
								href += entity.mId.value;
							}
						}
					}
				}
				let link = encodeURI(href);
				this.props.history.push(link);
			}, 200);
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

	handleRedirect = (link, comment) => {
		localStorage.setItem("entityDescription", comment);
		this.props.history.push(link);
	};

	render() {
		let resultsToPrint;
		let resultsSuggestions;
		if (this.state.searchResults.length > 0) {
			let searchResultsFiltered = this.state.searchResults.sort(
				(a, b) => {
					let nameA = a.label.value.toLowerCase();
					let nameB = b.label.value.toLowerCase();
					let recherche = this.state.query.toLowerCase();
					let indexA = nameA.indexOf(recherche);
					let indexB = nameB.indexOf(recherche);
					if (indexA < indexB) return -1;
					if (indexA > indexB) return 1;
					if (indexA === indexB) return 0;
					return 0;
				}
			);
			resultsToPrint = searchResultsFiltered.map((result) => {
				let name = result.label.value;
				let comment = result.comment.value;
				let subStringSize = 200;
				let href = "/entity/";
				if (name) {
					href += name + "/";
					if (result.dId.value) {
						href += result.dId.value + "/";
						if (result.mId.value) {
							href += result.mId.value;
						}
					}
				}
				let link = encodeURI(href);
				if (name && !this.state.loading) {
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
							<button
								onClick={() =>
									this.handleRedirect(link, comment)
								}
							>
								En savoir plus
							</button>
						</li>
					);
				}
				return <React.Fragment />;
			});
			if (this.state.typing && this.state.query !== "") {
				resultsSuggestions = searchResultsFiltered
					.slice(0, 10)
					.map((result) => {
						if (result.label) {
							let nameEN = result.label.value.toLowerCase();
							let recherche = this.state.query.toLowerCase();
							let index = nameEN.indexOf(recherche);
							//let wordList;
							if (index !== -1) {
								//wordList = nameEN.split(this.state.query, 2);
								return (
									<option
										// className="suggestion-single-result"
										key={nameEN}
										value={nameEN}
									/>

									// {wordList[0]}
									// <span style={{ fontWeight: 900 }}>
									// 	{this.state.query}
									// </span>
									// {wordList[1]}
								);
							} else {
								return (
									<option
										// className="suggestion-single-result"
										key={nameEN}
										value={nameEN}
									/>
								);
							}
						}
						return <React.Fragment />;
					});
			}
		} else {
			let emptyArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
			resultsToPrint = emptyArray.map((empty) => {
				return <li className="disease" key={empty}></li>;
			});
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
								list="suggestion-results"
								ref={(input) => (this.search = input)}
								onKeyDown={this.handleKeyDown}
								onChange={this.handleInputChange}
								onFocus={() => this.handleTyping(true)}
								onBlur={() => this.handleTyping(true)}
							/>
							{this.state.loading &&
							!this.state.searching &&
							this.state.query !== "" ? (
								<div className="lds-ellipsis">
									<div></div>
									<div></div>
									<div></div>
									<div></div>
								</div>
							) : (
								<React.Fragment />
							)}
							{/* <div
								className="search-options"
								onClick={this.handleOptionClick}
							>
								<span className="material-icons blue">
									tune
								</span>
							</div> */}
						</div>
						{/* <div
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
						</div> */}
					</div>
				</div>
				<datalist id="suggestion-results" onClick={this.handleKeyDown}>
					{resultsSuggestions}
				</datalist>

				<div className="results-container">
					{this.state.searching &&
					!this.state.loading &&
					this.state.searchResults.length === 0 ? (
						<h2 style={{ textAlign: "center" }}>
							Pas de résultats
						</h2>
					) : this.state.searching ? (
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
