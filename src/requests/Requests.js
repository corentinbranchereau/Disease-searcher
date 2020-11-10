//import { SparqlEndpointFetcher } from "fetch-sparql-endpoint";

export async function fetchSearchResultsFromMesh(userEntry, onResultsFound) {
	try {
		let requestUrl =
			"http://id.nlm.nih.gov/mesh/sparql";
		let suffixUrl =
			"&inference=true&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+";
		let query =
            ` 
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX meshv: <http://id.nlm.nih.gov/mesh/vocab#>
            PREFIX mesh: <http://id.nlm.nih.gov/mesh/>
            PREFIX mesh2015: <http://id.nlm.nih.gov/mesh/2015/>
            PREFIX mesh2016: <http://id.nlm.nih.gov/mesh/2016/>
            PREFIX mesh2017: <http://id.nlm.nih.gov/mesh/2017/>
            PREFIX mesh2018: <http://id.nlm.nih.gov/mesh/2018/>
            PREFIX mesh2019: <http://id.nlm.nih.gov/mesh/2019/>
            PREFIX mesh2020: <http://id.nlm.nih.gov/mesh/2020/>
            PREFIX mesh2021: <http://id.nlm.nih.gov/mesh/2021/>

            SELECT ?dId ?mId ?label ?comment
            FROM <http://id.nlm.nih.gov/mesh>
            WHERE {
            ?descriptor a meshv:Descriptor;
            meshv:identifier ?dId;
            rdfs:label ?label;
            meshv:active 1;
            meshv:preferredConcept ?concept.
            ?concept meshv:identifier ?mId;
            meshv:scopeNote ?comment.
            FILTER(REGEX(?label,"corona","i"))
            }
            ORDER BY ?dId ?mId
                   `;
		fetch(requestUrl + query + suffixUrl)
			.then((res) => res.json())
			.then(
				(result) => {
					onResultsFound(result.results.bindings);
				},
				(error) => {
					console.log("Error : ", error);
				}
			);
	} catch (err) {
		console.log("somethin went wrong", err);
	}
}


export async function fetchSearchResultsDisease(userEntry, onResultsFound) {
	try {
		let requestUrl =
			"http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=";
		let suffixUrl =
			"&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+";
		let query =
			` SELECT ?s as ?search ?nameFr ?nameEn ?commentFr ?commentEn ?image
        WHERE {
            ?s a yago:Disease114070360;
            foaf:depiction ?image
            FILTER regex(?s, "` +
			userEntry +
			`", "i").
            OPTIONAL {
                ?s rdfs:label ?nameFr.
                FILTER(langMatches(lang(?nameFr), "fr")).
            }
            OPTIONAL {
                ?s rdfs:label ?nameEn.
                FILTER(langMatches(lang(?nameEn), "en")).
            }
            OPTIONAL {
                ?s rdfs:comment ?commentFr.
                FILTER(langMatches(lang(?commentFr), "fr")).
            }
            OPTIONAL {
                ?s rdfs:comment ?commentEn.
                FILTER(langMatches(lang(?commentEn), "en")).
            }
        } LIMIT 10 `;
		fetch(requestUrl + query + suffixUrl)
			.then((res) => res.json())
			.then(
				(result) => {
					onResultsFound(result.results.bindings, "disease");
				},
				(error) => {
					console.log("Error : ", error);
				}
			);
	} catch (err) {
		console.log("somethin went wrong", err);
	}
}

export async function fetchSearchResultsVirus(userEntry, onResultsFound) {
	try {
		let requestUrl =
			"http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=";
		let suffixUrl =
			"&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+";
		let query =
			`
        SELECT ?s as ?search ?nameFr ?nameEn ?commentFr ?commentEn ?image
        WHERE {
            ?s a yago:Virus101328702;
            foaf:depiction ?image.
            FILTER regex(?s, "` +
			userEntry +
			`", "i").
            OPTIONAL {
                ?s rdfs:label ?nameFr.
                FILTER(langMatches(lang(?nameFr), "fr")).
            }
            OPTIONAL {
                ?s rdfs:label ?nameEn.
                FILTER(langMatches(lang(?nameEn), "en")).
            }
            OPTIONAL {
                ?s rdfs:comment ?commentFr.
                FILTER(langMatches(lang(?commentFr), "fr")).
            }
            OPTIONAL {
                ?s rdfs:comment ?commentEn.
                FILTER(langMatches(lang(?commentEn), "en")).
            }
        } LIMIT 10`;
		fetch(requestUrl + query + suffixUrl)
			.then((res) => res.json())
			.then(
				(result) => {
					onResultsFound(result.results.bindings, "virus");
				},
				(error) => {
					console.log("Error : ", error);
				}
			);
	} catch (err) {
		console.log("somethin went wrong", err);
	}
}

// export async function fetchSearchResultsDiseaseAndVirus(
//   userEntry,
//   onResultsFound
// ) {
//   try {
//     const myFetcher = new SparqlEndpointFetcher();
//     const bindingsStream = await myFetcher.fetchBindings(
//       "https://dbpedia.org/sparql",
//       `
//         SELECT ?s as ?search ?nameFr ?nameEn ?commentFr ?commentEn ?image
//         WHERE {
//             { {?s a yago:Virus101328702.}
//             UNION
//             {?s a dbo:Disease.} }
//             FILTER regex(?s, "` +
//         userEntry +
//         `", "i").
//             OPTIONAL {
//                 ?s rdfs:label ?nameFr.
//                 FILTER(langMatches(lang(?nameFr), "fr")).
//             }
//             OPTIONAL {
//                 ?s rdfs:label ?nameEn.
//                 FILTER(langMatches(lang(?nameEn), "en")).
//             }
//             OPTIONAL {
//                 ?s rdfs:comment ?commentFr.
//                 FILTER(langMatches(lang(?commentFr), "fr")).
//             }
//             OPTIONAL {
//                 ?s rdfs:comment ?commentEn.
//                 FILTER(langMatches(lang(?commentEn), "en")).
//             }
//             ?s foaf:depiction ?image.
//         } LIMIT 10`
//     );
//     bindingsStream.on("data", (bindings) => {
//       onResultsFound(bindings,"both");
//     });
//   } catch (err) {
//     console.log("somethin went wrong", err);
//   }
// }

/*const myFetcher = new SparqlEndpointFetcher();
		const bindingsStream = await myFetcher.fetchBindings(ù
			"https://dbpedia.org/sparql",
			`
        SELECT ?s as ?search ?nameFr ?nameEn ?commentFr ?commentEn ?image
        WHERE {
            ?s a yago:Disease114070360;
            foaf:depiction ?image
            FILTER regex(?s, "` +
				userEntry +
				`", "i").
            OPTIONAL {
                ?s rdfs:label ?nameFr.
                FILTER(langMatches(lang(?nameFr), "fr")).
            }
            OPTIONAL {
                ?s rdfs:label ?nameEn.
                FILTER(langMatches(lang(?nameEn), "en")).
            }
            OPTIONAL {
                ?s rdfs:comment ?commentFr.
                FILTER(langMatches(lang(?commentFr), "fr")).
            }
            OPTIONAL {
                ?s rdfs:comment ?commentEn.
                FILTER(langMatches(lang(?commentEn), "en")).
            }
        } LIMIT 10 `
		);
		bindingsStream.on("data", (bindings) => {
			onResultsFound(bindings, "disease");
    });*/

/*   const myFetcher = new SparqlEndpointFetcher();
		const bindingsStream = await myFetcher.fetchBindings(
			"https://dbpedia.org/sparql",
			`
        SELECT ?s as ?search ?nameFr ?nameEn ?commentFr ?commentEn ?image
        WHERE {
            ?s a yago:Virus101328702;
            foaf:depiction ?image.
            FILTER regex(?s, "` +
				userEntry +
				`", "i").
            OPTIONAL {
                ?s rdfs:label ?nameFr.
                FILTER(langMatches(lang(?nameFr), "fr")).
            }
            OPTIONAL {
                ?s rdfs:label ?nameEn.
                FILTER(langMatches(lang(?nameEn), "en")).
            }
            OPTIONAL {
                ?s rdfs:comment ?commentFr.
                FILTER(langMatches(lang(?commentFr), "fr")).
            }
            OPTIONAL {
                ?s rdfs:comment ?commentEn.
                FILTER(langMatches(lang(?commentEn), "en")).
            }
        } LIMIT 10`
		);
		bindingsStream.on("data", (bindings) => {
			onResultsFound(bindings, "virus");
		});*/
