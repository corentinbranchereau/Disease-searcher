import { SparqlEndpointFetcher } from "fetch-sparql-endpoint";

export async function fetchAutoCompletionDiseaseAndVirus(
  userEntry,
  onResultsFound
) {
  try {
    const myFetcher = new SparqlEndpointFetcher();
    const bindingsStream = await myFetcher.fetchBindings(
      "https://dbpedia.org/sparql",
      `
        SELECT ?s as ?search ?namefr ?nameen ?image
        WHERE {
            { {?s a yago:Virus101328702.}
            UNION
            {?s a dbo:Disease.} }
            FILTER regex(?s, "` +
        userEntry +
        `", "i").
            OPTIONAL {
                ?s rdfs:label ?namefr.
                FILTER(langMatches(lang(?namefr), "fr")).
            }
            OPTIONAL {
                ?s rdfs:label ?nameen.
                FILTER(langMatches(lang(?nameen), "en")).
            }
            ?s foaf:depiction ?image.
        } LIMIT 10`
    );
    bindingsStream.on("data", (bindings) => {
      onResultsFound(bindings);
    });
  } catch (err) {
    console.log("somethin went wrong", err);
  }
}

export async function fetchAutoCompletionDisease(userEntry, onResultsFound) {
  try {
    const myFetcher = new SparqlEndpointFetcher();
    const bindingsStream = await myFetcher.fetchBindings(
      "https://dbpedia.org/sparql",
      `
        SELECT ?s as ?search ?namefr ?nameen ?image
        WHERE {
            ?s a dbo:Disease;
            foaf:depiction ?image
            FILTER regex(?s, "` +
        userEntry +
        `", "i").
            OPTIONAL {
                ?s rdfs:label ?namefr.
                FILTER(langMatches(lang(?namefr), "fr")).
            }
            OPTIONAL {
                ?s rdfs:label ?nameen.
                FILTER(langMatches(lang(?nameen), "en")).
            }
        } LIMIT 10 `
    );
    bindingsStream.on("data", (bindings) => {
      onResultsFound(bindings);
    });
  } catch (err) {
    console.log("somethin went wrong", err);
  }
}

export async function fetchAutoCompletionVirus(userEntry, onResultsFound) {
  try {
    const myFetcher = new SparqlEndpointFetcher();
    const bindingsStream = await myFetcher.fetchBindings(
      "https://dbpedia.org/sparql",
      `
        SELECT ?s as ?search ?namefr ?nameen ?image
        WHERE {
            ?s a yago:Virus101328702;
            foaf:depiction ?image.
            FILTER regex(?s, "` +
        userEntry +
        `", "i").
            OPTIONAL {
                ?s rdfs:label ?namefr.
                FILTER(langMatches(lang(?namefr), "fr")).
            }
            OPTIONAL {
                ?s rdfs:label ?nameen.
                FILTER(langMatches(lang(?nameen), "en")).
            }
        } LIMIT 10`
    );
    bindingsStream.on("data", (bindings) => {
      onResultsFound(bindings);
    });
  } catch (err) {
    console.log("somethin went wrong", err);
  }
}

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
