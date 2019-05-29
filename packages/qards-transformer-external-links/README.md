This package allows you to define how external links are created by specifying the `rel` types you want added, `target` and even a whitelist for the `nofollow` rel in case you want to pass SEO juice to other domains.

This is a `remark` plugin and it should be placed inside `gatsby-transformer-remark` (`gatsby-config.js`) list of plugins:

```
...
{
    resolve: `gatsby-transformer-remark`,
    options: {
        plugins: [{
            resolve: 'qards-transformer-external-links',
            options: {
                target        : '_blank',
                rel           : ['nofollow', 'noopener', 'noreferrer'],
                bypassNofollow: ['qards.io', 'typely.com'],
            },
        }],
    },
},
```

The plugin is developed for `Qards` which is a [Gatsby CMS](https://qards.io) so keep that in mind as it may suffer changes that will not allow it to run on regular Gatsby apps.
It's no different from [gatsby-remark-external-links](https://github.com/JLongley/gatsby-remark-external-links) except for the `bypassNofollow` directive which I wanted.
