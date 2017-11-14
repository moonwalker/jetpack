import React, { Component } from 'react';
// import Remarkable from 'remarkable';
import md from 'marked'

// const md = new Remarkable({
//     html: true,        // Enable HTML tags in source
//     //xhtmlOut:     false,        // Use '/' to close single tags (<br />)
//     breaks: true,        // Convert '\n' in paragraphs into <br>
//     //langPrefix:   'language-',  // CSS language prefix for fenced blocks
//     //linkify:      false,        // Autoconvert URL-like text to links
//     // Enable some language-neutral replacement + quotes beautification
//     //typographer:  false,
//     // Double + single quotes replacement pairs, when typographer enabled,
//     // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
//     //quotes: '“”‘’',
//     // Highlighter function. Should return escaped HTML,
//     // or '' if the source string is not changed
//     //highlight: function (/*str, lang*/) { return ''; }
// });

md.setOptions({
    //renderer: new marked.Renderer(),
    //gfm: true,
    //tables: true,
    breaks: true,
    //pedantic: false,
    //sanitize: false,
    //smartLists: true,
    //smartypants: false
});

const parse = (markdown) => {
    const text = md(markdown); //md.render(markdown)
    return { __html: text };
}

export default (props) => {
    return (<div dangerouslySetInnerHTML={parse(props.source || '')}></div>)
}