import * as parsers from './parsers';
import chai from 'chai';

chai.should();

describe('parseFlatArray', () => {

	const data = [
		{
			"Year": 1880,
			"Glob": -19,
			"NHem": -33,
			"SHem": -5
		},
		{
			"Year": 1881,
			"Glob": -10,
			"NHem": -18,
			"SHem": -2
		},
		{
			"Year": 1882,
			"Glob": -9,
			"NHem": -17,
			"SHem": -1
		},
		{
			"Year": 1883,
			"Glob": -19,
			"NHem": -30,
			"SHem": -8
		}
	];

	it('generates one line for each value in array', () => {
		parsers.parseFlatArray(data, "Year", ['Glob', 'NHem', 'SHem']).length.should.eql(3);
	});

	it('accepts a single value instead of an array', () => {
		parsers.parseFlatArray(data, "Year", 'Glob').should.eql(parsers.parseFlatArray(data, "Year", ['Glob']));
	});
});

describe('parseGroupingBy', () => {

	const data = [
		{ id: 1, value: 3, date: "2016-01-01" },
		{ id: 1, value: 4, date: "2016-01-03" },
		{ id: 2, value: 10, date: "2016-01-02" },
		{ id: 1, value: 6, date: "2016-01-04" },
		{ id: 2, value: 13, date: "2016-01-06" },
		{ id: 1, value: 5, date: "2016-01-08" },
		{ id: 2, value: 10, date: "2016-01-20" }
	];

	it('groups line by distinct values', () => {
		parsers.parseGroupingBy(data, "date", "value", "id").length.should.eql(2);
	});

	it('correctly groups points', () => {
		parsers.parseGroupingBy(data, "date", "value", "id")[0].points.length.should.eql(4)
		&& parsers.parseGroupingBy(data, "date", "value", "id")[1].points.length.should.eql(3);
	});

	it('correctly generates default names', () => {
		parsers.parseGroupingBy(data, "date", "value", "id")[0].name.should.eql("Grouped by id = 1")
		&& parsers.parseGroupingBy(data, "date", "value", "id")[1].name.should.eql("Grouped by id = 2");
	});

	it('generates default names if invalid name function', () => {
		const nameFunc = 2;
		parsers.parseGroupingBy(data, "date", "value", "id", nameFunc)[0].name.should.eql("Grouped by id = 1");
	});

	it('correctly generates custom names', () => {
		const nameFunc = (value) => `Line for this: ${value}`;
		parsers.parseGroupingBy(data, "date", "value", "id", nameFunc)[0].name.should.eql("Line for this: 1");
	});
});