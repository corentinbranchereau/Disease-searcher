import { SparqlEndpointFetcher } from "fetch-sparql-endpoint";

const endpointUrl_wikidata = "https://query.wikidata.org/sparql";
const endpointUrl_disgenet = "http://rdf.disgenet.org/sparql/";

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

export function fetchAllInfosGenes(idD) {
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

  LIMIT 10
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
	let meshId = "<" + "http://id.nlm.nih.gov/mesh/" + idD + ">";
	const sparqlQuery =
		`SELECT DISTINCT ?gene ?scoreValue (SAMPLE(?desc) AS ?description)
			WHERE {
				?disease skos:exactMatch ` +
		meshId +
		`.
				?gda sio:SIO_000628 ?disease, ?gene;
				sio:SIO_000216 ?score;
				dcterms:description ?desc.
				?score sio:SIO_000300 ?scoreValue.
				FILTER(?gene != ?disease).
				FILTER(langmatches(lang(?desc),"en")).
			} GROUP BY ?gene ?scoreValue ORDER BY DESC(?scoreValue) LIMIT 10`;

	const fullUrl =
		endpointUrl_disgenet + "?query=" + encodeURIComponent(sparqlQuery);
	const headers = { Accept: "application/sparql-results+json" };

	return fetch(fullUrl, { headers })
		.then((body) => body.json())
		.then((r) => r.results.bindings);
}
