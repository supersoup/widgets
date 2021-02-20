define([
	'jquery',
	'message'
], function (
	$,
	Message
) {
	return function () {
		$('#manipulate-message-1').click(function () {
			new Message({
				time: 2000,
				content: '普通消息，2秒钟之后关闭！'
			});
		});

		$('#manipulate-message-2').click(function () {
			new Message({
				time: 2000,
				content: '成功消息，2秒钟之后关闭！',
				type: 'success'
			});
		});

		$('#manipulate-message-3').click(function () {
			new Message({
				content: '失败消息，不自动关闭！',
				type: 'fail'
			});
		});

	}
});