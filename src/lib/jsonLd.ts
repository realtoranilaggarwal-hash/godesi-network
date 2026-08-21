/**
 * Community-supplied text ends up inside `<script type="application/ld+json">`,
 * and JSON.stringify leaves `<` alone — so a title containing `</script>` would
 * close the tag and run as markup.
 */
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(
    /[<>&\u2028\u2029]/g,
    (character) =>
      `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );
}
