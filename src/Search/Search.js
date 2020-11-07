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
      searched: false, // defines if the "Rechercher" button has been pressed once
      diseaseChecked: true, //define if the checkbox disease is checked or not
      virusChecked: true, //define if the checkbox virus is checked or not
    };
  }

  fetchData = () => {
    this.setState({ searched: true, searchResults: [] });
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

  handleResults = (result,type) => {
	result.type = type;
    let tmpSearchResults = this.state.searchResults;
    tmpSearchResults.push(result);
    this.setState({ searchResults: tmpSearchResults });
  };

  handleInputChange = () => {
    this.setState({ query: this.search.value });
  };

  handleCheckboxDisease = () => {
    let checked = !this.state.diseaseChecked;
    this.setState({ diseaseChecked: checked });
  };

  handleCheckboxVirus = () => {
    let checked = !this.state.virusChecked;
    this.setState({ virusChecked: checked });
  };

  render() {
    let resultsToPrint;
    if (this.state.searchResults) {
	  let searchResultsFiltered = this.state.searchResults.sort( (a,b) => {
		  if(a.type === "virus"){
			  return -1;
		  }
		  if(b.type === "disease"){
			  return 1;
		  }
		  return 0;
	  })
      resultsToPrint = searchResultsFiltered.map((result) => {
        let name = result.nameFr ? result.nameFr.value : result.nameEn.value;
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
              <h2>{result.type === "virus" ? "V" : "D" }</h2>
              <h3>{name}</h3>
              <p>
                {comment.length >= subStringSize
                  ? comment.substring(0, subStringSize) + "..."
                  : comment}
              </p>
			  <a href={'/'+ result.type + '/'+name} >
				<button>
					En savoir plus
				</button>
			  </a>
            </li>
            /*
          <div className="results">
            <h1>{name + "-" + result.type.value}</h1>
            <img src={result.image.value} alt={name} />
            {comment ? <p>{comment}</p> : <React.Fragment />}
          </div>
         */
          );
      });
    }

    return (
      <React.Fragment>
        <div className="searcher-container">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>The Disease Searcher, by the HexaOne Team</p>
            <div className="autocomplete">
              <input
                className="home-search"
                type="text"
                name="search"
                id="search"
                placeholder="Rechercher une maladie. ex:coronavirus"
                ref={(input) => (this.search = input)}
                onChange={this.handleInputChange}
              />
            </div>
            <div id="search-options-container">
              <button onClick={this.fetchData}>Rechercher</button>
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
          </header>
        </div>
        <div className="results-container">
          {this.state.searched && this.state.searchResults.length === 0 ? (
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
