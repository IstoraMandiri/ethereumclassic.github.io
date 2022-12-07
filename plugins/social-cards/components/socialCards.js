import React from "react";
import MD5 from "crypto-js/md5";
import { Helmet } from "react-helmet";

// import the default card, or override with custom
// todo make everything configurable
import { useEffect, useState } from "react";

// TODO try and make it work without re-rendering each on each navigation -_-
const withTwoPassRendering =
  (WrappedComponent) =>
  ({ children, ...rest }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, [setIsClient]);

    return (
      <WrappedComponent {...rest} key={isClient}>
        {children}
      </WrappedComponent>
    );
  };

function SocialCards({ data, children }) {
  // TODO use sitepage url, configurable prefix etc.
  // only do work if if the URL param is set or we are generating static html
  const hash = MD5(JSON.stringify(data)).toString();
  const imageUrl = `http://localhost:9000/static/social-card-${hash}.png`;
  const metaImage = (
    <Helmet>
      <meta
        key="og:image"
        property="og:image"
        content={imageUrl}
        data-hash={hash}
      />
    </Helmet>
  );
  if (
    typeof window === "undefined" ||
    !window.location.search.includes("generateSocialCard")
  ) {
    return metaImage;
  }
  // render the social card itself
  return (
    <>
      {metaImage}
      <div
        id="gatsby-social-card"
        data-hash={hash}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 632,
          zIndex: 999,
          background: "white",
          overflow: "hidden",
        }}
      >
        {/* pass data to children instead of using default card */}
        {children ? (
          children
        ) : (
          <pre>
            <code>
              {JSON.stringify(
                { hash, path: window.location.pathname, data },
                null,
                2
              )}
            </code>
          </pre>
        )}
      </div>
      <div style={{ height: 640 }}></div>
    </>
  );
}

export default withTwoPassRendering(SocialCards);
