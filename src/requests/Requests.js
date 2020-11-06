import {SparqlEndpointFetcher} from "fetch-sparql-endpoint";



export async function fetchByVirusName (virusName, onResultsFound)  {
    try{
        const myFetcher = new SparqlEndpointFetcher();
        const bindingsStream = await myFetcher.fetchBindings(
        'https://dbpedia.org/sparql', 
        `
        SELECT ?virus ?name ?virusFamily ?comment ?image
        WHERE {
        ?virusFamily dct:subject dbc:Virus_families.
        ?virus dbo:family ?virusFamily;
        rdfs:label ?name;
        rdfs:comment ?comment;
        foaf:depiction ?image.
        FILTER regex(lcase(?name), "`+virusName+`").
        FILTER langMatches(lang(?name), "en").
        FILTER langMatches(lang(?comment), "fr").
        } ORDER BY ASC (?virus)
        `
        
        );
        bindingsStream.on('data', (bindings) => {
            onResultsFound(bindings);
        });
    }catch(err){
      console.log("somethin went wrong", err);
    }
  }




