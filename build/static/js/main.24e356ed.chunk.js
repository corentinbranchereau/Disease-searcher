(this["webpackJsonpdisease-searcher"]=this["webpackJsonpdisease-searcher"]||[]).push([[0],{109:function(e,t){},111:function(e,t){},117:function(e,t){},118:function(e,t){},123:function(e,t){},125:function(e,t){},154:function(e,t,n){},159:function(e,t,n){"use strict";n.r(t);var a=n(3),s=n(0),c=n.n(s),r=n(75),i=n.n(r),u=(n(86),n(1)),o=n(2),h=n(7),l=n(6),j=n(79),m=n(5),d=(n(87),n(33)),b=n.n(d),p=n(76),f=n(77);function O(){return(O=Object(p.a)(b.a.mark((function e(t,n){var a;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a=new f.SparqlEndpointFetcher,e.next=4,a.fetchBindings("https://dbpedia.org/sparql",'\n        SELECT ?virus ?name ?virusFamily ?comment ?image\n        WHERE {\n        ?virusFamily dct:subject dbc:Virus_families.\n        ?virus dbo:family ?virusFamily;\n        rdfs:label ?name;\n        rdfs:comment ?comment;\n        foaf:depiction ?image.\n        FILTER regex(lcase(?name), "'+t+'").\n        FILTER langMatches(lang(?name), "en").\n        FILTER langMatches(lang(?comment), "fr").\n        } ORDER BY ASC (?virus)\n        ');case 4:e.sent.on("data",(function(e){n(e)})),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),console.log("somethin went wrong",e.t0);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})))).apply(this,arguments)}n(154);var v=n.p+"static/media/logo.103b5fa1.svg",x=function(e){Object(h.a)(n,e);var t=Object(l.a)(n);function n(){var e;return Object(u.a)(this,n),(e=t.call(this)).componentDidMount=function(){},e.fetchData=function(){e.setState({searched:!0,searchResults:[]}),function(e,t){O.apply(this,arguments)}(e.state.query,e.handleResults)},e.handleResults=function(t){var n=e.state.searchResults;n.push(t),e.setState({searchResults:n})},e.handleInputChange=function(){e.setState({query:e.search.value})},e.state={searchResults:[],query:"",searched:!1},e}return Object(o.a)(n,[{key:"render",value:function(){var e,t=this;return this.state.searchResults&&(e=this.state.searchResults.map((function(e){return Object(a.jsxs)("div",{className:"results",children:[Object(a.jsx)("h1",{children:e.name.value}),Object(a.jsx)("img",{src:e.image.value}),Object(a.jsx)("p",{children:e.comment.value})]})}))),Object(a.jsx)("div",{className:"disease-searcher-container",children:Object(a.jsxs)("header",{className:"App-header",children:[Object(a.jsx)("img",{src:v,className:"App-logo",alt:"logo"}),Object(a.jsx)("p",{children:"The Disease Searcher, by the HexaOne Team"}),Object(a.jsx)("input",{className:"home-search",type:"text",name:"search",id:"search",placeholder:"Rechercher une maladie. ex:coronavirus",ref:function(e){return t.search=e},onChange:this.handleInputChange}),Object(a.jsx)("button",{onClick:this.fetchData,children:"Rechercher"}),this.state.searched&&0===this.state.searchResults.length?Object(a.jsx)("h2",{children:"Pas de r\xe9sultats"}):Object(a.jsx)(c.a.Fragment,{}),e]})})}}]),n}(c.a.Component),g=function(e){Object(h.a)(n,e);var t=Object(l.a)(n);function n(e){var a;return Object(u.a)(this,n),(a=t.call(this,e)).state={diseaseName:a.props.match.params.diseaseName},a}return Object(o.a)(n,[{key:"render",value:function(){return Object(a.jsx)("h1",{children:this.state.diseaseName})}}]),n}(s.Component),y=function(e){Object(h.a)(n,e);var t=Object(l.a)(n);function n(e){var a;return Object(u.a)(this,n),(a=t.call(this,e)).state={virusName:a.props.match.params.virusName},a}return Object(o.a)(n,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){return Object(a.jsx)("h1",{children:this.state.virusName})}}]),n}(c.a.Component),R=function(e){Object(h.a)(n,e);var t=Object(l.a)(n);function n(){return Object(u.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,[{key:"render",value:function(){return Object(a.jsx)(j.a,{children:Object(a.jsxs)(m.d,{children:[Object(a.jsx)(m.b,{path:"/",component:x,exact:!0}),Object(a.jsx)(m.b,{path:"/virus/:virusName",component:y,exact:!0}),Object(a.jsx)(m.b,{path:"/disease/:diseaseName",component:g,exact:!0}),Object(a.jsx)(m.a,{to:"/"})]})})}}]),n}(s.Component),C=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,160)).then((function(t){var n=t.getCLS,a=t.getFID,s=t.getFCP,c=t.getLCP,r=t.getTTFB;n(e),a(e),s(e),c(e),r(e)}))};i.a.render(Object(a.jsx)(c.a.StrictMode,{children:Object(a.jsx)(R,{})}),document.getElementById("root")),C()},86:function(e,t,n){},87:function(e,t,n){}},[[159,1,2]]]);
//# sourceMappingURL=main.24e356ed.chunk.js.map