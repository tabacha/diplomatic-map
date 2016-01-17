/* This file is gernerated by grunt-require-gettext*/
define('i18n/<%= module %>.<%= language %>', [], function () {
    /*eslint quotes: 0*/
    return {
        'messages': {
            '': {
                'domain': '<%= module %>',
                'lang': '<%= language %>',
                'plural_forms': 'nplurals=<%= nplurals %>; plural=<%= plural %>;'
            },
<% for (var msgid in dictionary) {%>
            '<%= msgid %>': <%= JSON.stringify(dictionary[msgid]) %>,
<% } %>
        }
    };
});