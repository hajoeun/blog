import "./tweet.css";

import { kv } from "@vercel/kv";
import { type ReactNode, Suspense } from "react";
import {
  EmbeddedTweet,
  TweetNotFound,
  type TweetProps,
  TweetSkeleton,
} from "react-tweet";
import { getTweet, type Tweet } from "react-tweet/api";

import { Caption } from "./caption";

interface TweetArgs {
  id: string;
  caption: ReactNode;
}

async function getAndCacheTweet(id: string): Promise<Tweet | undefined> {
  // we first prioritize getting a fresh tweet
  try {
    const tweet = await getTweet(id);

    // @ts-ignore
    if (tweet && !tweet.tombstone) {
      // we populate the cache if we have a fresh tweet
      await kv.set(`tweet:${id}`, tweet);
      return tweet;
    }
  } catch (error) {
    console.error("tweet fetch error", error);
  }

  const cachedTweet: Tweet | null = await kv.get(`tweet:${id}`);

  // @ts-ignore
  if (!cachedTweet || cachedTweet.tombstone) return undefined;
  console.log("tweet cache hit", id);

  return cachedTweet;
}

const TweetContent = async ({ id, components }: TweetProps) => {
  const tweet = id ? await getAndCacheTweet(id) : undefined;

  if (!tweet) {
    return <TweetNotFound />;
  }

  return <EmbeddedTweet tweet={tweet} components={components} />;
};

export const ReactTweet = (props: TweetProps) => (
  <Suspense fallback={<TweetSkeleton />}>
    {/* @ts-ignore: Async components are valid in the app directory */}
    <TweetContent {...props} />
  </Suspense>
);

export async function Tweet({ id, caption }: TweetArgs) {
  return (
    <div className="tweet my-6">
      <div className={`flex justify-center`}>
        <ReactTweet id={id} />
      </div>
      {caption && <Caption>{caption}</Caption>}
    </div>
  );
}
