import React,{Component} from 'react';

class Disease extends Component {

    constructor(props){
        super(props);
        this.state = {
            diseaseName : this.props.match.params.diseaseName,
        }
    }

    render(){
        return(
            <h1>{this.state.diseaseName}</h1>
        );
    }
}

export default Disease;