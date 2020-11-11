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


export function fetchAllInfos( idD, idM, name, lang ) {
  //TODO Vérifier les caratères spéciaux dans id et name

  const sparqlQuery = `SELECT DISTINCT ?p ?propLabel ?v WHERE {
    
  {

    SELECT ?m WHERE {
      { 
        ?m wdt:P486 ?a .
        FILTER( ?a = "` + idD + `" ).
      }
      UNION
      { 
        ?m wdt:P6694 ?b .
        FILTER( ?b = "` + idM + `" ).
      }
      UNION
      {
        ?m rdfs:label "` + name + `"@en
      }
      UNION
      {
        ?m skos:altLabel "` + name + `"@en.
      } 
    } ORDER BY desc(?a) desc(?b) ?m LIMIT 1

  }
  
  OPTIONAL {
  { ?m ?p ?v . } MINUS {
  ?m ?p ?v
  FILTER( LANG(?v) != "" && !LANGMATCHES(LANG(?v), "`+lang+`") ) .
  } }
  
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  
  OPTIONAL {
    ?prop wikibase:directClaim ?p .
    ?prop rdfs:label ?propLabel.
    filter(lang(?propLabel) = "`+lang+`").
  }

  } ORDER BY ?m ?p`;

  const fullUrl = endpointUrl_wikidata + '?query=' + encodeURIComponent( sparqlQuery );
  const headers = { 'Accept': 'application/sparql-results+json' };

  return fetch( fullUrl, { headers } ).then( body => body.json() ).then( r => r.results.bindings);
}