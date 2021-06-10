/*
Big Thanks To:
https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla#Executing_Commands
*/

myStorage = window.localStorage;

var template = "<!DOCTYPE html><html><head><title>"
var templatf = "</title></head><body>"
var templatg = "</body></html>"
var default_title = "This is a title!"
var default_content = "<h1>This is a Header!</h1><p>This is just some example text to start us off</p>"

var title = ""
var content = ""

var title_input = document.getElementById("title");

// create temporary element with text of input and get width then delete
function getWidthOfInput() {
    var tmp = document.createElement("span");
    tmp.className = "input-element tmp-element";
    tmp.innerHTML = title_input.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    document.body.appendChild(tmp);
    var theWidth = tmp.getBoundingClientRect().width;
    document.body.removeChild(tmp);
    return theWidth;
}

// function to change width of input
function adjustWidthOfInput() {
    title_input.style.width = getWidthOfInput() + "px";
}


// bind function to input field
title_input.oninput = adjustWidthOfInput;

options = {
    "indent": "auto",
    "indent-spaces": 4,
    "wrap": 68,
    "wrap-attributes": true,
    "wrap-script-literals": true,
    "markup": true,
    "output-xml": false,
    "numeric-entities": false,
    "quote-marks": true,
    "quote-nbsp": false,
    "show-body-only": "auto",
    "quote-ampersand": false,
    "break-before-br": true,
    "tidy-mark": false,
    "show-warnings": false,
    "show-info": false,
    "show-errors": 0
}

// Load draft if exist
if (localStorage.getItem("draft_title") === null) {
    console.log("Draft not found!");
} else {
    title = myStorage.getItem('draft_title');
    content = myStorage.getItem('draft_body');
    if (!(content === default_content || content === "")) {
        if (confirm("Open last session? Title: " + myStorage.getItem('draft_title'))) {
            $('#title').val(title);
            $('#editor').empty();
            $('#editor').append(content);
        } else {
            console.log("The draft was found, but the user did not open it!");
            new_doc();
        }
    } else {
        new_doc();
    }
}

adjustWidthOfInput();
update_output();

// Prevent page leaving
window.onbeforeunload = function(e) {
    var msg = "Are you sure you want to leave? You may lost changes!";
    if (typeof e == "undefined") {
        e = window.event;
    }
    if (e) {
        e.returnValue = msg;
    }
    return msg;
}

// Prevents emptying of the title input field
$('#title').on('DOMSubtreeModified', function() {
    if ($('#title').val() == '') {
        $('#title').val(default_title);
    }
})

// Basic code
$('#editControls a').click(function(e) {
    switch ($(this).data('role')) {
        case 'h1':
        case 'h2':
        case 'p':
            document.execCommand('formatBlock', false, $(this).data('role'));
            break;
        default:
            document.execCommand($(this).data('role'), false, null);
            break;
    }
    update_output();
})

// Update output when changes are made
$('#editor').bind('blur keyup paste copy cut mouseup', function(e) {
    update_output();
})

// New document
function new_doc() {
    $('#title').val(default_title);
    $('#editor').empty();
    $('#editor').append(default_content);
}

// Save draft if not blank document
function write_draft() {
    if (!($('#editor').html() === default_content || $('#editor').html() === "")) {
        myStorage.setItem('draft_title', $('#title').val());
        myStorage.setItem('draft_body', $('#editor').html());
    }
}

// Update output function
function update_output() {
    title = $('#title').val();
    if (document.getElementById("checkbox_body").checked) {
        $('#language-html').text(tidy_html5($('#editor').html(), options).trim());
    } else {
        $('#language-html').text(tidy_html5(template + title + templatf + $('#editor').html() + templatg, options).trim());
    }
    write_draft();
    hljs.highlightAll();
}

// Copy value to clipboard
function copy_val() {
    navigator.clipboard.writeText($('#language-html').text()).then(function() {
        console.log("Copied!");
    }, function() {
        alert("Failed to copy!");
    });
}


/**

// request permission on page load
document.addEventListener('DOMContentLoaded', function() {
    // Проверка поддержки браузером уведомлений
    if (!Notification) {
        alert('This browser does not support desktop notification. Try Chromium.');
        return;
    }

    if (Notification.permission !== 'granted')
        Notification.requestPermission();
});

function notifyMe(msg) {
    // Проверка разрешения на отправку уведомлений
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
    // В противном случае, запрашиваем разрешение
    else {
        var notification = new Notification("Clipboard", {
            icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
            body: msg,
        });
    }
}**/