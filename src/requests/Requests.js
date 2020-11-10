//import { SparqlEndpointFetcher } from "fetch-sparql-endpoint";

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
					onResultsFound(result.results.bindings, userEntry);
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
					onResultsFound(result.results.bindings, userEntry);
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
