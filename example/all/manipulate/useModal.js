define([
	'jquery',
	'mock',
	'modal',
	'util/renderEjs',
	'text!./modal.ejs'
], function (
	$,
	Mock,
	Modal,
	renderEjs,
	cardManipulateHTML
) {
	return function () {

		$('#manipulate-modal-1').click(function () {
			var modal1 = new Modal({
				title: '请您夸夸我',
				size: 'small',
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
			});

			modal1.open();
		});

		var data = Mock.mock({
			'array1|30': ['@cparagraph(3, 5)']
		});

		$('#manipulate-modal-2').click(function () {
			var modal1 = new Modal({
				title: '模态框1',
				content: renderEjs(cardManipulateHTML, {arr: data.array1})
			});

			modal1.open();

			$('#manipulate-modal-button-1').click(function () {
				var modal2 = new Modal({
					title: '模态框2',
					size: 'small',
					content: '<button class="wd-button" id="manipulate-modal-button-2">再套一个！</button></div>'
				});

				modal2.open();

				$('#manipulate-modal-button-2').click(function () {
					var modal3 = new Modal({
						title: '模态框3',
						size: 'small',
						content: '行了，请不要再套了。'
					});

					modal3.open();
				});
			})
		});
	}
});