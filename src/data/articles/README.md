# Editing Our Stories

`posts.json` preserves the imported archive, including its original text, dates, categories, and image credits.

`story-editorial.json` holds the reader-facing topic assignments and reviewed preview summaries, keyed by the existing article slug. Topics are listed in `../storyTopics.ts`. More than one topic may be assigned when a story spans subjects. Every article in the current collection has an explicit assignment.

The first six articles in the archive have newly written summaries checked against their complete source text. Other previews retain their imported excerpts pending editorial review. Original categories remain searchable, and older category links continue to filter the archive.

To add an article, obtain its final text, author credit, publication date, photographs, captions, and image permissions or credits. Add the article to `posts.json`, then add a matching entry to `story-editorial.json` with one or more topics and a short, complete summary. Do not label an older article as newly published simply because its preview was edited.

Keep summaries factual and brief, usually one or two sentences. Preserve uncertainty in the source. Never reconstruct missing article text from a title or an earlier discussion.
