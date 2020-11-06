import React from "react";

class Virus extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			virusName: this.props.match.params.virusName,
		};
	}

	componentDidMount() {}

	render() {
		return <h1>{this.state.virusName}</h1>;
	}
}

export default Virus;
