import assert from "node:assert/strict";
import test from "node:test";

import { githubSlug, markdownAnchors, stripHtmlTags } from "../scripts/markdown-anchors.mjs";

test("GitHub-style slugs normalize punctuation and whitespace", () => {
  assert.equal(githubSlug("  The FDE Guide!  "), "the-fde-guide");
});

test("inline HTML tags are removed without re-forming nested markup", () => {
  assert.equal(stripHtmlTags("Use <em>bounded</em> tools"), "Use bounded tools");
  assert.equal(githubSlug("<<script>>alert</script>"), "alert");
  assert.doesNotMatch(githubSlug("<<script>>alert</script>"), /[<>]/);
});

test("duplicate headings and explicit anchors receive stable unique slugs", () => {
  const anchors = markdownAnchors([
    "# Release gate",
    "# Release gate",
    '<a id="release-gate-2"></a>',
    "# Release gate",
  ].join("\n"));

  assert.deepEqual([...anchors], ["release-gate-2", "release-gate", "release-gate-1", "release-gate-3"]);
});
