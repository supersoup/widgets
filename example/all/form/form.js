define([
	'./useNumber',
	'./useSearch',
	'./useTreeChoose',
	'./useDatePicker',
	'./useSlider',
	'./useCheckboxes',
], function (
	useNumber,
	useSearch,
	useTreeChoose,
	useDatePicker,
	useSlider,
	useCheckboxes
) {
	return function () {
		useNumber();
		useSearch();
		useTreeChoose();
		useDatePicker();
		useSlider();
		useCheckboxes();
	}
});