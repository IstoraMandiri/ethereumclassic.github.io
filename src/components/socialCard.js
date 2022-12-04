import React from "react";
import "twin.macro";

export default function SocialCard(props) {
  console.log("hello", props);
  return (
    <div tw="h-full w-full bg-red-100">
      <div tw="text-6xl p-20">{props.pageTitle}</div>
      <div tw="text-3xl p-20">{props.author}</div>
    </div>
  );
}
