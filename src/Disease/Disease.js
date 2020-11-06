import React,{Component} from 'react';

class Disease extends Component {

    constructor(props){
        super(props);
        this.state = {
            loading : true,
            diseaseName : this.props.match.params.diseaseName,
            data : {}
        }
    }

    componentDidMount(){
        this.setState({loading: true});


        // SELECT ?m ?p (GROUP_CONCAT(?v; SEPARATOR=", ")) as ?v
        // WHERE {
        // {
        // SELECT ?m WHERE {
        // ?m a dbo:Disease;
        // rdfs:label ?n .
        // FILTER( ?n="Psoriasis"@fr || ?n="Psoriasis"@en ) .
        // } limit 1
        // }
        // ?m ?p ?v .
        // FILTER( (?p != rdfs:label && ?p != rdfs:comment && ?p != dbo:abstract) || lang(?v) = 'en' || lang(?v) = 'fr'  ) .
        // }GROUP BY ?m ?p

        fetch('http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='
            + 'SELECT ?p ?v WHERE'
            + '+%7B%0D%0A%7B%0D%0ASELECT+%3Fm+WHERE'
            + '+%7B%0D%0A%3Fm+a+dbo%3ADisease%3B%0D%0A+++rdfs%3Alabel+%3Fn+.%0D%0A'
            + 'FILTER%28+%3Fn%3D%22' + this.state.diseaseName + '%22%40fr+%7C%7C+%3Fn%3D%22' + this.state.diseaseName + '%22%40en+%29+.%0D%0A%7D+limit+1%0D%0A%7D%0D%0A%3Fm+%3Fp+%3Fv+.%0D%0A'
            + 'FILTER%28+%28%3Fp+%21%3D+rdfs%3Alabel+%26%26+%3Fp+%21%3D+rdfs%3Acomment+%26%26+%3Fp+%21%3D+dbo%3Aabstract%29+%7C%7C+lang%28%3Fv%29+%3D+%27en%27+%7C%7C+lang%28%3Fv%29+%3D+%27fr%27++%29+.%0D%0A%7DGROUP+BY+%3Fm+%3Fp'
            + '&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query'
            ).then(r => {
            return r.json();
        }).then( r => {

            let data = {};
            let dataArray = r.results.bindings;
            
            console.log(dataArray);

            for (let i = 0; i < dataArray.length; i++) {
                
                let p = dataArray[i].p;
                let pvalue = p.value;
                if (p.type === "uri") { 
                     let split = p.value.split("/");
                     split = split[split.length-1].split("#");
                     pvalue = split[split.length-1];
                }

                let v = dataArray[i].v;
                if (!data[pvalue] || v["xml:lang"] === "fr")
                    data[pvalue] = v;
            }

            this.setState({
                loading: false,
                data: data
            });
            console.log(this.state.data);
        });
    }

    render(){
        return(
            <div>
                <h1>{this.state.diseaseName}</h1>
                <p>{this.state.loading ? "Loading..." : this.state.data.abstract.value }</p>
            </div> 
        );
    }
}

export default Disease;