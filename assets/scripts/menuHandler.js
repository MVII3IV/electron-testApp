const $ = require('jquery');
const {remote} = require('electron');

var win = remote.getCurrentWindow();

$('#min-btn').click(function () {
    win.minimize();
});

$('#close-btn').click(function () {
    win.close();
});
