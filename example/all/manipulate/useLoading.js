define([
	'jquery',
	'loading'
], function (
	$,
	Loading
) {
	return function () {
		var loading1 = new Loading($('#manipulate-card-body').get(0));

		$('#manipulate-loading-1').click(function () {
			loading1.show();

			setTimeout(function () {
				loading1.hide();
			}, 1000);
		})
	}
});