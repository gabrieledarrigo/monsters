var socket = io.connect('http://monsters.jit.su' || 'http://localhost');

var messageViewModel = function() {
    var self = this;

    self.user = {
        _id      : ko.observable(''),
        nickname : ko.observable(''),
        avatar   : ko.observable(''),
        active   : ko.observable(1)
    };

    self.message = ko.observable('');
    
    self.warningMessage = ko.observable('');

    self.messageList = ko.observableArray([]);

    self.warningMesaggeIsVisible = ko.observable(false);

    self.editorIsVisible = ko.observable(false);

    self.userPanelIsVisible = ko.observable(true);

    self.page = ko.observable(0);

    self.totalItem = ko.observable(0);

    self.checkMessage = ko.computed(function() {
        if (self.message().length >= 120) {
            self.message(self.message().substr(0, 120));
        }
    });

    self.charactersCount = ko.computed(function() {
        if (self.message().length >= 120) {
            self.warningMesaggeIsVisible(true);
        } else {
            self.warningMesaggeIsVisible(false);
        }

        return 120 - self.message().length;
    });

    self.setWarningMessage = function(state, message) {
        self.warningMesaggeIsVisible(state);
        self.warningMessage(message);
    };

    self.switchPanel = function (login) {
        if (login) {
            self.userPanelIsVisible(false);
            self.editorIsVisible(true);
        } else {
            self.userPanelIsVisible(true);
            self.editorIsVisible(false);
        }
        self.warningMessage('');
        self.warningMesaggeIsVisible(false);
    };

    self.showSocial = function (data, event) {
        $('.share span').show();
        $('.share ul').hide();

        $(event.currentTarget).find('span').hide();
        $(event.currentTarget).find('ul').show();

        Socialite.load(event.currentTarget);
    };

    self.checkWidth = function () {
        return $('#wall').width() + 18;
    };

    self.checkScroll = function () {
        if ($('#scrollable-wall').scrollTop() + $('#scrollable-wall').innerHeight() >= 
            $('#scrollable-wall')[0].scrollHeight) {

            if (self.messageList().length < self.totalItem()) {
                self.page(self.page() + 1);
                self.loadData(self.page());
            }
        }
    };

    self.login = function () {
        if(self.user.nickname().length === 0) {
            self.setWarningMessage(true, 'Choose a nickname');
            return false;
        }

        $.getJSON('/login', {nickname : self.user.nickname()}, function (user) {
            if (user) {
                self.user._id(user._id)
                         .nickname(user.nickname)
                         .avatar(user.avatar)
                         .active(user.active);

                sessionStorage._id = self.user._id();
                sessionStorage.nickname = self.user.nickname();
                sessionStorage.avatar = self.user.avatar();
                sessionStorage.active = self.user.active();

                self.switchPanel(true);
            }
        });
    };

    self.logout = function () {
        $.getJSON('/logout', {nickname : self.user.nickname()}, function (result) {
            if (result.active === 0) {
                sessionStorage.clear();
           
                self.user.active(result.active);

                self.switchPanel(false);     
            }
        });
    };

    self.initData = function() {
        if (window.sessionStorage && sessionStorage.nickname !== undefined) {
            self.user._id(sessionStorage._id)
                     .nickname(sessionStorage.nickname)
                     .avatar(sessionStorage.avatar)
                     .active(sessionStorage.active);

            self.switchPanel(true);
        } else {
            self.switchPanel(false);
        }

        self.loadData();
    };

    self.loadData = function (pages) {
        $(document).ajaxStart(function () {
            $('img#loading').show();
        });

        $.getJSON('/get-messages/' + self.page(), function(results) {
            for (var i = 0; i <= results.messages.length - 1; i += 1) {
                self.messageList.push(results.messages[i]);
            }
            self.totalItem(results.total);
        });

        $(document).ajaxComplete(function () {
            $('img#loading').hide();
            setTimeout(function() {
               
            }, 1000);
        });
    };

    self.receiveData = function() {
        socket.on('message', function(data) {
            self.messageList.unshift(data);
        });
    };

    self.emitMessage = function() {
        if (self.message().length === 0) {
            self.setWarningMessage(true, 'Insert your message!');
            return false;
        }

        var date = new Date();
        
        $.getJSON('/get-date/' + escape(date), function(result) {
            var data = {
                _user : ko.toJS(self.user),
                message: self.message(),
                date: result.date,
                timestamp : date.getTime()
            };
            socket.emit('message', data);

            self.messageList.unshift(data);

            self.message('');
        });
    };

    self.initData();
    self.receiveData();
};

ko.applyBindings(new messageViewModel());
