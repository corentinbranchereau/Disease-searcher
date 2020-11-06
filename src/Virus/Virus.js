import React from "react";

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

	render() {
		return this.state.virus.length === 0 ? (
			<h1>Chargement des ressources</h1>
		) : (
			<div>
				<h1>{this.state.virus.name.value}</h1>
				<img src={this.state.virus.image.value} alt="hola" />
			</div>
		);
	}
}

export default Virus;
