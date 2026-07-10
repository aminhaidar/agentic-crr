/**
 * Runs on staged files only (lint-staged passes the changed paths), so the
 * commit gate is about YOUR changes — a file another agent broke elsewhere in
 * the tree can't block your commit.
 *
 * Prettier respects .prettierignore and ESLint respects its flat-config
 * `ignores`, so the verbatim prototype files (legacy.ts, shell.html,
 * prototype.css, docs_raw.json) are skipped even when staged. `--ignore-unknown`
 * / `--no-warn-ignored` keep those skips from failing the run.
 */
export default {
  "*.{ts,tsx,js,mjs,cjs,json,yaml,yml,md,html,css,scss}": [
    "prettier --write --ignore-unknown",
  ],
  "*.{ts,tsx}": ["eslint --fix --no-warn-ignored"],
};
