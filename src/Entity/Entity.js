import React, { Component } from "react";
import { fetchAllInfos } from "../requests/Requests";
import logo from "../logo2.svg";

import "./Entity.css";

class Entity extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true, // true if we fetch the results
			entityIdD: this.props.match.params.idD, // url param : mesh id D
			entityIdM: this.props.match.params.idM, // url param : mesh id M
			entityName: this.props.match.params.name, // url param : name/label
			data: {}, // data parsed from the fetch
			notFound: false, // if error from the request
			language: "fr", // default language
			homepageLink: "http://localhost:3000",
		};
	}

	parseData = (dataArray, lang) => {
		// console.log(dataArray);

		let data = {};

		for (let i = 0; i < dataArray.length; i++) {
			let p = dataArray[i].p;
			let pvalue = p.value;

			if (p.type === "uri") {
				let split = p.value.split("/");
				split = split[split.length - 1].split("#");
				pvalue = split[split.length - 1];
			}

			let v = dataArray[i].v;

			if (!data[pvalue]) data[pvalue] = {};

			if (!data[pvalue].values) data[pvalue].values = v;
			else {
				if (Array.isArray(data[pvalue].values))
					data[pvalue].values.push(v);
				else data[pvalue].values = [data[pvalue].values, v];
			}

			if (!data[pvalue].propLabel)
				data[pvalue].propLabel = dataArray[i].propLabel;
		}

		if (data.P486) {
			// TODO // If there's at least a label then the response is good
			let newData = { ...this.state.data };
			newData[lang] = data;

			this.setState({ data: newData, loading: false });

			// console.log(this.state.data);
		} else this.setState({ notFound: true });
	};

	changeLanguage = () => {
		let newLanguage = this.state.language === "fr" ? "en" : "fr";
		if (!this.state.data[newLanguage]) {
			this.setState({ loading: true });
			fetchAllInfos("C00656484", "SARS-CoV-2", newLanguage).then((r) =>
				this.parseData(r, newLanguage)
			);
		}
		this.setState({ language: newLanguage });
	};

	handleTitleClick = () => {
		this.props.history.push(this.state.homepageLink);
	};

	componentDidMount() {
		fetchAllInfos(
			"C00656484",
			"SARS-CoV-2",
			this.state.language
		).then((r) => this.parseData(r, this.state.language));
		// this.changeLanguage();
	}

	adaptLastBorder() {
		let noBottomBorderElements = Array.from(
			document.getElementsByClassName("no-bottom-border")
		);

		noBottomBorderElements.forEach((el) => {
			el.classList.remove("no-bottom-border");
		});

		let dtArray = document.getElementsByTagName("dt");
		let ddArray = document.getElementsByTagName("dd");
		let lastLargeItemIndex;
		for (let i = dtArray.length - 1; i >= 0; i--) {
			if (!dtArray[i].classList.contains("sm-item")) {
				lastLargeItemIndex = i;
				break;
			}
		}
		if (
			lastLargeItemIndex === dtArray.length - 1 ||
			(dtArray.length - 1 - lastLargeItemIndex) % 2 !== 0
		) {
			dtArray[dtArray.length - 1].classList.add("no-bottom-border");
			ddArray[dtArray.length - 1].classList.add("no-bottom-border");
		} else {
			dtArray[dtArray.length - 1].classList.add("no-bottom-border");
			ddArray[dtArray.length - 1].classList.add("no-bottom-border");
			dtArray[dtArray.length - 2].classList.add("no-bottom-border");
			ddArray[dtArray.length - 2].classList.add("no-bottom-border");
		}
	}

	componentDidUpdate() {
		if (!this.state.loading) {
			this.adaptLastBorder();
		}
	}

	render() {
		let infos = [];
		if (this.state.loading) {
			return <h1>Chargement des ressources</h1>;
		} else if (this.state.notFound) {
			return <h1>Résultats non trouvés</h1>;
		} else {
			let data =
				this.state.language === "fr"
					? this.state.data.fr
					: this.state.data.en;

			for (const [key, value] of Object.entries(data)) {
				let infoValuesArray = [];
				let infoTag;
				let infoValues;

				if (key.startsWith("P")) {
					for (let i = 0; i < value.values.length; i++) {
						infoValuesArray.push(
							<p key={key + i}>{value.values[i].value}</p>
						);
					}

					if (value.propLabel) {
						infoTag = <dt key={key}>{value.propLabel.value}</dt>;
					} else {
						infoTag = <dt key={key}>{key}</dt>;
					}

					infoValues = React.createElement(
						"dd",
						{ key: key + "Def" },
						infoValuesArray
					);
				} else {
					for (let i = 0; i < value.values.length; i++) {
						infoValuesArray.push(
							<p key={key + i}>{value.values[i].value}</p>
						);
					}

					infoTag = <dt key={key}>{key}</dt>;
					infoValues = React.createElement(
						"dd",
						{ key: key + "Def" },
						infoValuesArray
					);
				}

				infos.push(infoTag);
				infos.push(infoValues);
			}

			let infoList = React.createElement(
				"dl",
				{ className: "grid-container" },
				infos
			);

			return (
				<React.Fragment>
					<nav>
						<div id="nav-container">
							<div
								id="nav-text"
								onClick={this.handleTitleClick}
								title="Go to homepage"
							>
								<h2>
									The <br />
									Disease
									<br /> Searcher
								</h2>
								<p>By the HexaOne Team</p>
							</div>
							<img
								onClick={this.handleTitleClick}
								src={logo}
								id="logo"
								alt="logo"
								title="Go to homepage"
							/>
							<button id="language" onClick={this.changeLanguage}>
								{this.state.language}
							</button>
						</div>
					</nav>
					<div className="info-table">
						<div className="info-table-header">
							<h1>IDENTIFICATION</h1>
						</div>
						<div className="info-table-body">{infoList}</div>
					</div>
				</React.Fragment>
			);
		}
	}
}

export default Entity;
