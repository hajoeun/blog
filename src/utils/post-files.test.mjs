import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { getPostFiles } from './post-files.ts';

const postBody = `---
title: Test post
description: Test description
date: '2026-05-25T00:00:00.000Z'
---

Hello.
`;

function makePostRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'post-files-'));
}

function writePost(root, relativePath) {
  const fullPath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, postBody);
}

function hasActiveMdxSyntax(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  let isFrontmatter = false;
  let isCodeFence = false;

  return lines.some((line, index) => {
    if (index === 0 && line.trim() === '---') {
      isFrontmatter = true;
      return false;
    }
    if (isFrontmatter && line.trim() === '---') {
      isFrontmatter = false;
      return false;
    }
    if (line.trim().startsWith('```')) {
      isCodeFence = !isCodeFence;
      return false;
    }
    if (isFrontmatter || isCodeFence) return false;

    return /(^|[^\\])<[A-Z][A-Za-z0-9]*(\s|>|\/)/.test(line) || /style=\{\{/.test(line);
  });
}

test('discovers md and mdx posts directly under a year directory', () => {
  const root = makePostRoot();

  writePost(root, '2026/plain.md');
  writePost(root, '2026/rich.mdx');
  writePost(root, '2026/deep/ignored.md');
  writePost(root, 'AGENTS.md');

  const files = getPostFiles(root);

  assert.deepEqual(
    files.map((file) => ({
      slug: file.slug,
      year: file.year,
      id: file.id,
      extension: file.extension,
      fullPath: path.relative(root, file.fullPath),
    })),
    [
      {
        slug: '2026/plain',
        year: '2026',
        id: 'plain',
        extension: '.md',
        fullPath: '2026/plain.md',
      },
      {
        slug: '2026/rich',
        year: '2026',
        id: 'rich',
        extension: '.mdx',
        fullPath: '2026/rich.mdx',
      },
    ]
  );
});

test('rejects md and mdx files that resolve to the same slug', () => {
  const root = makePostRoot();

  writePost(root, '2026/duplicate.md');
  writePost(root, '2026/duplicate.mdx');

  assert.throws(() => getPostFiles(root), /Duplicate post slug "2026\/duplicate"/);
});

test('keeps mdx extension only for posts that use active MDX syntax', () => {
  const root = path.join(process.cwd(), 'src/posts');
  const postFiles = getPostFiles(root);
  const mdxFiles = postFiles.filter((postFile) => postFile.extension === '.mdx');

  assert.deepEqual(
    mdxFiles.map((postFile) => postFile.slug),
    ['2024/retrospective', '2025/retrospective']
  );
  assert.deepEqual(
    mdxFiles.filter((postFile) => !hasActiveMdxSyntax(postFile.fullPath)).map((postFile) => postFile.slug),
    []
  );
  assert.deepEqual(
    postFiles
      .filter((postFile) => postFile.extension === '.md' && hasActiveMdxSyntax(postFile.fullPath))
      .map((postFile) => postFile.slug),
    []
  );
});
