import * as $ from 'jquery';
import Post from './Post';
import json from './assets/json';
import './styles/styles.css'
import './styles/sass.sass'

const post = new Post('Webpack post title');


$('pre').html(post.toString());

console.log('JSON:', json);

