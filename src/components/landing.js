import React from 'react';

import Section from './section';
import WideSection from './wideSection';
import Mdx from './mdx';
import IconGrid from './iconGrid';
import Banner from './banner';
import LatestBlogPosts from './latestBlogPosts';

const Landing = ({ i18n }) => (
  <>
    <Banner />
    <Section subSection={() => <Mdx code={i18n.mdx.whatIsClassic} />}>
      <Mdx code={i18n.mdx.whatIsBlockchain} />
    </Section>
    <WideSection className="shaded">
      <IconGrid
        icons={[
          {
            title: 'Decentalized',
            text: 'Open and welcoming grassroots community',
            icon: 'fas fa-users'
          },
          {
            title: 'Immutable',
            text: "Ledger remains untampered since it's 2015 inception",
            icon: 'fas fa-link'
          },
          {
            title: 'Unstoppable',
            text: 'Neutral platform where contracts are honored forever',
            icon: 'far fa-hourglass'
          }
        ]}
      />
    </WideSection>
    <WideSection className="dark">
      <Mdx code={i18n.mdx.getStarted} />
    </WideSection>
    <Section subSection={() => <Mdx code={i18n.mdx.stayCurrent} />}>
      <h2>Latest Blog Posts</h2>
      <LatestBlogPosts />
    </Section>
  </>
);

export default Landing;