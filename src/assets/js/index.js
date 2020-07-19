// import '../styles/styles.css'
import '../styles/main.sass'

import * as $ from 'jquery';
import Post from './Post';
import json from './json';




const post = new Post('Webpack post title');

$('pre').html(post.toString());

console.log('JSON:', json);

