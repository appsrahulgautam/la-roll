"use client";

import { BunnyAvatar } from "./BunnyAvatar";
import { BearAvatar } from "./BearAvatar";
import { CatAvatar } from "./CatAvatar";
import { DuckAvatar } from "./DuckAvatar";
import { ElephantAvatar } from "./ElephantAvatar";
import { GiraffeAvatar } from "./GiraffeAvatar";
import { PandaAvatar } from "./PandaAvatar";
import { LlamaAvatar } from "./LlamaAvatar";
import { FrogAvatar } from "./FrogAvatar";
import { MonkeyAvatar } from "./MonkeyAvatar";
import { RobotAvatar } from "./RobotAvatar";
import { FoxAvatar } from "./FoxAvatar";
import { OstrichAvatar } from "./OstrichAvatar";
import { WolfAvatar } from "./WolfAvatar";

type Props = {
  type: string;
  size?: number;
  state?: "idle" | "selected" | "new";
  reaction?: "like" | "heart" | null;
};

export function Avatar({
  type,
  size = 95,
  state = "idle",
  reaction = null,
}: Props) {
  const k = type.toLowerCase();

  if (k.includes("panda"))
    return <PandaAvatar size={size} state={state} reaction={reaction} />;
  if (k.includes("llama"))
    return <LlamaAvatar size={size} state={state} reaction={reaction} />;
  if (k.includes("frog"))
    return <FrogAvatar size={size} state={state} reaction={reaction} />;
  if (k.includes("monkey"))
    return <MonkeyAvatar size={size} state={state} reaction={reaction} />;
  if (k.includes("robot"))
    return <RobotAvatar size={size} state={state} reaction={reaction} />;
  if (k.includes("fox"))
    return <FoxAvatar size={size} state={state} reaction={reaction} />;
  if (k.includes("ostrich"))
    return <OstrichAvatar size={size} state={state} reaction={reaction} />;
  if (k.includes("wolf"))
    return <WolfAvatar size={size} state={state} reaction={reaction} />;
  if (k.includes("bunny"))
    return <BunnyAvatar size={size} state={state} reaction={reaction} />;
  if (k.includes("bear"))
    return <BearAvatar size={size} state={state} reaction={reaction} />;
  if (k.includes("cat"))
    return <CatAvatar size={size} state={state} reaction={reaction} />;
  if (k.includes("duck"))
    return <DuckAvatar size={size} state={state} reaction={reaction} />;
  if (k.includes("elephant"))
    return <ElephantAvatar size={size} state={state} reaction={reaction} />;
  if (k.includes("giraffe"))
    return <GiraffeAvatar size={size} state={state} reaction={reaction} />;

  return <PandaAvatar size={size} state={state} reaction={reaction} />;
}
