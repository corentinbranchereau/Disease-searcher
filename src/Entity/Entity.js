import React, { Component } from "react";
import { fetchAllInfos } from "../requests/Requests";
import logo from "../logo2.svg";

import "./Entity.css";
import "./loading.css";

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
			titlesTablesFrench: [
				"PRESENTATION GENERALE",
				"AUTRES INFORMATIONS",
			],
			titlesTablesEnglish: ["GENERAL PRESENTATION", "OTHER INFORMATION"],
			keywordsEN: [
				["ID", "ICD", "MeSH tree code", "UMLS CUI", "DiseasesDB"],
				[
					"health specialty",
					"subclass of",
					"instance of",
					"Commons category",
					"altLabel",
					"label",
					"description",
				],
			],
			keywordsFR: [
				["identifiant", "UMLS CUI", "arborescence MeSH", "ICD", "CIM"],
				[
					"catégorie",
					"nature de l'élément",
					"spécialité médicale",
					"sous-classe de",
					"label",
					"description",
				],
			],

			formats: [
				[".jpg", ".jpeg", ".png", ".gif", ".svg"],
				[".mp4", ".wav"],
			],

			indexSubject: -1,
		};
	}

	parseData = (dataArray, lang) => {
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

			let vLabel = dataArray[i].vLabel;

			if (vLabel.value && !vLabel.value.startsWith("statement")) {
				v = vLabel;
			}

			if (v.type === "uri") {
				continue;
			}

			if (!data[pvalue]) data[pvalue] = {};

			if (!data[pvalue].values) {
				data[pvalue].values = [];
				data[pvalue].values.push(v);
			} else {
				if (Array.isArray(data[pvalue].values)) {
					data[pvalue].values.push(v);
				} else {
					data[pvalue].values = [data[pvalue].values, v];
				}
			}

			if (!data[pvalue].propLabel)
				data[pvalue].propLabel = dataArray[i].propLabel;
		}

		if (true) {
			// TODO // If there's at least a label then the response is good
			let newData = { ...this.state.data };
			newData[lang] = data;

			this.setState({ data: newData, loading: false, language: lang });

			//console.log(this.state.data);
		} else this.setState({ notFound: true });
	};

	changeLanguage = () => {
		let newLanguage = this.state.language === "fr" ? "en" : "fr";
		if (!this.state.data[newLanguage]) {
			this.setState({ loading: true });
			fetchAllInfos(
				this.state.entityIdD,
				this.state.entityIdM,
				this.state.entityName,
				newLanguage
			).then((r) => this.parseData(r, newLanguage));
		} else this.setState({ language: newLanguage });
	};

	handleTitleClick = () => {
		this.props.history.push(this.state.homepageLink);
	};

	componentDidMount() {
		let l = this.state.language;
		fetchAllInfos(
			this.state.entityIdD,
			this.state.entityIdM,
			this.state.entityName,
			l
		).then((r) => this.parseData(r, l));
		//this.changeLanguage();
	}

	adaptLastBorder() {
		let noBottomBorderElements = Array.from(
			document.getElementsByClassName("no-bottom-border")
		);

		noBottomBorderElements.forEach((el) => {
			el.classList.remove("no-bottom-border");
		});

		let dlArray = Array.from(document.getElementsByTagName("dl"));

		dlArray.forEach((dl) => {
			let dtArray = [];
			let ddArray = [];

			dl.childNodes.forEach((child) => {
				if (child.tagName === "DT") {
					dtArray.push(child);
				} else if (child.tagName === "DD") {
					ddArray.push(child);
				}
			});

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
		});
	}

	componentDidUpdate() {
		if (!this.state.loading) {
			this.adaptLastBorder();
		}
	}

	identifySubject = (tag) => {
		let keywords;

		if (this.state.language == "fr") {
			keywords = this.state.keywordsFR;
		} else {
			keywords = this.state.keywordsEN;
		}

		for (let i = 0; i < keywords.length; i++) {
			for (let j = 0; j < keywords[i].length; j++) {
				if (tag.includes(keywords[i][j])) {
					return i;
				}
			}
		}
		return -1;
	};

	identifyFormat = (url, key, index) => {
		for (let i = 0; i < this.state.formats.length; i++) {
			for (let j = 0; j < this.state.formats[i].length; j++) {
				if (url.includes(this.state.formats[i][j])) {
					switch (i) {
						case 0:
							return <img src={url} key={key + index}></img>;
						case 1:
							return <video src={url} key={key + index}></video>;
					}
				}
			}
		}
		return <p key={key + index}>{url}</p>;
	};

	render() {
		let OthersInfos = [];
		let IdentificationInfos = [];
		let PresentationInfos = [];

		if (this.state.loading) {
			return <div className="bb"></div>;
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
				let subject = -1;

				if (key.startsWith("P")) {
					for (let i = 0; i < value.values.length; i++) {
						let balise = this.identifyFormat(
							value.values[i].value,
							key,
							i
						);

						infoValuesArray.push(balise);
					}

					if (value.propLabel) {
						let subjectFound = this.identifySubject(
							value.propLabel.value
						);

						if (subjectFound != -1) {
							subject = subjectFound;
						}

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
						let balise = this.identifyFormat(
							value.values[i].value,
							key,
							i
						);

						infoValuesArray.push(balise);
					}

					infoTag = <dt key={key}>{key}</dt>;
					infoValues = React.createElement(
						"dd",
						{ key: key + "Def" },
						infoValuesArray
					);
				}

				let subjectFound = this.identifySubject(key);

				if (subjectFound != -1) {
					subject = subjectFound;
				}

				switch (subject) {
					case 0:
						IdentificationInfos.push(infoTag);
						IdentificationInfos.push(infoValues);
						break;

					case 1:
						PresentationInfos.push(infoTag);
						PresentationInfos.push(infoValues);
						break;

					case -1:
						OthersInfos.push(infoTag);
						OthersInfos.push(infoValues);
				}
			}

			let infoListOthers = React.createElement(
				"dl",
				{ className: "grid-container" },
				OthersInfos
			);

			let infoListIdentification = React.createElement(
				"dl",
				{ className: "grid-container" },
				IdentificationInfos
			);

			let infoListPresentation = React.createElement(
				"dl",
				{ className: "grid-container" },
				PresentationInfos
			);

			let titles;

			this.state.language === "fr"
				? (titles = this.state.titlesTablesFrench)
				: (titles = this.state.titlesTablesEnglish);

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
							<h1>{titles[0]}</h1>
						</div>
						<div className="info-table-body">
							{infoListPresentation}
						</div>
					</div>
					<div className="info-table">
						<div className="info-table-header">
							<h1>IDENTIFICATION</h1>
						</div>
						<div className="info-table-body">
							{infoListIdentification}
						</div>
					</div>

					<div className="info-table">
						<div className="info-table-header">
							<h1>{titles[1]}</h1>
						</div>
						<div className="info-table-body">{infoListOthers}</div>
					</div>
				</React.Fragment>
			);
		}
	}
}

export default Entity;
