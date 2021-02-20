define([
	'jquery',
	'notify'
], function (
	$,
	Notify
) {
	return function () {
		$('#manipulate-notify-1').click(function () {
			new Notify({
				content: '普通通知，不自动关闭，请选择接下来的操作！<br/>通知和消息有3点不同：<br/>1. 通知可以有其他按钮<br/>2. 通知可以是富文本<br/>3. 通知不遮挡',
				handleList: [{
					text: '关闭'
				}, {
					text: '确定',
					isPrimary: true,
					callback: function () {
						console.log('确定！');
					}
				}]
			});
		});

		$('#manipulate-notify-2').click(function () {
			new Notify({
				time: 2000,
				content: '成功通知，2秒钟之后关闭！',
				type: 'success'
			});
		});

		$('#manipulate-notify-3').click(function () {
			new Notify({
				content: '失败通知，不自动关闭！',
				type: 'fail'
			});
		});

	}
});