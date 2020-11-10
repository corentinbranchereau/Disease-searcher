import React from "react";
import "./Virus.css";
import logo from "../logo2.svg";

class Virus extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			virusName: this.props.match.params.virusName,
			queryURL:
				"http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=",
			suffixURL:
				"&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+",
			virus: [],

			language: "fr",
			homepageLink: "http://localhost:3000/",
		};
	}

	componentDidMount() {
		let virusQuery =
			`
        SELECT * WHERE {
            ?virus a yago:Virus101328702;
            rdfs:label ?name.
            FILTER (?name = ` +
			this.state.virusName +
			`).
            OPTIONAL {
                ?virus dbo:abstract ?descriptionFr.
                FILTER (lang(?descriptionFr) = 'fr').
            }
            OPTIONAL {
                ?virus dbo:abstract ?descriptionEn.
                FILTER (lang(?descriptionEn) = 'en').
			}
			OPTIONAL {
				?virus foaf:depiction ?image.
			}
			?virus dbo:family ?family.
			OPTIONAL {
				?family <http://purl.org/linguistics/gold/hypernym> dbr:Family.
			}
            OPTIONAL {
                ?family rdfs:label ?familyNameFr.
                FILTER (lang(?familyNameFr) = 'fr').
            }
            OPTIONAL {
                ?family rdfs:label ?familyNameEn.
                FILTER (lang(?familyNameEn) = 'en').
            }
            OPTIONAL {
                ?subFamily dbo:family ?family;
                <http://purl.org/linguistics/gold/hypernym> dbr:Subfamilies.
                OPTIONAL {
                    ?subFamily rdfs:label ?subFamilyNameFr.
                    FILTER (lang(?subFamilyNameFr) = 'fr').
                }
                OPTIONAL {
                    ?subFamily rdfs:label ?subFamilyNameEn.
                    FILTER (lang(?subFamilyNameEn) = 'en').
                }
            }
            OPTIONAL {
                ?virus dbo:order ?order.
                OPTIONAL {
                    ?order rdfs:label ?orderNameFr.
                    FILTER (lang(?orderNameFr) = 'fr').
                }
                OPTIONAL {
                    ?order rdfs:label ?orderNameEn.
                    FILTER (lang(?orderNameEn) = 'en').
                }
            }
        }`;

		let encodedVirusQuery = encodeURI(virusQuery);
		fetch(this.state.queryURL + encodedVirusQuery + this.state.suffixURL)
			.then((res) => res.json())
			.then(
				(result) => {
					console.log(result);
					this.setState({
						virus: result.results.bindings[0],
					});
				},
				(error) => {
					console.log("Error : ", error);
				}
			);
	}

	changeLanguage = () => {
		this.state.language === "en"
			? this.setState({ language: "fr" })
			: this.setState({ language: "en" });
	};

	adaptVirusInfosWithLanguage() {
		let virusInfos = {};
		virusInfos["image"] = this.state.virus.image
			? this.state.virus.image.value
			: undefined;
		if (this.state.language === "en") {
			virusInfos["name"] = {
				tag: "Name",
				value: this.state.virus.name.value,
			};
			virusInfos["description"] = this.state.virus.descriptionEn
				? this.state.virus.descriptionEn.value
				: undefined;
			virusInfos["family"] = this.state.virus.familyNameEn
				? {
						tag: "Family",
						value: this.state.virus.familyNameEn.value,
				  }
				: undefined;
			virusInfos["subfamily"] = this.state.virus.subFamilyNameEn
				? {
						tag: "Subfamily(ies)",
						value: this.state.virus.subFamilyNameEn.value,
				  }
				: undefined;
			virusInfos["order"] = this.state.virus.orderNameEn
				? {
						tag: "Order",
						value: this.state.virus.orderNameEn.value,
				  }
				: undefined;
		} else {
			virusInfos["name"] = {
				tag: "Nom",
				value: this.state.virus.name.value,
			};
			virusInfos["description"] = this.state.virus.descriptionFr
				? this.state.virus.descriptionFr.value
				: undefined;
			virusInfos["family"] = this.state.virus.familyNameFr
				? {
						tag: "Famille",
						value: this.state.virus.familyNameFr.value,
				  }
				: undefined;
			virusInfos["subfamily"] = this.state.virus.subFamilyNameFr
				? {
						tag: "Sous-famille(s)",
						value: this.state.virus.subFamilyNameFr.value,
				  }
				: undefined;
			virusInfos["order"] = this.state.virus.orderNameFr
				? {
						tag: "Ordre",
						value: this.state.virus.orderNameFr.value,
				  }
				: undefined;
		}
		return virusInfos;
	}

	adaptLastBorder() {
		let noBottomBorderElements = Array.from(
			document.getElementsByClassName("no-bottom-border")
		);

		noBottomBorderElements.forEach((el) => {
			el.classList.remove("no-bottom-border");
		});

		let dtArray = document.getElementsByTagName("dt");
		let ddArray = document.getElementsByTagName("dd");
		let lastLargeItemIndex;
		for (let i = dtArray.length - 1; i >= 0; i--) {
			if (!dtArray[i].classList.contains("sm-item")) {
				lastLargeItemIndex = i;
				break;
			}
		}
		if (
			lastLargeItemIndex === dtArray.length - 1 ||
			(dtArray.length - 1 - lastLargeItemIndex) % 2 !== 0
		) {
			dtArray[dtArray.length - 1].classList.add("no-bottom-border");
			ddArray[dtArray.length - 1].classList.add("no-bottom-border");
		} else {
			dtArray[dtArray.length - 1].classList.add("no-bottom-border");
			ddArray[dtArray.length - 1].classList.add("no-bottom-border");
			dtArray[dtArray.length - 2].classList.add("no-bottom-border");
			ddArray[dtArray.length - 2].classList.add("no-bottom-border");
		}
	}

	componentDidUpdate() {
		this.adaptLastBorder();
	}

	handleTitleClick = () => {
		this.props.history.push(this.state.homepageLink);
	};

	render() {
		if (this.state.virus.length === 0) {
			return <h1>Chargement des ressources</h1>;
		} else {
			let virusInfos = this.adaptVirusInfosWithLanguage();

			return (
				<React.Fragment>
					<nav>
						<div id="nav-container">
							<div
								id="nav-text"
								onClick={this.handleTitleClick}
								title="Go to homepage"
							>
								<h2>
									The <br />
									Disease
									<br /> Searcher
								</h2>
								<p>By the HexaOne Team</p>
							</div>
							<img
								onClick={this.handleTitleClick}
								src={logo}
								id="logo"
								alt="logo"
								title="Go to homepage"
							/>
							<button id="language" onClick={this.changeLanguage}>
								{this.state.language}
							</button>
						</div>
					</nav>

					<div className="header">
						<h1>{virusInfos.name.value}</h1>
						<img src={virusInfos.image} alt=""></img>
					</div>
					<div className="info-table">
						<div className="info-table-header">
							<h1>IDENTIFICATION</h1>
						</div>
						<div className="info-table-body">
							<dl className="grid-container">
								<dt>{virusInfos.name.tag}</dt>
								<dd>{virusInfos.name.value}</dd>
								{virusInfos.description === undefined ? null : (
									<React.Fragment>
										<dt>Description</dt>
										<dd>{virusInfos.description}</dd>
									</React.Fragment>
								)}
								{virusInfos.family === undefined ? null : (
									<React.Fragment>
										<dt className="sm-item">
											{virusInfos.family.tag}
										</dt>
										<dd className="sm-item">
											{virusInfos.family.value}
										</dd>
									</React.Fragment>
								)}
								{virusInfos.subfamily === undefined ? null : (
									<React.Fragment>
										<dt className="sm-item">
											{virusInfos.subfamily.tag}
										</dt>
										<dd className="sm-item">
											{virusInfos.subfamily.value}
										</dd>
									</React.Fragment>
								)}
								{virusInfos.order === undefined ? null : (
									<React.Fragment>
										<dt className="sm-item">
											{virusInfos.order.tag}
										</dt>
										<dd className="sm-item">
											{virusInfos.order.value}
										</dd>
									</React.Fragment>
								)}
							</dl>
						</div>
					</div>
				</React.Fragment>
			);
		}
	}
}

export default Virus;
