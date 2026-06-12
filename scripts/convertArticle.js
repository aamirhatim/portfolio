import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MD_DIR = path.join(__dirname, '../src/data/articles/md');
const JSON_DIR = path.join(__dirname, '../src/data/articles');

function errorAndExit(message) {
    console.error(`Error: ${message}`);
    process.exit(1);
}

// 1. Get article name from command line
const args = process.argv.slice(2);
if (args.length === 0) {
    errorAndExit("Please provide an article name. Usage: node convertArticle.js <article_name.md>");
}

const articleName = args[0];
const mdFilePath = path.join(MD_DIR, articleName);

// 2. Validate file existence
if (!fs.existsSync(mdFilePath)) {
    errorAndExit(`File not found: ${mdFilePath}`);
}

// 3. Read file content
const content = fs.readFileSync(mdFilePath, 'utf-8');
const lines = content.split('\n');

// 4. Extract Publish Date (First line)
if (lines.length === 0) {
    errorAndExit("File is empty.");
}

const publishDateLine = lines[0].trim();
if (!publishDateLine) {
    errorAndExit("Publish date (first line) is missing.");
}
// Basic validation for Month Year
if (!/^[a-zA-Z]+ \d{4}$/.test(publishDateLine)) {
    errorAndExit(`Invalid publish date format: "${publishDateLine}". Expected "Month Year" (e.g., "March 2020").`);
}

const articleJson = {
    publishDate: publishDateLine,
    blocks: []
};

const IMAGE_REGEX = /^\((.+)\)\((sm|md|lg|xl)\)(?:\[(.*)\])?$/;
const LIST_ITEM_REGEX = /^[*-] |\d+\. /;

const isListItem = (line) => LIST_ITEM_REGEX.test(line.trim());
const isBlockStart = (trimmedLine) =>
    trimmedLine.startsWith('#') ||
    trimmedLine.startsWith('```') ||
    trimmedLine.startsWith('$') ||
    IMAGE_REGEX.test(trimmedLine) ||
    isListItem(trimmedLine);

// 5. Parse Blocks
let i = 1; // Start from second line

while (i < lines.length) {
    const trimmedLine = lines[i].trim();

    if (!trimmedLine) {
        i++;
        continue;
    }

    // Code blocks
    if (trimmedLine.startsWith('```')) {
        const language = trimmedLine.slice(3).trim() || "text";
        let codeContent = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
            codeContent.push(lines[i]);
            i++;
        }
        if (i >= lines.length) errorAndExit("Unclosed code block.");

        articleJson.blocks.push({ type: "code", language, content: codeContent.join('\n') });
        i++;
        continue;
    }

    // Formulas
    if (trimmedLine.startsWith('$')) {
        let formulaContent = trimmedLine;
        if (trimmedLine.startsWith('$$') && !trimmedLine.endsWith('$$') && trimmedLine.length > 2) {
            i++;
            while (i < lines.length && !lines[i].trim().endsWith('$$')) {
                formulaContent += '\n' + lines[i];
                i++;
            }
            if (i < lines.length) {
                formulaContent += '\n' + lines[i].trim();
                i++;
            }
        } else {
            i++;
        }
        articleJson.blocks.push({ type: "formula", content: formulaContent });
        continue;
    }

    // Titles (Section levels 0-2)
    if (trimmedLine.startsWith('#') && !trimmedLine.startsWith('####')) {
        const hashMatch = trimmedLine.match(/^(#+)/);
        const level = hashMatch[1].length - 1;

        if (level > 2) errorAndExit(`Invalid title level: ${level + 1} hashes. Max 3 for section titles.`);

        articleJson.blocks.push({ type: "title", level, content: trimmedLine.slice(level + 1).trim() });
        i++;
        continue;
    }

    // Lists (including #### titles)
    if (trimmedLine.startsWith('####') || isListItem(trimmedLine)) {
        let listTitle = "";
        let ordered = false;
        let currentTrimmed = trimmedLine;

        if (currentTrimmed.startsWith('####')) {
            listTitle = currentTrimmed.slice(4).trim();
            i++;
            while (i < lines.length && !lines[i].trim()) i++;
            if (i >= lines.length || !isListItem(lines[i])) errorAndExit(`Expected list item after title "${listTitle}".`);
            currentTrimmed = lines[i].trim();
        }

        ordered = /^\d+\. /.test(currentTrimmed);
        const items = [];

        while (i < lines.length) {
            let line = lines[i].trim();
            if (!line) {
                let nextIdx = i + 1;
                while (nextIdx < lines.length && !lines[nextIdx].trim()) nextIdx++;
                if (nextIdx < lines.length && isListItem(lines[nextIdx]) && (/^\d+\. /.test(lines[nextIdx].trim()) === ordered)) {
                    i = nextIdx;
                    line = lines[i].trim();
                } else break;
            }

            if ((ordered && /^\d+\. /.test(line)) || (!ordered && /^[*-] /.test(line))) {
                items.push(line.replace(/^[*-] |\d+\. /, ""));
                i++;
            } else break;
        }

        articleJson.blocks.push({ type: "list", title: listTitle, border: true, ordered, items });
        continue;
    }

    // Images
    const imageMatch = trimmedLine.match(IMAGE_REGEX);
    if (imageMatch) {
        articleJson.blocks.push({ type: "image", url: imageMatch[1], size: imageMatch[2], caption: imageMatch[3] || "" });
        i++;
        continue;
    }

    // Paragraphs
    let paragraphLines = [];
    while (i < lines.length) {
        const line = lines[i].trim();
        if (!line || isBlockStart(line)) break;
        paragraphLines.push(line);
        i++;
    }

    if (paragraphLines.length > 0) {
        articleJson.blocks.push({ type: "paragraph", content: paragraphLines.join(' ') });
    } else i++;
}

if (articleJson.blocks.length === 0) errorAndExit("No valid article blocks found.");

// 6. Export JSON
const outputFileName = articleName.replace(/\.md$/, '.json');
const outputFilePath = path.join(JSON_DIR, outputFileName);
fs.writeFileSync(outputFilePath, JSON.stringify(articleJson, null, 4));
console.log(`Successfully converted ${articleName} to ${outputFileName}`);
