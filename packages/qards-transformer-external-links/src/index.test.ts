///<reference path="../node_modules/@types/jest/index.d.ts"/>
const qPackage = require('./index');

test('Should produce link based on default options', () => {
	let props = {
		markdownAST: {
			type    : 'link',
			url     : 'http://example.com',
			children: [{type: 'text', value: 'alpha'}]
		},
	};
	qPackage(props);

	expect(props).toStrictEqual({
		"markdownAST": {
			"children": [{"type": "text", "value": "alpha"}],
			"data"    : {
				"hProperties": {
					"rel"   : ["nofollow", "noopener", "noreferrer"],
					"target": "_blank"
				}
			},
			"type"    : "link",
			"url"     : "http://example.com"
		}
	});


});

test('Should produce link based on provided options', () => {
	let props = {
		markdownAST: {
			type    : 'link',
			url     : 'http://example.com',
			children: [{type: 'text', value: 'alpha'}]
		},
	};
	qPackage(props, {
		target: '_self',
		rel   : ['noopener', 'noreferrer'],
	});

	expect(props).toStrictEqual({
		"markdownAST": {
			"children": [{"type": "text", "value": "alpha"}],
			"data"    : {
				"hProperties": {
					"rel"   : ["noopener", "noreferrer"],
					"target": "_self"
				}
			},
			"type"    : "link",
			"url"     : "http://example.com"
		}
	});
});

test('Should respect bypassNofollow props', () => {
	let props = {
		markdownAST: {
			type    : 'link',
			url     : 'http://example.com',
			children: [{type: 'text', value: 'alpha'}]
		},
	};
	qPackage(props, {
		target        : '_self',
		rel           : ['nofollow', 'noopener', 'noreferrer'],
		bypassNofollow: ['example.com']
	});

	expect(props).toStrictEqual({
		"markdownAST": {
			"children": [{"type": "text", "value": "alpha"}],
			"data"    : {
				"hProperties": {
					"rel"   : ["noopener", "noreferrer"],
					"target": "_self"
				}
			},
			"type"    : "link",
			"url"     : "http://example.com"
		}
	});
});
