import { gsmData } from "../constants/GSM";

export function dataParser() {
	const lines = [
		{ 
			id: "glob",
			color: "blue",
			pointRadius: 2,
			points: []
		},
		{ 
			id: "nhem",
			color: "red",
			pointRadius: 2,
			points: []
		},
		{ 
			id: "shem",
			color: "green",
			pointRadius: 2,	
			points: []
		}
	];

	gsmData.map((d, i) => {
		let glob = { x: d["Year"], y: d["Glob"] };
		let nhem = { x: d["Year"], y: d["NHem"] };
		let shem = { x: d["Year"], y: d["SHem"] };
		lines[0].points.push(glob);
		lines[1].points.push(nhem);
		lines[2].points.push(shem);
	});

	return {
		label: { x: "Year", y: "Deviation" },		
		lines
	};
}