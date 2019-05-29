const visit = require('unist-util-visit');
const definitions = require('mdast-util-definitions');
const isAbsoluteURL = require('is-absolute-url');

interface GatsbyPluginProps {
	markdownAST: string;
}

interface PluginOptions {
	target?: '_blank' | '_self';
	rel: string[];
	protocols: string[];
	bypassNofollow?: string[];// list of domains that are always linked WITHOUT `nofollow`
}

const defaultTarget = '_blank';
const defaultRel = ['nofollow', 'noopener', 'noreferrer'];
const defaultProtocols = ['http', 'https'];

//	Shameless copy from `remark-external-links`
function externalLinks(options: PluginOptions) {
	const opts = options || {};
	const target = opts.target || defaultTarget;
	const protocols = opts.protocols || defaultProtocols;
	const bypassNofollow = opts.bypassNofollow || [];

	return transform;

	function transform(tree: any) {
		visit(tree, ['link', 'linkReference'], visitor);

		const definition = definitions(tree);

		function visitor(node: any) {
			const ctx = node.type === 'link' ? node : definition(node.identifier);

			if (!ctx) return;

			const protocol = ctx.url.slice(0, ctx.url.indexOf(':'));
			let data, props;

			if (isAbsoluteURL(ctx.url) && protocols.indexOf(protocol) !== -1) {
				data = node.data || (node.data = {});
				props = data.hProperties || (data.hProperties = {});

				//	copy then modify
				const rel = [...(opts.rel.length > 0 ? opts.rel : defaultRel)];

				for (let i = 0; i < bypassNofollow.length; i++) {
					const rule = bypassNofollow[i].toLowerCase();

					if (!rel.includes('nofollow')) continue;

					if (ctx.url.toLowerCase().includes(rule) && rel.includes('nofollow')) {
						const index = rel.indexOf('nofollow');
						if (index !== -1) rel.splice(index, 1);
					}
				}

				props.target = target;
				props.rel = rel.concat();
			}
		}
	}
}

module.exports = ({markdownAST}: GatsbyPluginProps, options: PluginOptions = {
	//	defaults
	target        : defaultTarget,
	rel           : defaultRel,
	protocols     : defaultProtocols,
	bypassNofollow: ['qards.io']
}) => {
	const transformer = externalLinks(options);
	transformer(markdownAST);
};
