//import { SparqlEndpointFetcher } from "fetch-sparql-endpoint";

export async function fetchSearchResultsFromMesh(userEntry, onResultsFound) {
	try {
		let requestUrl = "https://id.nlm.nih.gov/mesh/sparql?query=";
		let suffixUrl =
			"&format=JSON&year=current&limit=50&offset=0&inference=true";
		let query =
			`PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
		    PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>
            PREFIX owl:<http://www.w3.org/2002/07/owl#>
            PREFIX meshv:<http://id.nlm.nih.gov/mesh/vocab#>
            
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
              FILTER(REGEX(?label,"` +
			userEntry +
			`","i")).
            }
            ORDER BY ?dId ?mId`;
		let encodedQuery = encodeURIComponent(query);
		fetch(requestUrl + encodedQuery + suffixUrl)
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
import { SparqlEndpointFetcher } from "fetch-sparql-endpoint";

const endpointUrl_wikidata = "https://query.wikidata.org/sparql";
const endpointUrl_disgenet = "http://rdf.disgenet.org/sparql/"


export async function fetchByVirusName(virusName, onResultsFound) {
	try {
		const myFetcher = new SparqlEndpointFetcher();
		const bindingsStream = await myFetcher.fetchBindings(
			"https://dbpedia.org/sparql",
			`
        SELECT ?virus ?name ?virusFamily ?comment ?image
        WHERE {
        ?virusFamily dct:subject dbc:Virus_families.
        ?virus dbo:family ?virusFamily;
        rdfs:label ?name;
        rdfs:comment ?comment;
        foaf:depiction ?image.
        FILTER regex(lcase(?name), "` +
				virusName +
				`").
        FILTER langMatches(lang(?name), "en").
        FILTER langMatches(lang(?comment), "fr").
        } ORDER BY ASC (?virus)
        `
		);
		bindingsStream.on("data", (bindings) => {
			onResultsFound(bindings);
		});
	} catch (err) {
		console.log("somethin went wrong", err);
	}
}

export function fetchAllInfosGenes(idD, idM, name, lang) {
	//TODO Vérifier les caratères spéciaux dans id et name

	const sparqlQueryDisgenet =
		`
  SELECT DISTINCT ?gene ?geneName ?disease2 ?diseaseName2 ?meshURL
  WHERE {
    ?gda sio:SIO_000628 ?disease,?gene .
          ?disease skos:exactMatch <http://id.nlm.nih.gov/mesh/` +
		idD +
		`> .
    ?gda2 sio:SIO_000628 ?disease2,?gene .
    ?disease dcterms:title ?diseaseName .
    ?disease2 dcterms:title ?diseaseName2 .
          ?disease2 skos:exactMatch ?meshURL.
  ?gene dcterms:title ?geneName.
    FILTER regex(?gene, "ncbigene")
    FILTER regex(?disease, "umls/id")
    FILTER regex(?disease2, "umls/id")
          FILTER regex(?meshURL, ".gov/mesh")
    FILTER (?disease != ?disease2)
    FILTER (?gda != ?gda2)
  }
  LIMIT 50
`;

	const fullUrl =
		endpointUrl_disgenet +
		"?query=" +
		encodeURIComponent(sparqlQueryDisgenet);
	const headers = { Accept: "application/sparql-results+json" };

	return fetch(fullUrl, { headers })
		.then((body) => body.json())
		.then((r) => r.results.bindings);
}



export function fetchAllInfos(idD, idM, name, lang) {
	//TODO Vérifier les caratères spéciaux dans id et name
	const sparqlQuery =
		`SELECT DISTINCT ?p ?propLabel ?v ?vLabel WHERE {

    {

      SELECT ?m WHERE {
        {
          ?m wdt:P486 ?a .
          FILTER( ?a = "` +
		idD +
		`" ).
        }
        UNION
        {
          ?m wdt:P6694 ?b .
          FILTER( ?b = "` +
		idM +
		`" ).
        }
        UNION
        {
          ?m rdfs:label "` +
		name +
		`"@en
        }
        UNION
        {
          ?m skos:altLabel "` +
		name +
		`"@en.
        }
      } ORDER BY desc(?a) desc(?b) ?m LIMIT 1

    }

    OPTIONAL {
    { ?m ?p ?v . } MINUS {
    ?m ?p ?v
    FILTER( LANG(?v) != "" && !LANGMATCHES(LANG(?v), "` +
		lang +
		`") ) .
    } }

    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }

    OPTIONAL {
      ?prop wikibase:directClaim ?p .
      ?prop rdfs:label ?propLabel.
      filter(lang(?propLabel) = "` +
		lang +
		`").
    }

    OPTIONAL {
      ?v rdfs:label ?vLabel.
      FILTER(LANG(?vLabel) = "` +
		lang +
		`").
    }

    } ORDER BY ?m ?p`;

	const fullUrl =
		endpointUrl_wikidata + "?query=" + encodeURIComponent(sparqlQuery);
	const headers = { Accept: "application/sparql-results+json" };

	return fetch(fullUrl, { headers })
		.then((body) => body.json())
		.then((r) => r.results.bindings);
}

export function fetchAssociatedGenesOnDisgenet(idD) {
		// eslint-disable-next-line no-useless-concat
	let meshId = "<"+"http://id.nlm.nih.gov/mesh/"+idD+">";
	const sparqlQuery =
			`SELECT DISTINCT ?gene ?scoreValue (SAMPLE(?desc) AS ?description)
			WHERE { 
				?disease skos:exactMatch `+meshId+`. 
				?gda sio:SIO_000628 ?disease, ?gene;
				sio:SIO_000216 ?score;
				dcterms:description ?desc.
				?score sio:SIO_000300 ?scoreValue.
				FILTER(?gene != ?disease).		
				FILTER(langmatches(lang(?desc),"en")).				
            } GROUP BY ?gene ?scoreValue ORDER BY DESC(?scoreValue) LIMIT 10`;
        try{
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

/*		const fullUrl =
			endpointUrl_disgenet + "?query=" + encodeURIComponent(sparqlQuery);
		const headers = {Accept: "application/sparql-results+json"};

		return fetch(fullUrl, {headers})
			.then((body) => body.json())
			.then((r) => r.results.bindings);
	}*/
