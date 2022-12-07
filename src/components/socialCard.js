import React from "react";
import tw from "twin.macro";
import { uniqBy } from "lodash";

import Icon from "./icon";
import FormattedDate from "./formattedDate";
import { useGlobals } from "../../plugins/translations-plugin/src/components/localizationProvider";

/*

TODO

- Small square, default cards
- Landing page special version
- Hide description if at a specific height
- check pages / categories
- don't use hard-coded localhost in render
- Fix line-clamp clipping
- Generate with categories
- only pass relevent data for hash generation...
- Deal with markdown? e.g. mining videos

*/

function Contributors({ contributors }) {
  const uniqueContributors = uniqBy(
    contributors.edges,
    ({ node: { githubId: id } }) => id
  );
  const small = uniqueContributors.length > 5;
  return (
    <div css={[tw`flex space-x-4`, small && tw`space-x-2`]}>
      {uniqueContributors.map(({ node: { githubImage, githubId } }) => (
        <div key={githubId}>
          {/* TODO size based on count */}
          <img
            css={[
              tw`rounded-full bg-white`,
              small ? tw`h-10 w-10` : tw`h-16 w-16`,
            ]}
            src={
              githubImage.childImageSharp.gatsbyImageData.images.fallback.src
            }
            alt={githubId}
          />
        </div>
      ))}
    </div>
  );
}

export default function SocialCard({
  siteTitle,
  title,
  author,
  contributors,
  description,
  dynamicImage,
  published,
  category,
}) {
  const isBlog = category === "blog";
  const contributorImages = contributors && contributors.edges.length > 0;
  const { ui } = useGlobals();
  return (
    <div tw="h-full w-full p-14 bg-primary-dark text-white drop-shadow-md">
      <div css={[tw`h-full w-full relative z-20`, dynamicImage && tw`pr-80`]}>
        <div tw="flex items-center space-x-5">
          <div>
            <Icon icon="etc" tw="w-16 h-16" />
          </div>
          <div tw="font-display tracking-widest text-4xl">
            {siteTitle}
            {isBlog && ` ${ui.newsTypes.blog.name}`}
          </div>
        </div>
        <div tw="text-5xl font-display font-extrabold line-clamp-3 my-14 leading-tight">
          {title}
        </div>
        {isBlog && published && (
          <div tw="text-3xl">
            <FormattedDate date={published} long />
          </div>
        )}
        {/* TODO hide if long title */}
        {!isBlog && description && (
          <div tw="text-3xl line-clamp-3">{description}</div>
        )}
        <div tw="absolute bottom-0">
          <div tw="text-3xl flex items-center space-x-6">
            {contributorImages && <Contributors contributors={contributors} />}
            {isBlog && (
              <div tw="flex items-center space-x-4">
                {!contributorImages && <Icon icon="pen" tw="w-4" />}
                {author && <div>{author}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
      {dynamicImage && (
        <div tw="absolute bottom-0 top-0 -right-32 z-10">
          <img
            tw="bg-white h-full"
            src={
              dynamicImage.childImageSharp.gatsbyImageData.images.fallback.src
            }
            alt=""
          />
          <div tw="bg-gradient-to-r from-primary-dark to-transparent inset-0 absolute -right-1/3"></div>
        </div>
      )}
    </div>
  );
}
