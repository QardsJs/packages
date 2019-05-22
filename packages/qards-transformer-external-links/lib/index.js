const visit = require('unist-util-visit');

const definitions = require('mdast-util-definitions');

const isAbsoluteURL = require('is-absolute-url');

const defaultTarget = '_blank';
const defaultRel = ['nofollow', 'noopener', 'noreferrer'];
const defaultProtocols = ['http', 'https']; //	Shameless copy from `remark-external-links`

function externalLinks(options) {
  const opts = options || {};
  const target = opts.target || defaultTarget;
  const protocols = opts.protocols || defaultProtocols;
  const rel = opts.rel.length > 0 ? opts.rel : defaultRel;
  const bypassNofollow = opts.bypassNofollow || [];
  return transform;

  function transform(tree) {
    visit(tree, ['link', 'linkReference'], visitor);
    const definition = definitions(tree);

    function visitor(node) {
      const ctx = node.type === 'link' ? node : definition(node.identifier);
      if (!ctx) return;
      const protocol = ctx.url.slice(0, ctx.url.indexOf(':'));
      let data, props;

      if (isAbsoluteURL(ctx.url) && protocols.indexOf(protocol) !== -1) {
        data = node.data || (node.data = {});
        props = data.hProperties || (data.hProperties = {});

        for (let i = 0; i < bypassNofollow.length; i++) {
          const rule = bypassNofollow[i];

          if (ctx.url.includes(rule) && rel.includes('nofollow')) {
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

module.exports = ({
  markdownAST
}, options = {
  //	defaults
  target: defaultTarget,
  rel: defaultRel,
  protocols: defaultProtocols,
  bypassNofollow: ['*qards.io']
}) => {
  const transformer = externalLinks(options);
  transformer(markdownAST);
};
