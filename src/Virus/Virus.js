import React from "react";

class Virus extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			virusName: this.props.match.params.name,
			comment: localStorage.getItem("entityDescription"),
		};
	}

	componentDidMount() {}

	render() {
		return <h1>{this.state.virusName + "-" + this.state.comment}</h1>;
	}
}

export default Virus;
