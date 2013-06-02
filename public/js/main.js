jQuery(function() {
	var msg_template  = '<p><span class="msg-block"><strong></strong><span class="time"></span><span class="msg"></span></span></p>'
	   ,chat_template = '<li id="<%= nickname %>"><a href="#"><img alt="" src="img/demo/av1.jpg" /> <span><%= nickname %></span></a></li>';

	socket.on('connect', function() {
		socket.emit('nickname', 'usuario_' + new Date().getTime());
	});

	$('.chat-message button').click(function(){
		var input = $(this).siblings('span').children('input[type=text]');				

		if(input.val() != ''){
			socket.emit('sendyou', {text: input.val()});
		}		
	});

	socket.on('sendyou', function(data) {
		add_message(data.nick,'img/demo/av1.jpg',data.message.text,true);
	});

	socket.on('counter', function(data) {
	    var  inner = $('#chat-messages-inner');
	    inner.append('<p class="online"><span>Hay ' + data.number + '</span></p>');
	    inner.hide().fadeIn(800);
	});

	$('.chat-message input').keypress(function(e){
		if(e.which == 13) {	
			if($(this).val() != ''){
				socket.emit('sendyou', {text: $(this).val()}, true);
			}		
		}
	});

	socket.on('nicknames', function(data) {
		var template = _.template(chat_template);
		jQuery('.contact-list').empty();
		_.each(data, function(item) {
			jQuery('.contact-list').append(template({nickname: item}));
		});
	});

	var i = 0;

	function add_message(name,img,msg,clear) {
		i = i + 1;
		var  inner = $('#chat-messages-inner');
		var time = new Date();
		var hours = time.getHours();
		var minutes = time.getMinutes();
		if(hours < 10) hours = '0' + hours;
		if(minutes < 10) minutes = '0' + minutes;
		var id = 'msg-'+i;
        var idname = name.replace(' ','-').toLowerCase();
		inner.append('<p id="'+id+'" class="user-'+idname+'"><img src="'+img+'" alt="" />'
										+'<span class="msg-block"><strong>'+name+'</strong> <span class="time">- '+hours+':'+minutes+'</span>'
										+'<span class="msg">'+msg+'</span></span></p>');
		$('#'+id).hide().fadeIn(800);
		if(clear) {
			$('.chat-message input').val('').focus();
		}
		$('#chat-messages').animate({ scrollTop: inner.height() },1000);
	}
});