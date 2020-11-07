import React from "react";
import { fetchAutoCompletionDiseaseAndVirus } from "../requests/Requests";
import { fetchAutoCompletionDisease } from "../requests/Requests";
import { fetchAutoCompletionVirus } from "../requests/Requests";
import "./Search.css";
//import logo from "../logo.png";

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
      fetchAutoCompletionDiseaseAndVirus(this.state.query, this.handleResults);
    } else if (this.state.diseaseChecked) {
      fetchAutoCompletionDisease(this.state.query, this.handleResults);
    } else if (this.state.virusChecked) {
      fetchAutoCompletionVirus(this.state.query, this.handleResults);
    }
  };

  handleResults = (result) => {
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
    //<p>{result.comment.value}</p>
    if (this.state.searchResults) {
      resultsToPrint = this.state.searchResults.map((result) => {
        let name = result.namefr ? result.namefr.value : result.nameen.value;
        if (name)
          return (
            <div className="results">
              <h1>{name}</h1>
              <img src={result.image.value} alt={name} />
            </div>
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
                <span className="slider round" />
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
                <span className="slider round" />
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
          {resultsToPrint}
        </div>
      </React.Fragment>
    );
  }
}

export default Search;
