import React,{Component} from 'react';
import "./Disease.css";

class Disease extends Component {

    constructor(props){
        super(props);
        this.state = {
            loading : true,
            diseaseName : this.props.match.params.diseaseName,
            data : {},
            notFound : false
        }
    }

    componentDidMount(){

        // SELECT ?p ?v
        // WHERE {
        //     {
        //         SELECT ?m WHERE {
        //         ?m a dbo:Disease;
        //         rdfs:label ?n .
        //         FILTER( ?n="Psoriasis"@fr || ?n="Psoriasis"@en ) .
        //         } limit 1
        //     }
        //     {
        //         ?m ?p ?v
        //         FILTER( (?p != rdfs:label && ?p != rdfs:comment && ?p != dbo:abstract) || lang(?v) = 'en' || lang(?v) = 'fr'  )
        //     }
        //     UNION
        //     {
        //         ?v ?p ?m
        //     }
        // }

        fetch('http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query='
            + 'SELECT ?p ?v WHERE { '
                + '{ SELECT ?m WHERE { '
                    + '?m a dbo:Disease; rdfs:label ?n . '
                    + 'FILTER( ?n="' + this.state.diseaseName + '"@fr || ?n="' + this.state.diseaseName + '"@en ) . '
                + '} limit 1 } '
                + '{'
                    + '?m ?p ?v . '
                    + 'FILTER( (?p != rdfs:label %26%26 ?p != rdfs:comment %26%26 ?p!=dbo:abstract) %7C%7C lang(?v) = "en" %7C%7C lang(?v) = "fr" ) . '
                + '}'
                + 'UNION'
                + '{'
                    + '?v ?p ?m'
                + '}'
            + '}'
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
                    data[pvalue] = v; // = v;
                else if (!data[pvalue]["xml:lang"])
                    if (Array.isArray(data[pvalue]))
                        data[pvalue].push(v);
                    else 
                        data[pvalue] = [data[pvalue], v];
            }
            if(data.label) { // If there's at least a label then the response is good
                this.setState({
                    loading: false,
                    data: data
                });
                console.log(this.state.data);
            } else
                this.setState({notFound : true});
        }).catch(function(error) {
            console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
            this.setState({notFound : true});
        });
    }

    render(){
        let dataComponent;
        
        if (!this.state.notFound) {
            if (!this.state.loading) {
                let img;
                let abstract;
                let seeAlso;
                // TODO : add more info 

                if (this.state.data.thumbnail.value)
                    img = <img  alt="img" src={this.state.data.thumbnail.value}/>;
                if (this.state.data.abstract.value)
                    abstract = <p>{this.state.data.abstract.value}</p>;
                if (this.state.data.seeAlso){
                    seeAlso = 
                        <div>
                            <span>Voir aussi :</span>
                            <ul>
                                {this.state.data.seeAlso.map(s => (
                                    <li key={s.value}>
                                        <a href={s.value}>{s.value}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>;
                }

                dataComponent = (
                    <div>
                        {img}
                        {abstract}
                        {seeAlso}
                    </div>
                );
            } else dataComponent = <p>Loading...</p>;
        } else {
            
        }
        
        return(
            <React.Fragment>
                <h1>{this.state.diseaseName}</h1>
                {dataComponent}
            </React.Fragment>
        );
    }
}

export default Disease;