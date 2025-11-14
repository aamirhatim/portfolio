# Overall structure

{
    "publishDate": "string",
    "blocks": []
}

# Block types

## Paragraph

If there is a `<br>` tag, create a new section. Preserve other inline html.

{
    "type": "paragraph",
    "content": "string"
}

## Title

The `level` property can be a number from 0 to 2. `h2` tags are 0, `h3` tags are 1 and `h4` tags are 2.

{
    "type": "title",
    "level": "number"
}

## Image

The `size` property can be "sm", "md", "lg", or "xl".
The `caption` property is optional.

{
    "type": "image",
    "url": "string",
    "size": "string",
    "caption": "string"
}

## Code

{
    "type": "code",
    "language": "string",
    "content": "string"
}

## Table

The `title` and `caption` properties are optional.

{
    "type": "table",
    "title": "string",
    "caption": "string",
    "headers": ["string", "string"],
    "content": [
        ["string", "string"]
    ]
}

## List

The `title` property is optional.

{
    "type": "list",
    "ordered": "boolean",
    "title": "string",
    "items": ["string", "string"]
}

## Formula

{
    "type": "formula",
    "content: "string"
}