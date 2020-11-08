import React from "react";
import "./Virus.css";

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
            ?virus foaf:depiction ?image;
            dbo:family ?family.
            ?family <http://purl.org/linguistics/gold/hypernym> dbr:Family.
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

	render() {
		return this.state.virus.length === 0 ? (
			<h1>Chargement des ressources</h1>
		) : (
			<React.Fragment>
				<button id="language" onClick={this.changeLanguage}>
					{this.state.language}
				</button>
				{this.state.language === "en" ? (
					<table>
						<thead>
							<tr>
								<th colSpan="2">Identification</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Name</td>
								<td>{this.state.virus.name.value}</td>
							</tr>
							<tr>
								<td>Image</td>
								<td class="img-td">
									<img
										src={this.state.virus.image.value}
										alt=""
									></img>
								</td>
							</tr>
							{this.state.virus.descriptionEn ===
							undefined ? null : (
								<tr>
									<td>Description</td>
									<td>
										{this.state.virus.descriptionEn.value}
									</td>
								</tr>
							)}
							{this.state.virus.familyNameEn ===
							undefined ? null : (
								<tr>
									<td>Virus family</td>
									<td>
										{this.state.virus.familyNameEn.value}
									</td>
								</tr>
							)}
							{this.state.virus.subFamilyNameEn === undefined ? (
								""
							) : (
								<tr>
									<td>Virus subfamily(ies)</td>
									<td>
										{this.state.virus.subFamilyNameEn.value}
									</td>
								</tr>
							)}
							{this.state.virus.orderNameEn ===
							undefined ? null : (
								<tr>
									<td>Order</td>
									<td>
										{this.state.virus.orderNameEn.value}
									</td>
								</tr>
							)}
						</tbody>
					</table>
				) : (
					<table>
						<thead>
							<tr>
								<th colSpan="2">Identification</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Nom</td>
								<td>{this.state.virus.name.value}</td>
							</tr>
							<tr>
								<td>Image</td>
								<td class="img-td">
									<img
										src={this.state.virus.image.value}
										alt=""
									></img>
								</td>
							</tr>
							{this.state.virus.descriptionFr ===
							undefined ? null : (
								<tr>
									<td>Description</td>
									<td>
										{this.state.virus.descriptionFr.value}
									</td>
								</tr>
							)}
							{this.state.virus.familyNameFr ===
							undefined ? null : (
								<tr>
									<td>Famille du virus</td>
									<td>
										{this.state.virus.familyNameFr.value}
									</td>
								</tr>
							)}
							{this.state.virus.subFamilyNameFr ===
							undefined ? null : (
								<tr>
									<td>Sous-famille(s) du virus</td>
									<td>
										{this.state.virus.subFamilyNameFr.value}
									</td>
								</tr>
							)}
							{this.state.virus.orderNameFr ===
							undefined ? null : (
								<tr>
									<td>Ordre</td>
									<td>
										{this.state.virus.orderNameFr.value}
									</td>
								</tr>
							)}
						</tbody>
					</table>
				)}
			</React.Fragment>
		);
	}
}

export default Virus;
