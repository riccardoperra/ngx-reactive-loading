import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import React, { VFC } from 'react';

const DemoApp: VFC = () => {
  const context = useDocusaurusContext();
  const description = 'ngx-reactive-loading Documentation';
  const { siteConfig } = context;

  const demoIframeStyle = {
    width: '100%',
    minHeight: '100vh',
    margin: 0,
  };

  return (
    <Layout title={siteConfig.title} description={description}>
      <main>
        <iframe
          src="https://ngx-loading.vercel.app/"
          width="100%"
          frameBorder="0"
          style={demoIframeStyle}
        />
      </main>
    </Layout>
  );
};

export default DemoApp;
