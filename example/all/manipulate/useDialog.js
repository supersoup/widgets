define([
	'jquery',
	'dialog'
], function (
	$,
	dialog
) {
	return function () {
		$('#manipulate-dialog-1').click(function () {
			dialog.open({
				node: this,
				content: 'Hello, Widgets!'
			})
		});

		$('#manipulate-dialog-2').click(function () {
			dialog.open({
				node: this,
				content: '您将会去给我一个赞吗？',
				handleList: [{
					text: '不了'
				}, {
					text: '好的',
					isPrimary: true,
					callback: function () {
						window.open('https://github.com/supersoup/widgets', '_blank')
					}
				}]
			})
		});
	}
});