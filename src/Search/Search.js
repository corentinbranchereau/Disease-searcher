import React from "react";
import {
	fetchReversedSearchResult,
	fetchSearchResultsFromMesh,
} from "../requests/Requests";
import "./Search.css";
import logo from "../logo-hexa.png";

class Search extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchResults: [], // an array where the results found are added
			query: "", // the text typed into the search input
			searching: false, // true if the "Rechercher" button has been pressed once
			typing: false, // true if the input bar has focus (ie: the user is going to type)
			reverseSearch: false, // true if the checkbox disease is checked or not
			virusChecked: true, // true if the checkbox virus is checked or not
			showOptions: false, // true if you can see the search options
			loading: false, // true if the page is loading
			queryParam: window.location.search.split("=")[1],
		};
	}

	componentDidMount = () => {
		if (this.state.queryParam) {
			this.setState({ query: this.state.queryParam, searching: true });
			this.fetchData(this.state.queryParam, false);
			this.search.value = this.state.queryParam;
		}
	};

	fetchData = (valueToSearch, reverseSearch) => {
		this.setState({ loading: true });
		if (reverseSearch) {
			fetchReversedSearchResult(valueToSearch, this.handleResults);
		} else {
			fetchSearchResultsFromMesh(valueToSearch, this.handleResults);
		}
	};

	handleResults = (results, queryResponded) => {
		if (queryResponded === this.state.query) {
			//verifying that the response corresponds to the displayed search word
			this.setState({ loading: false });
			this.setState({ searchResults: results });
		}
	};

	handleInputChange = () => {
		this.setState({ query: this.search.value, searchResults: [] });
		if (this.search.value === "") {
			this.setState({ searching: false });
			this.props.history.push("/");
		} else {
			this.fetchData(this.search.value, this.state.reverseSearch);
		}
	};

	handleKeyDown = (event) => {
		if (event.key === "Enter") {
			this.setState({ searching: true });
			this.search.blur();
			this.props.history.push({
				pathname: "/",
				search: `?query=` + this.search.value,
			});
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
				this.props.history.push(href);
			}, 200);
		}
	};

	handleTyping(typing) {
		this.setState({ typing });
	}

	handleCheckboxSearch = () => {
		let checked = !this.state.reverseSearch;
		this.setState({ reverseSearch: checked });
		if (this.state.searching) {
			this.setState({ query: this.search.value, searchResults: [] });
			if (this.search.value === "") {
				this.setState({ searching: false });
			} else {
				this.fetchData(this.search.value, checked);
			}
		}
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
					let recherche = this.state.query.toLowerCase();
					if (this.state.reverseSearch) {
						let descA = a.comment.value.toLowerCase();
						let descB = b.comment.value.toLowerCase();
						let nbOccurenceA = descA.split(recherche).length - 1;
						let nbOccurenceB = descB.split(recherche).length - 1;
						if (nbOccurenceA < nbOccurenceB) return 1;
						if (nbOccurenceA > nbOccurenceB) return -1;
						if (nbOccurenceA === nbOccurenceB) {
							let indexA = descA.indexOf(recherche);
							let indexB = descB.indexOf(recherche);
							if (indexA < indexB) return -1;
							if (indexA > indexB) return 1;
							return 0;
						}
						return 0;
					} else {
						let nameA = a.label.value.toLowerCase();
						let nameB = b.label.value.toLowerCase();
						let indexA = nameA.indexOf(recherche);
						let indexB = nameB.indexOf(recherche);

						if (indexA < indexB) return -1;
						if (indexA > indexB) return 1;
						if (indexA === indexB) return 0;
						return 0;
					}
				}
			);
			resultsToPrint = searchResultsFiltered.map((result) => {
				let name = result.label.value;
				let comment = result.comment.value;
				if (this.state.reverseSearch) {
					let commentArray = result.comment.value
						.toLowerCase()
						.split(this.state.query.toLowerCase());
					comment = commentArray.map((comment, i) => {
						if (i === commentArray.length - 1) {
							return comment;
						} else {
							return (
								<React.Fragment
									key={comment + i + "ReactFragment"}
								>
									{comment}
									<span className="bold-desc">
										{this.state.query}
									</span>
								</React.Fragment>
							);
						}
					});
				} else {
					let nameArray = result.label.value
						.toLowerCase()
						.split(this.state.query.toLowerCase());
					name = nameArray.map((comment, i) => {
						if (i === nameArray.length - 1) {
							return comment;
						} else {
							return (
								<React.Fragment
									key={comment + i + "ReactFragment"}
								>
									{comment}
									<span className="bold-desc">
										{this.state.query}
									</span>
								</React.Fragment>
							);
						}
					});
				}

				let subStringSize = 200;
				let href = "/entity/";
				if (name) {
					href += result.label.value + "/";
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
						<li className="disease" key={result.label.value}>
							<h2>
								{result.label.value.charAt(0).toUpperCase()}
							</h2>
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
			if (
				this.state.typing &&
				this.state.query !== "" &&
				!this.state.reverseSearch
			) {
				resultsSuggestions = searchResultsFiltered
					.slice(0, 10)
					.map((result) => {
						if (result.label) {
							let nameEN = result.label.value.toLowerCase();
							let recherche = this.state.query.toLowerCase();
							let index = nameEN.indexOf(recherche);

							if (index !== -1) {
								return <option key={nameEN} value={nameEN} />;
							} else {
								return <option key={nameEN} value={nameEN} />;
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
							className={
								this.state.searching
									? "search-options-container topbar"
									: "search-options-container"
							}
						>
							<label className="switch">
								<input
									type="checkbox"
									id="disease"
									defaultChecked={this.state.reverseSearch}
									onChange={this.handleCheckboxSearch}
								/>
								<span className="slider round blue" />
								<label className="label" htmlFor="disease">
									Reverse Search
								</label>
							</label>
							<p className="reverse-description">
								With reverse search, you can search for a
								keyword describing the disease and get its name
							</p>
						</div>
					</div>
				</div>
				{!this.state.reverseSearch ? (
					<datalist
						id="suggestion-results"
						onClick={this.handleKeyDown}
					>
						{resultsSuggestions}
					</datalist>
				) : (
					<React.Fragment />
				)}

				<div
					className={this.state.searching ? "results-container" : ""}
				>
					{this.state.searching &&
					!this.state.loading &&
					this.state.searchResults.length === 0 ? (
						<h2 style={{ textAlign: "center" }}>
							Pas de résultats
						</h2>
					) : this.state.searching ? (
						<ul className="tilesWrap" key="tilesWrap">
							{resultsToPrint}
						</ul>
					) : (
						<React.Fragment />
					)}
				</div>
			</React.Fragment>
		);
	}
}

export default Search;
