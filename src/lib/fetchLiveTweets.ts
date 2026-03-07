import protobuf from 'protobufjs';
import type { SiteMetadata } from '../content/sites';

export async function fetchLiveTweets(): Promise<SiteMetadata[]> {
    try {
        const root = await protobuf.load('/tweets.proto');
        const TweetList = root.lookupType('TweetList');

        // Fetch data from local static file
        const response = await fetch('/tweets.bin');
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();

        // Decode data
        const message = TweetList.decode(new Uint8Array(buffer));
        const decodedObject = TweetList.toObject(message, {
            enums: String,
            longs: String,
            bytes: String,
            defaults: true,
            arrays: true,
            objects: true,
            oneofs: true
        });

        const tweets = (decodedObject.tweets || []) as any[];

        return tweets.map((tweet) => {
            const safeImages = Array.isArray(tweet.images) ? tweet.images : [];
            const safeTags = Array.isArray(tweet.tags) ? tweet.tags.map((t: string) => t.toLowerCase()) : [];
            const safeAesthetics = Array.isArray(tweet.aesthetics) ? tweet.aesthetics.map((t: string) => t.toLowerCase()) : [];
            const safeEffects = Array.isArray(tweet.effects) ? tweet.effects.map((t: string) => t.toLowerCase()) : [];
            const safeTypography = Array.isArray(tweet.typography) ? tweet.typography.map((t: string) => t.toLowerCase()) : [];
            const safeComposition = Array.isArray(tweet.composition) ? tweet.composition.map((t: string) => t.toLowerCase()) : [];
            const safeColorScheme = Array.isArray(tweet.colorScheme) ? tweet.colorScheme.map((t: string) => t.toLowerCase()) : [];
            const safeInteraction = Array.isArray(tweet.interaction) ? tweet.interaction.map((t: string) => t.toLowerCase()) : [];

            return {
                ...tweet,
                category: (tweet.category || '').toLowerCase(),
                tags: safeTags,
                aesthetics: safeAesthetics,
                effects: safeEffects,
                typography: safeTypography,
                composition: safeComposition,
                colorScheme: safeColorScheme,
                interaction: safeInteraction,
                images: safeImages,
                thumbnail: safeImages.length > 0 ? safeImages[0] : (tweet.thumbnail || '/fallback.png')
            } as SiteMetadata;
        });
    } catch (error) {
        console.error('Error fetching live tweets:', error);
        return [];
    }
}
