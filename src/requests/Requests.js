import {SparqlEndpointFetcher} from "fetch-sparql-endpoint";


const endpointUrl_wikidata = 'https://query.wikidata.org/sparql';


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

export async function fetchAllInfos_en(id, name, onResultsFound)  {
  try{
    const myFetcher = new SparqlEndpointFetcher();
    const bindingsStream = await myFetcher.fetchBindings(
    'https://query.wikidata.org/sparql', 
    `SELECT DISTINCT ?m ?p ?propLabel ?v WHERE {

      { 
        ?m wdt:P486 ?c .
        FILTER( ?c = "`+ id +`" ).
      }
      UNION
      {
        ?m rdfs:label "`+ name +`"@en;
      }
      UNION
      {
        ?m skos:altLabel "`+ name +`"@en.
      }
      
      
      { ?m ?p ?v . } MINUS {
        ?m ?p ?v
        FILTER( LANG(?v) != "" && !LANGMATCHES(LANG(?v), "en") ) .
      }
      
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      
      OPTIONAL {
        ?prop wikibase:directClaim ?p .
        ?prop rdfs:label ?propLabel.
        filter(lang(?propLabel) = "en").
      }
    
    }
    `
    
    );
    bindingsStream.on('data', (bindings) => {
        onResultsFound(bindings);
    });
  }catch(err){
    console.log("somethin went wrong", err);
  }
}

export async function fetchAllInfos_fr (id, name, onResultsFound)  {
  try{
    const myFetcher = new SparqlEndpointFetcher();
    const bindingsStream = await myFetcher.fetchBindings(
    'https://dbpedia.org/sparql', 
    `
    SELECT DISTINCT ?m ?p ?propLabel ?v WHERE {

      { 
        ?m wdt:P486 ?c .
        FILTER( ?c = "`+ id +`" ).
      }
      UNION
      {
        ?m rdfs:label "`+ name +`"@en;
      }
      UNION
      {
        ?m skos:altLabel "`+ name +`"@en.
      }
      
      
      { ?m ?p ?v . } MINUS {
        ?m ?p ?v
        FILTER( LANG(?v) != "" && !LANGMATCHES(LANG(?v), "fr") ) .
      }
      
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      
      OPTIONAL {
        ?prop wikibase:directClaim ?p .
        ?prop rdfs:label ?propLabel.
        filter(lang(?propLabel) = "fr").
      }
    
    }
    `
    
    );
    bindingsStream.on('data', (bindings) => {
        onResultsFound(bindings);
    });
  }catch(err){
    console.log("somethin went wrong", err);
  }
}


export function fetchAllInfos_en2( id, name) {
  let sparqlQuery = `SELECT DISTINCT ?m ?p ?propLabel ?v WHERE {

    { 
      ?m wdt:P486 ?c .
      FILTER( ?c = "`+id+`" ).
    }
    UNION
    {
      ?m rdfs:label "`+name+`"@en;
    }
    UNION
    {
      ?m skos:altLabel "`+name+`"@en.
    }
    
    
    { ?m ?p ?v . } MINUS {
      ?m ?p ?v
      FILTER( LANG(?v) != "" && !LANGMATCHES(LANG(?v), "en") ) .
    }
    
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    
    OPTIONAL {
      ?prop wikibase:directClaim ?p .
      ?prop rdfs:label ?propLabel.
      filter(lang(?propLabel) = "en").
    }
  
  }`;

  const fullUrl = endpointUrl_wikidata + '?query=' + encodeURIComponent( sparqlQuery );
  const headers = { 'Accept': 'application/sparql-results+json' };

  return fetch( fullUrl, { headers } ).then( body => body.json() );
}
