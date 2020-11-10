import React,{Component} from 'react';
import {fetchAllInfos} from '../requests/Requests'

import "./Disease.css";

class Disease extends Component {

    constructor(props){
        super(props);
        this.state = {
            lang : "fr", //TODO Mettre une langue par défaut
            loading : true, //true if we fetch the results
            diseaseName : this.props.match.params.diseaseName, //url param
            data : {}, //data parsed from the fetch
            notFound : false //if error from the request
        }
    }

    parseData = (dataArray, lang) => {
        console.log(dataArray);

        let data = {};

        for (let i = 0; i < dataArray.length; i++) {
            
            let p = dataArray[i].p;
            let pvalue = p.value;
            
            if (p.type === "uri") { 
                    let split = p.value.split("/");
                    split = split[split.length-1].split("#");
                    pvalue = split[split.length-1];
            }


            let v = dataArray[i].v;

            if ( !data[pvalue] ) data[pvalue] = {};

            if ( !data[pvalue].values ) data[pvalue].values = v;
            else {
                if (Array.isArray(data[pvalue].values))
                    data[pvalue].values.push(v);
                else 
                    data[pvalue].values = [data[pvalue].values, v];
            }

            if ( !data[pvalue].propLabel ) data[pvalue].propLabel = dataArray[i].propLabel;
        }


        if(data.P486) {  // TODO // If there's at least a label then the response is good
            let newState = { ...this.state };

            newState.loading = false;
            newState.data[lang] = data;

            this.setState(newState);

            console.log(this.state.data);
        } else
            this.setState({notFound : true});
    }

    componentDidMount(){

        fetchAllInfos("C00656484", "SARS-CoV-2", this.state.lang).then(r => this.parseData(r, this.state.lang));
        fetchAllInfos("C00656484", "SARS-CoV-2", "en").then(r => this.parseData(r, "en")); //TODO on change lang

    }

    render() {
        /*
        let dataComponent;
        
        if (!this.state.notFound) {
            if (!this.state.loading) {
                let img;
                let abstract;
                let seeAlso;
                // TODO : add more info 

                if (this.state.data.thumbnail.value)
                    img = <img className="disease-image" alt="img" src={this.state.data.thumbnail.value}/>;
                if (this.state.data.abstract.value)
                    abstract = <p className="disease-abstract">{this.state.data.abstract.value}</p>;
                if (this.state.data.seeAlso){
                    seeAlso =
                        <div className="disease-seeAlso">
                            <span>Voir aussi :</span>
                            <ul>
                                {this.state.data.seeAlso.map(s => (
                                    <li key={s.value}>
                                        <a className="disease-seeAlso-link" href={s.value}>{s.value}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>;
                }

                dataComponent = (
                    <div className="disease-data">
                        {abstract}
                        {img}
                        {seeAlso}
                    </div>
                );
            } else dataComponent = <p>Loading...</p>;
        } else {
            
        }*/
        
        return(/*
            <React.Fragment>
                <div className="disease-container">
                    <div className="disease-header">
                        <h1 className="disease-name">{this.state.diseaseName}</h1>
                    </div>
                    {dataComponent}
                    <div className="disease-footer">
                        <button className="disease-newResearch-button" onClick={() => this.props.history.push("/")} >New Research</button>
                    </div>
                </div>
            </React.Fragment>*/ <div>ok</div>
        );
    }
}

export default Disease;