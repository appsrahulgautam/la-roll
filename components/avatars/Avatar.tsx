"use client";

import { Bear } from "./Bear";
import { Hedgehog } from "./Hedgehog";
import { Deer } from "./Deer";
import { Owl } from "./Owl";
import { Raccoon } from "./Raccoon";
import { Squirrel } from "./Squirrel";

import { Puppy } from "./Puppy";
import { Turtle } from "./Turtle";
import { Lion } from "./Lion";
import { Octopus } from "./Octopus";
import { Mouse } from "./Mouse";

export type AvatarState = "idle" | "new" | "selected";
export type AvatarReaction = "like" | "heart" | null;

export type AvatarProps = {
  type: string;
  size?: number;
  state?: AvatarState;
  reaction?: AvatarReaction;
};

export function Avatar({
  type,
  size = 220,
  state = "idle",
  reaction = null,
}: AvatarProps) {
  const props = {
    size,
    state,
    reaction,
  };

  switch (type) {
    // Original 10
    case "bear":
      return <Bear {...props} />;

    // Characters 11–15
    case "hedgehog":
      return <Hedgehog {...props} />;

    case "deer":
      return <Deer {...props} />;

    case "owl":
      return <Owl {...props} />;

    case "raccoon":
      return <Raccoon {...props} />;

    case "squirrel":
      return <Squirrel {...props} />;

    // Characters 16–20
    case "puppy":
      return <Puppy {...props} />;

    case "turtle":
      return <Turtle {...props} />;

    case "lion":
      return <Lion {...props} />;

    case "octopus":
      return <Octopus {...props} />;

    case "mouse":
      return <Mouse {...props} />;

    // Safe fallback
    default:
      return <Bear {...props} />;
  }
}
