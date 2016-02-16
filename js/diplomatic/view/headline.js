define('diplomatic/view/headline', [
    'jquery',
    'gettext!diplomatic',
    'css!diplomatic/view/headline',
    'bootstrap',
], function ($, gt) {

    'use strict';

    var menu = {
        'index.html': gt('OpenDiplomaticMap'),
        'de-validator.html': gt('Embassies with target Germany'),
        'de-ausland.html': gt('German embassies'),
    };

    function create(id) {
        var navbar=$('<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">');
        var container=$(' <div class="container">');
        var button=$('<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">');
        var collapse=$('<div class="collapse navbar-collapse">');
        var ul=$('<ul class="nav navbar-nav">');
        button.append($('<span class="sr-only">').text(gt('Toggle navigation')));
        button.append($('<span class="icon-bar">'));
        button.append($('<span class="icon-bar">'));
        button.append($('<span class="icon-bar">'));
        container.append(button);
        navbar.append(container);

/*        container.append($('<a class="navbar-brand" href="/#ueber">').text('Sven Anders'));*/
        container.append(collapse);
        collapse.append(ul);
        $.each(menu, function (url, title) {
            var li=$('<li>');
            if (url === id) {
                li.attr('class', 'active');
            }
            li.append($('<a>', {'href': url}).text(title));
            ul.append(li);
        });
//        ul.append($('<li class="active">').append($('<a href="/de-validator.html">').text(gt('Embassies in Germany'))));
//        ul.append($('<li>').append($('<a href="#">').text(gt('German Embassies'))));
        return navbar;
    }
    return create;
});