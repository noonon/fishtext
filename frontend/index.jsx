/**
 * Created by noonon on 6/12/16.
 */
import React from 'react';
import ReactDOM from 'react-dom';

require('./style/index.styl');

var MainComponent = require('./components/main.jsx')(React);

ReactDOM.render(<MainComponent/>, document.querySelector('.container'));
