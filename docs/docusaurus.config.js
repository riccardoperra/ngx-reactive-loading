const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(
  module.exports = {
    title: 'ngx-reactive-loading',
    tagline: 'Reactive loading state management for Angular applications',
    url: 'https://riccardoperra.github.io',
    baseUrl: '/ngx-reactive-loading/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'riccardoperra', // Usually your GitHub org/user name.
    projectName: 'ngx-reactive-loading', // Usually your repo name.

    presets: [
      [
        '@docusaurus/preset-classic',
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          docs: {
            sidebarPath: require.resolve('./sidebars.js'),
            // Please change this to your repo.
            editUrl:
              'https://github.com/riccardoperra/ngx-reactive-loading/edit/main/docs/docs',
          },
          theme: {
            customCss: require.resolve('./src/css/custom.css'),
          },
        }),
      ],
    ],

    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        navbar: {
          title: 'NGX Reactive Loading',
          logo: {
            alt: 'ngx-reactive-loading logo',
            src: 'img/logo.svg',
          },
          items: [
            {
              type: 'doc',
              docId: 'getting-started/installation',
              position: 'left',
              label: 'Docs',
            },
            // TODO: after versioning
            // {
            //   type: 'docsVersionDropdown',
            // },
            {
              to: 'demo-app',
              activeBasePath: 'demo-app',
              label: 'Demo App',
              position: 'left',
            },
            {
              href: 'https://stackblitz.com/edit/ngx-reactive-loading-playground',
              label: 'Playground',
              position: 'left',
            },
            {
              href: 'https://github.com/riccardoperra/ngx-reactive-loading',
              label: 'GitHub',
              position: 'right',
            },
          ],
        },
        footer: {
          style: 'dark',
          links: [
            {
              title: 'Docs',
              items: [
                {
                  label: 'Tutorial',
                  to: '/docs/getting-started/installation',
                },
              ],
            },
            {
              title: 'Community',
              items: [
                {
                  label: 'Twitter',
                  href: 'https://twitter.com/riccardoperra',
                },
              ],
            },
            {
              title: 'More',
              items: [
                {
                  label: 'GitHub',
                  href: 'https://github.com/riccardoperra/ngx-reactive-loading',
                },
                {
                  label: 'Npm',
                  href: 'https://www.npmjs.com/package/ngx-reactive-loading',
                },
              ],
            },
          ],
          copyright: `Copyright © ${new Date().getFullYear()} ngx-reactive-loading. Built with Docusaurus.`,
        },
        prism: {
          theme: lightCodeTheme,
          darkTheme: darkCodeTheme,
        },
        gtag: {
          trackingID: 'G-DF7ZYNVQCY',
          anonymizeIP: true,
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          trailingSlash: false,
        },
      }),
  }
);
